using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduMobile.Server.Migrations
{
    /// <inheritdoc />
    public partial class Mig21Kanban : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentVersion",
                table: "DevelopmentPhases");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "DevelopmentPhases");

            migrationBuilder.DropColumn(
                name: "UnitTestsPassed",
                table: "DevelopmentPhases");

            migrationBuilder.RenameColumn(
                name: "Summary",
                table: "DevelopmentPhases",
                newName: "FunctionalRequirements");

            migrationBuilder.RenameColumn(
                name: "RepositoryUrl",
                table: "DevelopmentPhases",
                newName: "CustomTechnologies");

            migrationBuilder.RenameColumn(
                name: "Milestones",
                table: "DevelopmentPhases",
                newName: "CustomRequirements");

            migrationBuilder.RenameColumn(
                name: "IssuesFound",
                table: "DevelopmentPhases",
                newName: "AllowedTechnologies");

            migrationBuilder.CreateTable(
                name: "KanbanItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DevelopmentPhaseId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KanbanItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KanbanItems_DevelopmentPhases_DevelopmentPhaseId",
                        column: x => x.DevelopmentPhaseId,
                        principalTable: "DevelopmentPhases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KanbanItems_DevelopmentPhaseId",
                table: "KanbanItems",
                column: "DevelopmentPhaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KanbanItems");

            migrationBuilder.RenameColumn(
                name: "FunctionalRequirements",
                table: "DevelopmentPhases",
                newName: "Summary");

            migrationBuilder.RenameColumn(
                name: "CustomTechnologies",
                table: "DevelopmentPhases",
                newName: "RepositoryUrl");

            migrationBuilder.RenameColumn(
                name: "CustomRequirements",
                table: "DevelopmentPhases",
                newName: "Milestones");

            migrationBuilder.RenameColumn(
                name: "AllowedTechnologies",
                table: "DevelopmentPhases",
                newName: "IssuesFound");

            migrationBuilder.AddColumn<string>(
                name: "CurrentVersion",
                table: "DevelopmentPhases",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "DevelopmentPhases",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "UnitTestsPassed",
                table: "DevelopmentPhases",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
