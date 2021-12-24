using System;
using ServiceStack;
using ServiceStack.Web;
using ServiceStack.Data;
using ServiceStack.Auth;
using ServiceStack.Configuration;

[assembly: HostingStartup(typeof(MyApp.ConfigureAuthRepository))]

namespace MyApp
{
    // Custom User Table with extended Metadata properties
    public class AppUser : UserAuth
    {
        public string? ProfileUrl { get; set; }
        public string? LastLoginIp { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }

    public class AppUserAuthEvents : AuthEvents
    {
        public override async Task OnAuthenticatedAsync(IRequest httpReq, IAuthSession session, IServiceBase authService, 
            IAuthTokens tokens, Dictionary<string, string> authInfo, CancellationToken token = default)
        {
            var authRepo = HostContext.AppHost.GetAuthRepositoryAsync(httpReq);
            using (authRepo as IDisposable)
            {
                var userAuth = (AppUser)await authRepo.GetUserAuthAsync(session.UserAuthId, token);
                userAuth.ProfileUrl = session.GetProfileUrl();
                userAuth.LastLoginIp = httpReq.UserHostAddress;
                userAuth.LastLoginDate = DateTime.UtcNow;
                await authRepo.SaveUserAuthAsync(userAuth, token);
            }
        }
    }

    public class ConfigureAuthRepository : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder) => builder
            .ConfigureServices(services => services.AddSingleton<IAuthRepository>(c =>
                new OrmLiteAuthRepository<AppUser, UserAuthDetails>(c.Resolve<IDbConnectionFactory>()) {
                    UseDistinctRoleTables = true
                }))
            .ConfigureAppHost(appHost => {
                var authRepo = appHost.Resolve<IAuthRepository>();
                authRepo.InitSchema();
                CreateUser(authRepo, "admin@email.com", "Admin User", "p@55wOrd", roles: new[] { RoleNames.Admin });
                CreateUser(authRepo, "manager@email.com", "The Manager", "p@55wOrd", roles: new[] { "Employee", "Manager" });
                CreateUser(authRepo, "employee@email.com", "A Employee", "p@55wOrd", roles: new[] { "Employee" });
            }, afterConfigure: appHost => {
                appHost.AssertPlugin<AuthFeature>().AuthEvents.Add(new AppUserAuthEvents());
            });

        // Add initial Users to the configured Auth Repository
        public void CreateUser(IAuthRepository authRepo, string email, string name, string password, string[] roles)
        {
            if (authRepo.GetUserAuthByUserName(email) == null)
            {
                var newAdmin = new AppUser { Email = email, DisplayName = name };
                var user = authRepo.CreateUserAuth(newAdmin, password);
                authRepo.AssignRoles(user, roles);
            }
        }
    }
}
