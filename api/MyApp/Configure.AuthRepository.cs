using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ServiceStack;
using ServiceStack.Web;
using ServiceStack.Auth;
using ServiceStack.Configuration;
using MyApp.Data;

[assembly: HostingStartup(typeof(MyApp.ConfigureAuthRepository))]

namespace MyApp
{
    namespace Data
    {
        // Custom User Table with extended Metadata properties
        public class AppUser : IdentityUser
        {
            public string? DisplayName { get; set; }
            public string? ProfileUrl { get; set; }
            public string? LastLoginIp { get; set; }
            public DateTime? LastLoginDate { get; set; }
        }

        public class ApplicationDbContext : IdentityDbContext<AppUser>
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
                : base(options)
            {
            }

            protected override void OnModelCreating(ModelBuilder builder)
            {
                base.OnModelCreating(builder);
                // Customize the ASP.NET Identity model and override the defaults if needed.
                // For example, you can rename the ASP.NET Identity table names and more.
                // Add your customizations after calling base.OnModelCreating(builder);
            }
        }
    }
    
    public class AppUserAuthEvents : AuthEvents
    {
        public override async Task OnAuthenticatedAsync(IRequest httpReq, IAuthSession session, IServiceBase authService, 
            IAuthTokens tokens, Dictionary<string, string> authInfo, CancellationToken token = default)
        {
            var userManager = httpReq.Resolve<UserManager<AppUser>>();

            var existingUser = await userManager.FindByEmailAsync(session.UserAuthName);
            if (existingUser == null)
                throw new Exception("User does not exist");

            existingUser.ProfileUrl = session.GetProfileUrl();
            existingUser.LastLoginIp = httpReq.UserHostAddress;
            existingUser.LastLoginDate = DateTime.UtcNow;

            await userManager.UpdateAsync(existingUser);
        }
    }

    public class ConfigureAuthRepository : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder) => builder
            .ConfigureServices(services => services
                .AddDefaultIdentity<AppUser>(options => {
                    //options.SignIn.RequireConfirmedAccount = true;
                })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>())
            .ConfigureAppHost(appHost => {
                using (var serviceScope = appHost.GetApplicationServices().GetService<IServiceScopeFactory>()!.CreateScope())
                {
                    using var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    context.Database.EnsureCreated();
                }
                
                AssertRoles(appHost.Resolve<RoleManager<IdentityRole>>(), RoleNames.Admin);

                var userManager = appHost.Resolve<UserManager<AppUser>>();
                CreateUser(userManager, "admin@email.com", "Admin User", "p@55wOrd", roles:new[]{ RoleNames.Admin });
            }, afterConfigure: appHost => {
                appHost.AssertPlugin<AuthFeature>().AuthEvents.Add(new AppUserAuthEvents());
            });

        // Add initial Users to the configured Auth Repository
        private static void CreateUser(UserManager<AppUser> userManager, 
            string email, string name, string password, string[]? roles=null)
        {
            if (userManager.FindByEmailAsync(email).GetAwaiter().GetResult() == null)
            {
                var newUser = new AppUser {
                    UserName = email, 
                    Email = email, 
                    DisplayName = name,
                    EmailConfirmed = true,
                };
                userManager.CreateAsync(newUser, password).AssertSucceededSync();
                if (roles?.Length > 0)
                    userManager.AddToRolesAsync(newUser, roles).AssertSucceededSync();
            }
        }

        private void AssertRoles(RoleManager<IdentityRole> roleManager, params string[] roleNames)
        {
            foreach (var roleName in roleNames)
            {
                var roleExists = roleManager.FindByNameAsync(roleName).GetAwaiter().GetResult();
                if (roleExists == null)
                    roleManager.CreateAsync(new IdentityRole(roleName)).AssertSucceededSync();
            }
        }
    }
}
