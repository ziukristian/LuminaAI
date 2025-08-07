using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackSocial.MentalHealthApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class addMentalHealthReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "UserName");

            migrationBuilder.CreateTable(
                name: "MentalHealthReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentalHealthReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentalHealthReports_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MentalHealthReports_UserId",
                table: "MentalHealthReports",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MentalHealthReports");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Users",
                newName: "Username");
        }
    }
}
