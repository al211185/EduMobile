using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduMobile.Server.Migrations
{
    /// <inheritdoc />
    public partial class Mig11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Semesters_SemesterId",
                table: "Projects");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Semesters_SemesterId",
                table: "Projects",
                column: "SemesterId",
                principalTable: "Semesters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Semesters_SemesterId",
                table: "Projects");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Semesters_SemesterId",
                table: "Projects",
                column: "SemesterId",
                principalTable: "Semesters",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
