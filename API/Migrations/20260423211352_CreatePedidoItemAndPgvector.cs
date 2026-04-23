using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class CreatePedidoItemAndPgvector : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS vector;");
            
            migrationBuilder.CreateTable(
                name: "tbmovimentacao_estoque",
                columns: table => new
                {
                    mov_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    var_id = table.Column<int>(type: "integer", nullable: false),
                    mov_nr_quantidade = table.Column<int>(type: "integer", nullable: false),
                    mov_tp_tipo = table.Column<string>(type: "text", nullable: false),
                    mov_dh_data = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    mov_ds_observacao = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbmovimentacao_estoque", x => x.mov_id);
                });

            migrationBuilder.CreateTable(
                name: "tbpedido_item",
                columns: table => new
                {
                    item_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ped_id = table.Column<int>(type: "integer", nullable: false),
                    prod_id = table.Column<int>(type: "integer", nullable: false),
                    var_id = table.Column<int>(type: "integer", nullable: true),
                    item_nm_produto = table.Column<string>(type: "text", nullable: false),
                    item_nr_quantidade = table.Column<int>(type: "integer", nullable: false),
                    item_vl_unitario = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbpedido_item", x => x.item_id);
                    table.ForeignKey(
                        name: "FK_tbpedido_item_tbpedido_ped_id",
                        column: x => x.ped_id,
                        principalTable: "tbpedido",
                        principalColumn: "ped_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbpedido_item_ped_id",
                table: "tbpedido_item",
                column: "ped_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbmovimentacao_estoque");

            migrationBuilder.DropTable(
                name: "tbpedido_item");

            migrationBuilder.DropColumn(
                name: "var_dh_cadastro",
                table: "tbproduto_variacao");

            migrationBuilder.DropColumn(
                name: "prod_dh_cadastro",
                table: "tbproduto");
        }
    }
}
