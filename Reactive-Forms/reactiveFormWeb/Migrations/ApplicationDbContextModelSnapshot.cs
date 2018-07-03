﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using reactiveFormWeb.Models;
using System;

namespace reactiveFormWeb.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.3-rtm-10026")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("reactiveFormWeb.Models.Direccion", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Calle");

                    b.Property<int>("PersonaId");

                    b.Property<string>("Provincia");

                    b.HasKey("Id");

                    b.HasIndex("PersonaId");

                    b.ToTable("Direccion");
                });

            modelBuilder.Entity("reactiveFormWeb.Models.Persona", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("FechaNacimiento");

                    b.Property<string>("Nombre");

                    b.HasKey("Id");

                    b.ToTable("Personas");
                });

            modelBuilder.Entity("reactiveFormWeb.Models.Direccion", b =>
                {
                    b.HasOne("reactiveFormWeb.Models.Persona")
                        .WithMany("Direcciones")
                        .HasForeignKey("PersonaId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}