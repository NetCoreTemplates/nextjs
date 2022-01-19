using Funq;
using ServiceStack;
using MyApp.ServiceInterface;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost : AppHostBase, IHostingStartup
{
    public AppHost() : base("MyApp", typeof(MyServices).Assembly) {}

    public override void Configure(Container container)
    {
        SetConfig(new HostConfig {
        });

        Plugins.Add(new SpaFeature {
            EnableSpaFallback = true
        });
        Plugins.Add(new CorsFeature(allowOriginWhitelist:new[]{ 
            "http://localhost:5000",
            "http://localhost:3000",
            "https://localhost:5001",
            "https://" + Environment.GetEnvironmentVariable("DEPLOY_CDN")
        }, allowCredentials:true));

        ConfigurePlugin<UiFeature>(feature => {
            feature.Info.BrandIcon.Uri = "/assets/img/logo.svg";
            feature.Info.BrandIcon.Cls = "inline-block w-8 h-8 mr-2";
        });
    }

    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => 
            services.ConfigureNonBreakingSameSiteCookies(context.HostingEnvironment))
        .Configure(app => {
            if (!HasInit) 
                app.UseServiceStack(new AppHost());
        });
}
