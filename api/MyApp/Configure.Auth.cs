using Microsoft.AspNetCore.Hosting;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.FluentValidation;
using ServiceStack.Html;

[assembly: HostingStartup(typeof(MyApp.ConfigureAuth))]

namespace MyApp;

// Add any additional metadata properties you want to store in the Users Typed Session
public class CustomUserSession : AuthUserSession
{
}

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
        .ConfigureServices(services =>
        {
            //override the default registration validation with your own custom implementation
            services.AddSingleton<IValidator<Register>, CustomRegistrationValidator>();
            
            services.AddPlugin(new RegistrationFeature()); //Enable /register Service
        })
        .ConfigureAppHost(appHost =>
        {
            var appSettings = appHost.AppSettings;
            appHost.Plugins.Add(new AuthFeature(() => new CustomUserSession(),
            [
                new JwtAuthProvider(appSettings) {
                    AuthKeyBase64 = appSettings.GetString("AuthKeyBase64") ?? "cARl12kvS/Ra4moVBIaVsrWwTpXYuZ0mZf/gNLUhDW5=",
                },
                new CredentialsAuthProvider(appSettings),     /* Sign In with Username / Password credentials */
                new FacebookAuthProvider(appSettings),        /* Create App https://developers.facebook.com/apps */
                new GoogleAuthProvider(appSettings),          /* Create App https://console.developers.google.com/apis/credentials */
                new MicrosoftGraphAuthProvider(appSettings) /* Create App https://apps.dev.microsoft.com */
            ])
            {
                IncludeDefaultLogin = false
            });
            // Removing unused UserName in Admin Users UI 
            appHost.Plugins.Add(new AdminUsersFeature {
                
                // Show custom fields in Search Results
                QueryUserAuthProperties =
                [
                    nameof(AppUser.Id),
                    nameof(AppUser.Email),
                    nameof(AppUser.DisplayName),
                    nameof(AppUser.Department),
                    nameof(AppUser.CreatedDate),
                    nameof(AppUser.LastLoginDate)
                ],
                QueryMediaRules =
                [
                    MediaRules.ExtraSmall.Show<AppUser>(x => new { x.Id, x.Email, x.DisplayName }),
                    MediaRules.Small.Show<AppUser>(x => x.Department)
                ],
                // Add Custom Fields to Create/Edit User Forms
                FormLayout =
                [
                    Input.For<AppUser>(x => x.Email),
                    Input.For<AppUser>(x => x.DisplayName),
                    Input.For<AppUser>(x => x.Company),
                    Input.For<AppUser>(x => x.Department, c => c.FieldsPerRow(2)),
                    Input.For<AppUser>(x => x.PhoneNumber, c =>
                    {
                        c.Type = Input.Types.Tel;
                        c.FieldsPerRow(2);
                    }),
                    Input.For<AppUser>(x => x.Nickname, c =>
                    {
                        c.Help = "Public alias (3-12 lower alpha numeric chars)";
                        c.Pattern = "^[a-z][a-z0-9_.-]{3,12}$";
                        //c.Required = true;
                    }),
                    Input.For<AppUser>(x => x.ProfileUrl, c => c.Type = Input.Types.Url),
                    Input.For<AppUser>(x => x.IsArchived), Input.For<AppUser>(x => x.ArchivedDate)
                ]
            });
        });
}