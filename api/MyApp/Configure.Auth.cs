using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using MyApp.Data;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.FluentValidation;

[assembly: HostingStartup(typeof(MyApp.ConfigureAuth))]

namespace MyApp
{
    // Custom Validator to add custom validators to built-in /register Service requiring DisplayName and ConfirmPassword
    public class CustomRegistrationValidator : RegistrationValidator
    {
        public CustomRegistrationValidator()
        {
            RuleSet(ApplyTo.Post, () =>
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.ConfirmPassword).NotEmpty();
            });
        }
    }

    public class ConfigureAuth : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder) => builder
            .ConfigureServices(services => services
                .AddAuthentication()
                .AddJwtBearer(x => {
                    // secretKey contains a secret passphrase only your server knows
                    x.TokenValidationParameters = new TokenValidationParameters {
                        IssuerSigningKey = new SymmetricSecurityKey("mysupers3cr3tsharedkey!".ToUtf8Bytes()),
                        ValidAudience = "ExampleAudience",
                        ValidIssuer = "ExampleIssuer",
                    }.UseStandardJwtClaims();
                }))
            .Configure(app => {
                app.UseServiceStack(new AppHost());

                app.UseCookiePolicy().UseJwtCookie(IdentityAuth.TokenCookie);
                app.UseAuthentication();
                app.UseAuthorization();
            })
            .ConfigureAppHost(appHost => {
                
                appHost.Plugins.Add(new AuthFeature(IdentityAuth.For<AppUser>(options => {
                    options.IncludeRegisterService = true;
                    options.IncludeAssignRoleServices = true;
                })));

                //override the default registration validation with your own custom implementation
                appHost.RegisterAs<CustomRegistrationValidator, IValidator<Register>>();
            });
    }
}
