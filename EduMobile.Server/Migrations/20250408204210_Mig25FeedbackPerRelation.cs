using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduMobile.Server.Migrations
{
    /// <inheritdoc />
    public partial class Mig25FeedbackPerRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TeacherFeedbacks_ProjectId_Phase",
                table: "TeacherFeedbacks",
                columns: new[] { "ProjectId", "Phase" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeacherFeedbacks_ProjectId_Phase",
                table: "TeacherFeedbacks");
        }
    }
}
