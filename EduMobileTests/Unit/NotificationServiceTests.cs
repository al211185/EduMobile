using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using EduMobile.Server.Data;
using EduMobile.Server.Models;
using EduMobile.Server.Services;

namespace EduMobileTests.Unit
{
    [TestClass]
    public class NotificationServiceTests
    {
        private ApplicationDbContext _db = null!;
        private NotificationService _svc = null!;
        private Mock<IEmailSender> _emailMock = null!;

        [TestInitialize]
        public void Init()
        {
            // 1) Configuramos el DbContext en memoria
            var opts = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .EnableSensitiveDataLogging()
                .Options;
            _db = new ApplicationDbContext(opts);

            // 2) Sembramos un profesor para los FK
            var profesor = new ApplicationUser
            {
                Id = "ADMIN001",
                UserName = "seed@edumobile",
                Email = "seed@edumobile",
                Nombre = "Seed",
                ApellidoPaterno = "User",
                ApellidoMaterno = "Test",
                Role = "Profesor"
            };
            _db.Users.Add(profesor);

            // 3) Sembramos un semestre completo (Course y ProfessorId son [Required])
            var semestre = new Semester
            {
                Id = 1,
                Name = "2025-1",
                Period = "Ene–Jun",
                Description = "Seed semester",
                Course = "Curso de Prueba",
                ProfessorId = profesor.Id
            };
            _db.Semesters.Add(semestre);

            // 4) Sembramos un proyecto ligado a ese semestre y profesor
            _db.Projects.Add(new Project
            {
                Id = 1,
                Title = "P1",
                Description = "Desc",
                StartDate = DateTime.UtcNow,
                CurrentPhase = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                SemesterId = semestre.Id,
                CreatedById = profesor.Id
            });

            _db.SaveChanges();

            // 5) Preparamos el mock y el servicio
            _emailMock = new Mock<IEmailSender>();
            _svc = new NotificationService(_db, _emailMock.Object);
        }

        [TestMethod]
        public async Task SendTeamNotification_NoUsers_DoesNotThrow()
        {
            await _svc.SendTeamNotificationAsync(1, "Sujeto", "Mensaje");
            _emailMock.Verify(x => x.SendEmailsAsync(
                It.IsAny<IEnumerable<string>>(),
                "Sujeto", "Mensaje"),
                Times.Once);
        }

        [TestMethod]
        public async Task SendTeamNotification_WithUser_CallsEmailSenderWithThatEmail()
        {
            // ----- AQUÍ ajustamos para que ApplicationUser tenga todos los campos [Required] -----
            var alumno = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "a@b.com",
                Email = "a@b.com",
                Nombre = "Alumno",
                ApellidoPaterno = "Test",
                ApellidoMaterno = "Test",
                Role = "Alumno"
            };
            _db.Users.Add(alumno);
            _db.SaveChanges();

            _db.ProjectUsers.Add(new ProjectUser
            {
                ProjectId = 1,
                ApplicationUserId = alumno.Id,
                RoleInProject = "Alumno"
            });
            _db.SaveChanges();

            await _svc.SendTeamNotificationAsync(1, "S", "M");
            _emailMock.Verify(x => x.SendEmailsAsync(
                    It.Is<IEnumerable<string>>(lst => new HashSet<string>(lst).Contains("a@b.com")),
                    "S", "M"),
                Times.Once);
        }

        [TestMethod]
        public void SendTeamNotification_EmailSenderThrows_ExceptionPropagates()
        {
            _emailMock
                .Setup(x => x.SendEmailsAsync(
                    It.IsAny<IEnumerable<string>>(),
                    It.IsAny<string>(),
                    It.IsAny<string>()))
                .ThrowsAsync(new InvalidOperationException("boom"));

            Func<Task> act = () => _svc.SendTeamNotificationAsync(1, "S", "M");
            act.Should()
               .ThrowAsync<InvalidOperationException>()
               .WithMessage("boom");
        }
    }
}
