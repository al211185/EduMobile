using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EduMobile.Server;

namespace EduMobileTests
{
    [TestClass]
    public class Test1
    {
        private readonly HttpClient _client;

        public Test1()
        {
            var factory = new WebApplicationFactory<Program>();
            _client = factory.CreateClient();
        }

        [TestMethod]
        public async Task GetProjects_WithoutAuth_ReturnsNotFound()
        {
            // Act: sin token ni ningún seed de proyectos
            var response = await _client.GetAsync("/api/projects");

            // Ahora esperamos NotFound (404) en lugar de 401
            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
