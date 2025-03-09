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

        // NUEVO: DbSet para la fase de planeación
        public DbSet<PlanningPhase> PlanningPhases { get; set; }

        // Ya existentes
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<SemesterStudent> SemesterStudents { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Phase> Phases { get; set; }
        public DbSet<DesignPhase> DesignPhases { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ========== Relación 1:1 entre Project y PlanningPhase ==========
            builder.Entity<PlanningPhase>()
                   .HasOne(pp => pp.Project)
                   .WithOne(p => p.PlanningPhase)
                   .HasForeignKey<PlanningPhase>(pp => pp.ProjectId)
                   .OnDelete(DeleteBehavior.Cascade);

            // ========== Configuración de SemesterStudent ==========
            builder.Entity<SemesterStudent>()
                .HasKey(ss => new { ss.SemesterId, ss.StudentId });

            builder.Entity<SemesterStudent>()
                .HasOne(ss => ss.Semester)
                .WithMany(s => s.SemesterStudents)
                .HasForeignKey(ss => ss.SemesterId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SemesterStudent>()
                .HasOne(ss => ss.Student)
                .WithMany()
                .HasForeignKey(ss => ss.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Longitud para StudentId (coincide con AspNetUsers.Id)
            builder.Entity<SemesterStudent>()
                .Property(ss => ss.StudentId)
                .HasMaxLength(450);

            // ========== Configuración de Project ==========
            builder.Entity<Project>()
                .HasOne(p => p.Semester)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.SemesterId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Project>()
                .HasOne(p => p.CreatedBy)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.CreatedById)
                .OnDelete(DeleteBehavior.SetNull);

            // ========== Configuración de Phase ==========
            builder.Entity<Phase>()
                .HasOne(p => p.Project)
                .WithMany()
                .HasForeignKey(p => p.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ========== Configuración de DesignPhase ==========
            builder.Entity<DesignPhase>()
                .HasOne(dp => dp.Project)
                .WithMany(p => p.DesignPhases)
                .HasForeignKey(dp => dp.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
