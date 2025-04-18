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

        // NUEVO: DbSet para la retroalimentación del profesor
        public DbSet<TeacherFeedback> TeacherFeedbacks { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        // NUEVO: DbSet para PhaseAssignment
        public DbSet<PhaseAssignment> PhaseAssignments { get; set; }

        public DbSet<GameScore> GameScores { get; set; }



        protected override void OnModelCreating(ModelBuilder builder)
        {
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

            // Nueva configuración para TeacherFeedback
            // Se impone un índice único para evitar que haya más de una retroalimentación por proyecto y fase.
            builder.Entity<TeacherFeedback>()
                .HasIndex(tf => new { tf.ProjectId, tf.Phase })
                .IsUnique();

            builder.Entity<Notification>(entity =>
            {
                // Fuerza la propiedad UserId a ser opcional (nullable)
                entity.Property(n => n.UserId)
                      .IsRequired(false);

                // Configura la relación con ApplicationUser
                entity.HasOne(n => n.User)
                      .WithMany(u => u.Notifications)  // Asegúrate de que en ApplicationUser exista la colección Notifications
                      .HasForeignKey(n => n.UserId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configuración para PhaseAssignment
            builder.Entity<PhaseAssignment>(entity =>
            {
                entity.HasKey(pa => pa.Id);

                entity.HasOne(pa => pa.Project)
                      .WithMany(p => p.PhaseAssignments)
                      .HasForeignKey(pa => pa.ProjectId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pa => pa.ApplicationUser)
                      .WithMany(u => u.PhaseAssignments)
                      .HasForeignKey(pa => pa.ApplicationUserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Aquí, la propiedad AssignedPhase se maneja automáticamente como int (o enum)
            });

            builder.Entity<GameScore>()
                .HasIndex(gs => gs.UserId)
                .IsUnique();


        }
    }
}
