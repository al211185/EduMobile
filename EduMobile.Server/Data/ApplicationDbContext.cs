using EduMobile.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EduMobile.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Semester> Semesters { get; set; } // Tabla para los semestres
        public DbSet<SemesterStudent> SemesterStudents { get; set; } // Tabla intermedia
        public DbSet<Project> Projects { get; set; } // Tabla para proyectos
        public DbSet<Phase> Phases { get; set; } // Tabla para fases del proyecto

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configuración de claves y relaciones para SemesterStudent
            builder.Entity<SemesterStudent>()
                .HasKey(ss => new { ss.SemesterId, ss.StudentId }); // Clave compuesta

            builder.Entity<SemesterStudent>()
                .HasOne(ss => ss.Semester)
                .WithMany(s => s.SemesterStudents)
                .HasForeignKey(ss => ss.SemesterId)
                .OnDelete(DeleteBehavior.Cascade); // Configura el borrado en cascada

            builder.Entity<SemesterStudent>()
                .HasOne(ss => ss.Student)
                .WithMany()
                .HasForeignKey(ss => ss.StudentId)
                .OnDelete(DeleteBehavior.Restrict); // Evitar eliminación en cascada

            // Configuración de longitud para StudentId
            builder.Entity<SemesterStudent>()
                .Property(ss => ss.StudentId)
                .HasMaxLength(450); // Coincidir con la longitud de AspNetUsers.Id

            // Configuración para Project
            builder.Entity<Project>()
                .HasOne(p => p.Semester)
                .WithMany(s => s.Projects) // Relación con la colección de proyectos
                .HasForeignKey(p => p.SemesterId)
                .OnDelete(DeleteBehavior.Cascade); // Cambia a eliminación en cascada

            builder.Entity<Project>()
                .HasOne(p => p.CreatedBy)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.CreatedById)
                .OnDelete(DeleteBehavior.SetNull); // Permitir que un proyecto sobreviva sin su creador


            // Configuración para Phase
            builder.Entity<Phase>()
                .HasOne(p => p.Project)
                .WithMany()
                .HasForeignKey(p => p.ProjectId)
                .OnDelete(DeleteBehavior.Cascade); // Eliminar fases al eliminar un proyecto
        }
    }
}
