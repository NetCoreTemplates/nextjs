---
title: 'In Depth Interactive API Analytics for PostgreSQL, SQL Server & MySQL'
excerpt: 'Interactive RDBMS API Analytics in Admin UI, deep insights into API usage, performance, users, API Keys & IPs'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2021-11-10T05:35:07.322Z'
author:
  name: Author
  picture: '/assets/blog/authors/author3.svg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
---

ServiceStack v8.9 restores parity to **PostgreSQL**, **SQL Server** & **MySQL** RDBMS's for our previous 
SQLite-only features with the new `DbRequestLogger` which is a drop-in replacement for 
[SQLite Request Logging](https://docs.servicestack.net/sqlite-request-logs) for persisting API Request Logs to a RDBMS.

Whilst maintaining an archive of API Requests is nice, the real value of DB Request Logging is that it unlocks the 
comprehensive API Analytics and querying Logging available that was previously limited to SQLite Request Logs. 

:::youtube kjLcm1llC5Y
In Depth and Interactive API Analytics available to all ASP .NET Core ServiceStack Apps!
:::

### Benefits of API Analytics

They provide deep and invaluable insight into your System API Usage, device distribution, its Users, API Keys and the 
IPs where most traffic generates:

- **Visibility:** Provides a clear, visual summary of complex log data, making it easier to understand API usage and performance at a glance.
- **Performance Monitoring:** Helps track key metrics like request volume and response times to ensure APIs are meeting performance expectations.
- **User Understanding:** Offers insights into how users (and bots) are interacting with the APIs (devices, browsers).
- **Troubleshooting:** Aids in quickly identifying trends, anomalies, or specific endpoints related to issues.
- **Resource Planning:** Understanding usage patterns helps in scaling infrastructure appropriately.
- **Security Insight:** Identifying bot traffic and unusual request patterns can be an early indicator of security concerns.

### Interactive Analytics

Analytics are also interactive where you're able to drill down to monitor the activity of individual APIs, Users, API Keys 
and IPs which have further links back to the request logs which the summary analytics are derived from.

As they offer significant and valuable insights the `SqliteRequestLogger` is built into all ASP.NET Core 
IdentityAuth templates, to switch it over to use a RDBMS we recommend installing `db-identity` mix gist to
also replace SQLite BackgroundJobs with the RDBMS `DatabaseJobFeature`:

```bash
npx add-in db-identity
```

Or if you just want to replace SQLite Request Logs with a RDBMS use: 

```bash
npx add-in db-requestlogs
```

Or you can copy the [Modular Startup](https://docs.servicestack.net/modular-startup) script below: 

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureRequestLogs))]

namespace MyApp;

public class ConfigureRequestLogs : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {

            services.AddPlugin(new RequestLogsFeature {
                RequestLogger = new DbRequestLogger {
                    // NamedConnection = "<alternative db>"
                },
                EnableResponseTracking = true,
                EnableRequestBodyTracking = true,
                EnableErrorTracking = true
            });
            services.AddHostedService<RequestLogsHostedService>();

            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddPlugin(new ProfilingFeature());
            }
        });
}

public class RequestLogsHostedService(ILogger<RequestLogsHostedService> log, IRequestLogger requestLogger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(3));
        if (requestLogger is IRequireAnalytics logger)
        {
            while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
            {
                await logger.TickAsync(log, stoppingToken);
            }
        }
    }
}
```

### RDBMS Provider

When using a remote RDBMS, network latency becomes a primary concern that any solution needs to be designed around, 
as such the API Request Logs are initially maintained in an in memory collection before being flushed to the database 
**every 3 seconds** — configurable in the `PeriodicTimer` interval above.

To reduce the number of round-trips to the database, the `DbRequestLogger` batches all pending logs into a single 
request using [OrmLite's Bulk Inserts](https://docs.servicestack.net/ormlite/bulk-inserts) which is supported by all 
major RDBMS's.

### PostgreSQL Table Partitioning

PostgreSQL provides native support for table partitioning, allowing us to automatically create monthly partitions using 
`PARTITION BY RANGE` on the `CreatedDate` column. The `DbRequestLogger` automatically creates new monthly partitions 
as needed, maintaining the same logical separation as SQLite's monthly .db's while keeping everything within a single 
Postgres DB:

```sql
CREATE TABLE "RequestLog" (
    -- columns...
    "CreatedDate" TIMESTAMP NOT NULL,
    PRIMARY KEY ("Id","CreatedDate")
) PARTITION BY RANGE ("CreatedDate");

-- Monthly partitions are automatically created, e.g.:
CREATE TABLE "RequestLog_2025_01" PARTITION OF "RequestLog"
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### SQLServer / MySQL - Manual Partition Management

For **SQL Server** and **MySQL**, monthly partitioned tables need to be created **out-of-band**
(either manually or via cronjob scripts) since they don't support the same level of automatic
partition management as PostgreSQL. However, this still works well in practice as because `RequestLog` is an 
**Append Only** table with all querying from the Admin UIs being filtered by its indexed `CreatedDate`
in monthly viewable snapshots like it was with SQLite.

### Separate RequestLog Database

Or if preferred, you can maintain request logs in a **separate database** from your main application database.
This separation keeps the write-heavy logging load off your primary database, allowing you to optimize 
each database independently for its specific workload patterns like maintaining different backup strategies
for your critical application data vs. log history.

```csharp
// Configure.Db.cs
services.AddOrmLite(options => options.UsePostgres(connectionString))
        .AddPostgres("logs", logsConnectionString);

// Configure.RequestLogs.cs
services.AddPlugin(new RequestLogsFeature {
    RequestLogger = new DbRequestLogger {
        NamedConnection = "logs"
    },
    //...
});
```

## Queryable Admin Logging UI

This will enable a more feature rich Request Logging Admin UI which utilizes the full queryability of the 
[AutoQueryGrid](https://docs.servicestack.net/vue/autoquerygrid) component to filter, sort and export Request Logs. 

[![](https://servicestack.net/img/posts/analytics/sqlitelogs.webp)](https://servicestack.net/img/posts/analytics/sqlitelogs.webp)

## Analytics Overview

Utilizing an `DbRequestLogger` also enables the **Analytics** Admin UI in the sidebar which initially
displays the API Analytics Dashboard:

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-apis1.webp)](https://servicestack.net/img/posts/analytics/analytics-apis1.webp)

</div>

### Distribution Pie Charts

Lets you quickly understand the composition of your user base and traffic sources and the 
distribution of users across different web browsers, device types, and to identify the proportion of traffic coming from automated bots. 

### Requests per day Line Chart

Lets you monitor API usage trends and performance over time. It tracks the total number of API requests and the average response 
time day-by-day. You can easily spot trends like peak usage hours/days, identify sudden spikes or drops in traffic, 
and correlate request volume with API performance which is crucial for capacity planning and performance troubleshooting.

### API tag groups Pie Chart

Lets you understand the usage patterns across different functional categories of your APIs.
By grouping API requests based on assigned tags (like Security, Authentication, User Management, Tech, etc.), you get a 
high-level view of which *types* of functionalities are most frequently used or are generating the most load. 

### API Requests Bar Chart

Lets you identify the most and least frequently used specific API endpoints which ranks individual API endpoints by 
the number of requests they receive. This helps pinpoint:
 
- **Critical Endpoints:** The most heavily used APIs that require robust performance and monitoring.
- **Optimization Targets:** High-traffic endpoints that could benefit from performance optimization.
- **Underutilized Endpoints:** APIs that might be candidates for deprecation or require promotion.
- **Troubleshooting:** If performance issues arise (seen in the line chart), this helps narrow down which specific endpoint might be responsible.

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-apis2.webp)](https://servicestack.net/img/posts/analytics/analytics-apis2.webp)

</div>

### Total Duration Bar Chart

Identifies which API endpoints consume the most *cumulative processing time* over the selected period.
Even if an API endpoint is relatively fast per call, if it's called extremely frequently, it can contribute significantly to overall server load.
Optimizing these can lead to significant savings in server resources (CPU, memory).

### Average Duration Bar Chart

Pinpoints which API endpoints are the slowest on a *per-request* basis. APIs at the top of this list are prime candidates 
for performance investigation and optimization, as they represent potential user-facing slowness or system bottlenecks.

### Requests by Duration Ranges Histogram

Provides an overview of the performance distribution for *all* API requests.
This chart shows how many requests fall into different speed buckets and helps you understand the overall responsiveness of your API system at a glance. 

## Individual API Analytics

Clicking on an API's bar chart displays a dedicated, detailed view of a single API endpoint's behavior, isolating its performance 
and usage patterns from the overall system metrics offering immediate insight into the endpoint's traffic volume and reliability.

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-api.webp)](https://servicestack.net/img/posts/analytics/analytics-api.webp)

</div>

### Total Requests

Displays the total requests for an API during the selected month. It includes HTTP Status Breakdown which
provide **direct access to the filtered request logs**. This is a major benefit for **rapid troubleshooting**, allowing 
you to instantly view the specific log entries corresponding to successful requests or particular error codes for this API.

### Last Request Information

Provides immediate context on the most recent activity for this endpoint with *when* the last request occurred, 
the source **IP address** and device information to help understand recent usage and check if the endpoint is still active, 
or quickly investigate the very last interaction if needed.

### Duration Summary Table (Total, Min, Max)

Quantifies the performance characteristics specifically for this endpoint with the cumulative (Total) processing load, 
the best-case performance (Min), and the worst-case performance (Max) which is useful for identifying performance outliers.

### Duration Requests Histogram

Visualizes the performance distribution for this API.

### Top Users Bar Chart

Identifies which authenticated users are most frequently calling this API and relies on this endpoint the most.
This can be useful for identifying power users, potential API abuse by a specific user account, or understanding the impact of changes to this API on key users.

### Top IP Addresses Bar Chart

Shows which source IP addresses are generating the most traffic for this API.
Useful for identifying high-volume clients, specific servers interacting with this endpoint, or potentially malicious IPs.

## Users

The **Users** tab will display the top 100 Users who make the most API Requests and lets you click on a Users bar chart
to view their individual User analytics.

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-users.webp)](https://servicestack.net/img/posts/analytics/analytics-users.webp)

</div>

### Individual User Analytics

Provides a comprehensive view of a single user's complete interaction history and behavior across all APIs they've accessed, 
shifting the focus from API performance to user experience and activity.

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-user.webp)](https://servicestack.net/img/posts/analytics/analytics-user.webp)

</div>

### User Info & Total Requests

Identifies the user and quantifies their overall activity level. Clicking on their ID or Name will navigate to the Users Admin UI.
It also shows their success/error rate via the clickable status code links. This helps gauge user engagement and baseline activity.

### Last Request Information

Offers a snapshot of the user's most recent interaction for immediate context.
Knowing **when**, **what** API they called, from which **IP address**, using which **client** & **device** is valuable 
for support, identifying their last action or checking recent activity.

### HTTP Status Pie Chart

Visualizes the overall success and error rate specifically for this user's API requests.

### Performance & Request Body Summary Table

Quantifies the performance experienced by this user and the data they typically send.

### Duration Requests Histogram

Shows the distribution of response times for requests made by this user to help understand the typical performance this user experiences.

### Top APIs Bar Chart

Reveals which API endpoints this user interacts with most frequently and help understanding user behavior and which features they use most.

### Top IP Addresses Bar Chart

Identifies the primary network locations or devices the user connects from.

### User Admin UI Analytics

To assist in discoverability a snapshot of a Users Analytics is also visible in the Users Admin UI:

[![](https://servicestack.net/img/posts/analytics/analytics-user-adminui.webp)](https://servicestack.net/img/posts/analytics/analytics-user-adminui.webp)

Clicking on **View User Analytics** takes you to the Users Analytics page to access to the full Analytics features and navigation.

## API Keys

The **API Keys** tab will display the top 100 API Keys who make the most API Requests and lets you click on an API Key 
bar chart to view its individual API Key analytics.

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-apikeys.webp)](https://servicestack.net/img/posts/analytics/analytics-apikeys.webp)

</div>

### Individual API Key Analytics

Provides comprehensive API Key analytics Similar to User Analytics but limited to the API Usage of a single API Key:

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-apikey.webp)](https://servicestack.net/img/posts/analytics/analytics-apikey.webp)

</div>

## IPs

The **IP Addresses** tab will display the top 100 IPs that make the most API Requests. Click on an IP's
bar chart to view its individual analytics made from that IP Address.

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-ips.webp)](https://servicestack.net/img/posts/analytics/analytics-ips.webp)

</div>

### Individual IP Analytics

Provides comprehensive IP Address analytics Similar to User Analytics but limited to the API Usage from a single IP Address:

<div class="wideshot">

[![](https://servicestack.net/img/posts/analytics/analytics-ip.webp)](https://servicestack.net/img/posts/analytics/analytics-ip.webp)

</div>
