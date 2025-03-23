using EduMobile.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace EduMobile.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets existentes
        public DbSet<PlanningPhase> PlanningPhases { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<SemesterStudent> SemesterStudents { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Phase> Phases { get; set; }
        public DbSet<DesignPhase> DesignPhases { get; set; }
        public DbSet<DevelopmentPhase> DevelopmentPhases { get; set; }

        // NUEVO: DbSet para las tarjetas del Kanban
        public DbSet<KanbanItem> KanbanItems { get; set; }

        public DbSet<ProjectUser> ProjectUsers { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.UseCollation("Latin1_General_100_CI_AS_SC_UTF8");

            base.OnModelCreating(builder);

            builder.Entity<PlanningPhase>()
                   .HasOne(pp => pp.Project)
                   .WithOne(p => p.PlanningPhase)
                   .HasForeignKey<PlanningPhase>(pp => pp.ProjectId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Configuración 1:1 entre Project y DevelopmentPhase
            builder.Entity<DevelopmentPhase>()
                   .HasOne(dp => dp.Project)
                   .WithOne(p => p.DevelopmentPhase)
                   .HasForeignKey<DevelopmentPhase>(dp => dp.ProjectId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Configuración de la relación 1:N entre DevelopmentPhase y KanbanItem
            builder.Entity<KanbanItem>()
                   .HasOne(ki => ki.DevelopmentPhase)
                   .WithMany(dp => dp.KanbanItems)
                   .HasForeignKey(ki => ki.DevelopmentPhaseId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Configuración de SemesterStudent
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

            builder.Entity<SemesterStudent>()
                .Property(ss => ss.StudentId)
                .HasMaxLength(450);

            // Configuración de Project
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

            // Configuración de Phase
            builder.Entity<Phase>()
                .HasOne(p => p.Project)
                .WithMany()
                .HasForeignKey(p => p.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de DesignPhase
            builder.Entity<DesignPhase>()
                .HasOne(dp => dp.Project)
                .WithMany(p => p.DesignPhases)
                .HasForeignKey(dp => dp.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Nueva configuración para ProjectUser
            builder.Entity<ProjectUser>()
                .HasKey(pu => new { pu.ProjectId, pu.ApplicationUserId });

            builder.Entity<ProjectUser>()
                .HasOne(pu => pu.Project)
                .WithMany(p => p.ProjectUsers)
                .HasForeignKey(pu => pu.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProjectUser>()
                .HasOne(pu => pu.ApplicationUser)
                .WithMany(u => u.ProjectUsers)
                .HasForeignKey(pu => pu.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
