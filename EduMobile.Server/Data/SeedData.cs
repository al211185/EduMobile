using EduMobile.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace EduMobile.Server.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Define roles predeterminados
            string[] roles = { "Profesor", "Alumno" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Crea un administrador predeterminado
            var adminEmail = "admin@edumobile.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var newAdmin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    Matricula = "ADMIN001",
                    Nombre = "Admin",
                    ApellidoPaterno = "Principal",
                    ApellidoMaterno = "User",
                    Role = "Profesor"
                };
                await userManager.CreateAsync(newAdmin, "Admin123!");
                await userManager.AddToRoleAsync(newAdmin, "Profesor");
            }
        }
    }
}
