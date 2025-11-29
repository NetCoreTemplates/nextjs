using Scalar.AspNetCore;
using ServiceStack;

[assembly: HostingStartup(typeof(MyApp.ConfigureOpenApi))]

namespace MyApp;

//TODO: Fix build error by adding to <PropertyGroup> https://github.com/dotnet/roslyn/issues/74511
// <InterceptorsNamespaces>$(InterceptorsNamespaces);Microsoft.AspNetCore.OpenApi.Generated</InterceptorsNamespaces>

public class ConfigureOpenApi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddOpenApi();
                services.AddServiceStackOpenApi();                
                // services.AddBasicAuth<Data.ApplicationUser>();
                // services.AddApiKeys();
                // services.AddJwtAuth();

                services.AddTransient<IStartupFilter,StartupFilter>();
            }
        });

    public class StartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next) => app =>
        {
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapOpenApi();
                endpoints.MapScalarApiReference();
            });
            next(app);
        };
    }
}
