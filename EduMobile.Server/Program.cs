using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using EduMobile.Server.Data;
using EduMobile.Server.Models;
using System.Configuration;
using EduMobile.Server.Services;
using EduMobile.Server.Hubs;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configuración de la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("UserContextConnection")
    ?? throw new InvalidOperationException("Connection string 'UserContextConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configuración de Identity con ApplicationUser y roles
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configura Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddControllers()
    .AddJsonOptions(opt =>
    {
        // Ignorar ciclos de referencia EF en la serialización JSON
        opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddTransient<INotificationService, NotificationService>();

builder.Services.AddSignalR();


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
        options.RoutePrefix = "api-docs"; // Swagger estará en /api-docs
    });
}

// Middleware para archivos estáticos (asegúrate de que wwwroot esté correctamente configurado)
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        Console.WriteLine($"Ruta solicitada: {context.Request.Path}");
        await next();
    });
}

// Middleware para autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// Configuración de rutas de controladores
app.MapControllers();

app.MapHub<NotificationHub>("/notificationHub");

// React como fallback para cualquier ruta no gestionada por controladores
app.MapFallbackToFile("/index.html");

app.Run();
