using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbfornecedor",
                columns: table => new
                {
                    frn_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    frn_nm = table.Column<string>(type: "text", nullable: false),
                    frn_nr_cnpj = table.Column<string>(type: "text", nullable: false),
                    frn_nm_contato = table.Column<string>(type: "text", nullable: false),
                    frn_nr_telefone = table.Column<string>(type: "text", nullable: false),
                    frn_ds_email = table.Column<string>(type: "text", nullable: false),
                    frn_ds_ender = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbfornecedor", x => x.frn_id);
                });

            migrationBuilder.CreateTable(
                name: "tbpedido",
                columns: table => new
                {
                    ped_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ped_nm_cliente = table.Column<string>(type: "text", nullable: false),
                    ped_dh_pedido = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ped_vl_total = table.Column<decimal>(type: "numeric", nullable: false),
                    ped_st_pedido = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbpedido", x => x.ped_id);
                });

            migrationBuilder.CreateTable(
                name: "tbtipo",
                columns: table => new
                {
                    tipo_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tipo_nm = table.Column<string>(type: "text", nullable: false),
                    tipo_cd = table.Column<string>(type: "text", nullable: false),
                    tipo_ds = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbtipo", x => x.tipo_id);
                });

            migrationBuilder.CreateTable(
                name: "tbusuario",
                columns: table => new
                {
                    usu_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    usu_nm = table.Column<string>(type: "text", nullable: false),
                    usu_ds_senha = table.Column<string>(type: "text", nullable: false),
                    usu_ds_email = table.Column<string>(type: "text", nullable: false),
                    usu_dh_nascto = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    usu_nr_telefone = table.Column<long>(type: "bigint", nullable: true),
                    usu_tp_role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbusuario", x => x.usu_id);
                });

            migrationBuilder.CreateTable(
                name: "tbproduto",
                columns: table => new
                {
                    prod_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prod_nm = table.Column<string>(type: "text", nullable: false),
                    frn_id = table.Column<int>(type: "integer", nullable: false),
                    tipo_id = table.Column<int>(type: "integer", nullable: false),
                    prod_dh_cadastro = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbproduto", x => x.prod_id);
                    table.ForeignKey(
                        name: "FK_tbproduto_tbfornecedor_frn_id",
                        column: x => x.frn_id,
                        principalTable: "tbfornecedor",
                        principalColumn: "frn_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbproduto_tbtipo_tipo_id",
                        column: x => x.tipo_id,
                        principalTable: "tbtipo",
                        principalColumn: "tipo_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tbproduto_variacao",
                columns: table => new
                {
                    var_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prod_id = table.Column<int>(type: "integer", nullable: false),
                    var_nm_tamanho = table.Column<string>(type: "text", nullable: false),
                    var_vl_compra = table.Column<decimal>(type: "numeric", nullable: false),
                    var_vl_venda = table.Column<decimal>(type: "numeric", nullable: false),
                    var_nr_quantidade = table.Column<int>(type: "integer", nullable: false),
                    var_dh_cadastro = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbproduto_variacao", x => x.var_id);
                    table.ForeignKey(
                        name: "FK_tbproduto_variacao_tbproduto_prod_id",
                        column: x => x.prod_id,
                        principalTable: "tbproduto",
                        principalColumn: "prod_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbproduto_frn_id",
                table: "tbproduto",
                column: "frn_id");

            migrationBuilder.CreateIndex(
                name: "IX_tbproduto_tipo_id",
                table: "tbproduto",
                column: "tipo_id");

            migrationBuilder.CreateIndex(
                name: "IX_tbproduto_variacao_prod_id",
                table: "tbproduto_variacao",
                column: "prod_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbpedido");

            migrationBuilder.DropTable(
                name: "tbproduto_variacao");

            migrationBuilder.DropTable(
                name: "tbusuario");

            migrationBuilder.DropTable(
                name: "tbproduto");

            migrationBuilder.DropTable(
                name: "tbfornecedor");

            migrationBuilder.DropTable(
                name: "tbtipo");
        }
    }
}
