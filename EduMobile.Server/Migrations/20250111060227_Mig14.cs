using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduMobile.Server.Migrations
{
    /// <inheritdoc />
    public partial class Mig14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DesignPhases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    SiteMapFilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsHierarchyClear = table.Column<bool>(type: "bit", nullable: false),
                    AreSectionsIdentified = table.Column<bool>(type: "bit", nullable: false),
                    AreLinksClear = table.Column<bool>(type: "bit", nullable: false),
                    AreVisualElementsUseful = table.Column<bool>(type: "bit", nullable: false),
                    Wireframe480pxPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Wireframe768pxPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Wireframe1024pxPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsMobileFirst = table.Column<bool>(type: "bit", nullable: false),
                    IsNavigationClear = table.Column<bool>(type: "bit", nullable: false),
                    IsDesignFunctional = table.Column<bool>(type: "bit", nullable: false),
                    IsVisualConsistencyMet = table.Column<bool>(type: "bit", nullable: false),
                    VisualDesignFilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AreVisualElementsBeneficialForSmallScreens = table.Column<bool>(type: "bit", nullable: false),
                    DoesDesignPrioritizeContentForMobile = table.Column<bool>(type: "bit", nullable: false),
                    DoesDesignImproveLoadingSpeed = table.Column<bool>(type: "bit", nullable: false),
                    ContentFilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AreContentsRelevantForMobile = table.Column<bool>(type: "bit", nullable: false),
                    AreContentsClearAndNavigable = table.Column<bool>(type: "bit", nullable: false),
                    DoContentsGuideUserAttention = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DesignPhases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DesignPhases_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DesignPhases_ProjectId",
                table: "DesignPhases",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DesignPhases");
        }
    }
}
