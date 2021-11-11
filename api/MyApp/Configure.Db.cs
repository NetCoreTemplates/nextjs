/*
    <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="6.0.0-rc.2.21480.10" />
    <PackageReference Include="Microsoft.AspNetCore.Identity.UI" Version="6.0.0-rc.2.21480.10" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="6.0.0-rc.2.21480.5">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="6.0.0-rc.2.21480.5" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.0-rc.2.21480.5">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
 */

using Microsoft.EntityFrameworkCore;
using MyApp.Data;

[assembly: HostingStartup(typeof(MyApp.ConfigureDb))]

namespace MyApp
{
    public class ConfigureDb : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder) => builder
            .ConfigureServices((context, services) => {
                var connStr = context.Configuration.GetConnectionString("DefaultConnection") 
                              ?? "DataSource=:memory:";
                services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseSqlite(connStr));
            });
    }
}
