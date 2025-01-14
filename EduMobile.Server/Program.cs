using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using EduMobile.Server.Data;
using EduMobile.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuraci�n de la cadena de conexi�n
var connectionString = builder.Configuration.GetConnectionString("UserContextConnection")
    ?? throw new InvalidOperationException("Connection string 'UserContextConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configuraci�n de Identity con ApplicationUser y roles
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configura Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

var app = builder.Build();

// Sembrar roles y usuarios iniciales
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedData.InitializeAsync(services);
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "EduMobile API v1");
        options.RoutePrefix = "api-docs"; // Swagger estar� en /api-docs
    });
}

// Aseg�rate de que esto est� despu�s de Swagger
app.MapFallbackToFile("/index.html"); // Esto es para React


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html"); // Sirve React

app.Run();
