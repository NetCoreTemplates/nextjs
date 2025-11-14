using MyApp.ServiceInterface;
using ServiceStack.NativeTypes.TypeScript;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost() : AppHostBase("MyApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(new AppConfig {
                AppBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost" +
                      ":3000" +
                      ""
                    : null,
                ApiBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5001"  
                    : null,
            });
        });

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure()
    {
        TypeScriptGenerator.InsertTsNoCheck = true;

        SetConfig(new HostConfig {
        });
    }
    
    // TODO: Replace with your own License Key. FREE Individual or OSS License available from: https://servicestack.net/free
    public static void RegisterKey() =>
        ServiceStack.Licensing.RegisterLicense("OSS BSD-3-Clause 2025 https://github.com/NetCoreTemplates/nextjs fikwwuuSWXcMlSp9HNi2aWOqg+XskqXNG/2epBNhPeQ4zEddXhxSFlFwv3Rfvr74nB5kaGPVvA1sY6MgfMkHYngn8FSLnDZPXUtCt54N5hEen1mKPxTIAPJjBGjWNSP+vccFGl4mpbpxjmpZ8+eKcAuzvMuWa3UqZFpV/49Buis=");
}
