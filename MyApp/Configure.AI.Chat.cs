using ServiceStack;
using ServiceStack.AI;

[assembly: HostingStartup(typeof(MyApp.ConfigureAiChat))]

namespace MyApp;

/// <summary>
/// AI Chat using this host's ASP.NET Identity users
/// </summary>
public class ConfigureAiChat : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {

            services.AddPlugin(new ChatFeature {
                // Require authentication to access /chat
                RequireAuth = true,
                // RequiredRole = "Admin",
                Tools =
                {
                    // README: Give AI Models access to Filesystem or Code Execution tools
                    // EnableCodeExecution = true,
                    // EnableFilesystemTools = true,
                },
                
                // Expose APIs with these tags to API & MCP Tools
                // ApiTools = {
                //     IncludeTags = ["todos"]
                // },

                // Add this App's own tools to the built-in extensions
                // Expose these tools to external AI Agents over MCP at /chat/mcp
                Mcp = {
                    // allow Agents to call any tool in the above groups without approval
                    // RejectToolsRequiringApproval = false, 
                },
                
                Setup = (ctx => {
                    // Advanced setup
                }),
            });

            services.ConfigurePlugin<MetadataFeature>(feature => {
                feature.AddPluginLink("/chat", "AI Chat");
            });

            // Enable https://servicestack.net/pdf
            services.AddPlugin(new PdfFeature {
                PdfCodeGen = new() {
                    Namespace = "MyApp.ServiceModel.Pdf",
                    OutputPath = System.IO.Path.Combine(context.HostingEnvironment.ContentRootPath, "../MyApp.ServiceModel/Pdf"),
                }
            });
       })
       .ConfigureAppHost(afterAppHostInit:appHost => {
            var log = appHost.GetApplicationServices().GetRequiredService<ILogger<ConfigureAiChat>>();
            log.LogInformation("AI Chat configured");
            
            // Generate a typed model for every template in App_Data/pdf with:
            //     dotnet run --AppTasks=pdf
            // Templates you've since edited the model of are left alone, as are any named in Exclude.
            AppTasks.Register("pdf", _ => appHost.GetPlugin<PdfFeature>().GeneratePdfs());
        });
}
