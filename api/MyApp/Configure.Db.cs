using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;

[assembly: HostingStartup(typeof(MyApp.ConfigureDb))]

namespace MyApp
{
    // Example Data Model
    // public class MyTable
    // {
    //     [AutoIncrement]
    //     public int Id { get; set; }
    //     public string Name { get; set; }
    // }

    public class ConfigureDb : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder) => builder
            .ConfigureServices(services => services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                builder.GetSetting("ConnectionStrings:DefaultConnection")
                    ?? ":memory:",
                SqliteDialect.Provider)))
            .ConfigureAppHost(appHost => {
                appHost.GetPlugin<SharpPagesFeature>()?.ScriptMethods.Add(new DbScriptsAsync());

                // Create non-existing Table and add Seed Data Example
                // using var db = appHost.Resolve<IDbConnectionFactory>().Open();
                // if (db.CreateTableIfNotExists<MyTable>())
                // {
                //     db.Insert(new MyTable { Name = "Seed Data for new MyTable" });
                // }
            });
    }
}
