---
title: 'RDBMS Background Jobs'
excerpt: 'Run Background Jobs and Scheduled Tasks in PostgreSQL, SQL Server or MySQL'
coverImage: '/assets/blog/preview/cover.jpg'
date: '2025-11-08T00:00:00.000Z'
author:
  name: Author
  picture: '/assets/blog/authors/author2.svg'
ogImage:
  url: '/assets/blog/preview/cover.jpg'
---

We're excited to announce that we've ported our much loved [Background Jobs](https://docs.servicestack.net/background-jobs)
feature to the popular **PostgreSQL**, **SQL Server** and **MySQL** RDBMS's!

Since launching [Background Jobs](https://servicestack.net/posts/background-jobs) in September 2024, it's become
one of our most popular features - providing a simple, infrastructure-free solution for managing background jobs
and scheduled tasks in .NET 8+ Apps. The original implementation used SQLite for its durability, which worked
beautifully for many use cases thanks to SQLite's low latency, fast disk persistence, and zero infrastructure requirements.

However, we recognize that many of our customers need the features and scalability of industrial-strength RDBMS systems.
Whether it's for leveraging existing database infrastructure, meeting enterprise requirements, or utilizing advanced
database features like native table partitioning - we wanted to ensure Background Jobs could work seamlessly with
your preferred database platform.

## Introducing DatabaseJobsFeature

The new **DatabaseJobsFeature** is a purpose-built implementation for PostgreSQL, SQL Server, and MySQL that's
a drop-in replacement for SQLite's **BackgroundsJobFeature**. It maintains the same simple API, data models,
and service contracts - making migration from SQLite straightforward while unlocking the power of enterprise RDBMS platforms.

Best of all, it can be added to an existing .NET 8+ project with a single command using our
[mix tool](https://docs.servicestack.net/mix-tool):

## Quick Start

### For Identity Auth Projects

If you're using [ServiceStack ASP.NET Identity Auth](https://servicestack.net/start) templates, simply run:

```bash
x mix db-identity
```

This replaces both `Configure.BackgroundJobs.cs` and `Configure.RequestLogs.cs` with RDBMS-compatible versions
that use `DatabaseJobsFeature` for background jobs and `DbRequestLogger` for API request logging.

### For Other .NET 8+ Apps

For all other ServiceStack applications, use:

```bash
x mix db-jobs
```

This replaces `Configure.BackgroundJobs.cs` to use the new `DatabaseJobsFeature`:

```csharp
public class ConfigureBackgroundJobs : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new CommandsFeature());
            services.AddPlugin(new DatabaseJobsFeature {
                // Optional: Use a separate named connection
                // NamedConnection = "jobs"
            });
            services.AddHostedService<JobsHostedService>();
         }).ConfigureAppHost(afterAppHostInit: appHost => {
            var services = appHost.GetApplicationServices();
            var jobs = services.GetRequiredService<IBackgroundJobs>();
            // Example: Register recurring jobs to run on a schedule
            // jobs.RecurringCommand<MyCommand>(Schedule.Hourly);
        });
}

public class JobsHostedService(ILogger<JobsHostedService> log, IBackgroundJobs jobs)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await jobs.StartAsync(stoppingToken);

        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(3));
        while (!stoppingToken.IsCancellationRequested &&
               await timer.WaitForNextTickAsync(stoppingToken))
        {
            await jobs.TickAsync();
        }
    }
}
```

## Seamless Migration from SQLite

We've maintained the same `IBackgroundJobs` interface, data models, and API service contracts, which means:

- **Zero code changes** to your existing job enqueueing logic
- **Same Admin UI** for monitoring and managing jobs
- **Compatible APIs** - all your existing commands and job configurations work as-is

The only change needed is swapping `BackgroundsJobFeature` for `DatabaseJobsFeature` in your configuration!

Watch our video introduction to Background Jobs to see it in action:

:::youtube 2Cza_a_rrjA
Durable C# Background Jobs and Scheduled Tasks for .NET
:::

## Smart RDBMS Optimizations

One of the key benefits of SQLite Background Jobs was the ability to maintain completed and failed job history in
separate **monthly databases** (e.g., `jobs_2025-01.db`, `jobs_2025-02.db`). This prevented unbounded database growth
and made it easy to archive or delete old job history.

For `DatabaseJobsFeature`, we've replicated this monthly partitioning strategy using **monthly partitioned tables**
for the `CompletedJob` and `FailedJob` archive tables - but the implementation varies by database platform to leverage
each RDBMS's strengths.

### PostgreSQL - Native Table Partitioning

PostgreSQL provides native support for table partitioning, allowing us to automatically create monthly partitions using 
`PARTITION BY RANGE` on the `CreatedDate` column. The `DatabaseJobFeature` automatically creates new monthly partitions 
as needed, maintaining the same logical separation as SQLite's monthly .db's while keeping everything within a single 
Postgres DB:

```sql
CREATE TABLE CompletedJob (
    -- columns...
    CreatedDate TIMESTAMP NOT NULL,
    PRIMARY KEY ("Id","CreatedDate")
) PARTITION BY RANGE ("CreatedDate");

-- Monthly partitions are automatically created, e.g.:
CREATE TABLE CompletedJob_2025_01 PARTITION OF CompletedJob
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

This provides excellent query performance since PostgreSQL can use partition pruning to only scan relevant monthly partitions 
when filtering by `CreatedDate`.

### SQLServer / MySQL - Manual Partition Management

For **SQL Server** and **MySQL**, monthly partitioned tables need to be created **out-of-band** 
(either manually or via cronjob scripts) since they don't support the same level of automatic 
partition management as PostgreSQL. However, this still works well in practice as it uses:

1. **Write-Only Tables** - The `CompletedJob` and `FailedJob` tables are write-only append tables. Jobs are never updated after completion or failure, only inserted.

2. **CreatedDate Index** - All queries against these tables use the `CreatedDate` indexed column for filtering and sorting, ensuring efficient access patterns even as the tables grow.

The indexed `CreatedDate` column ensures that queries remain performant regardless of table size, and the write-only 
nature means there's no complex update logic to manage across partitions.

This approach maintains the same benefits as SQLite's monthly databases - easy archival, manageable table sizes,
and efficient queries - while leveraging the scalability and features of enterprise RDBMS systems.

### Separate Jobs Database

Or if preferred, you can maintain background jobs in a **separate database** from your main application database. 
This separation keeps the write-heavy job processing load off your primary database, allowing you to optimize 
each database independently for its specific workload patterns like maintaining different backup strategies
for your critical application data vs. job history. 

```csharp
// Configure.Db.cs
services.AddOrmLite(options => options.UsePostgres(connectionString))
        .AddPostgres("jobs", jobsConnectionString);

// Configure.BackgroundJobs.cs
services.AddPlugin(new DatabaseJobFeature {
    NamedConnection = "jobs"
});
```

### Real Time Admin UI

The Jobs Admin UI provides a real time view into the status of all background jobs including their progress, completion times, 
Executed, Failed, and Cancelled Jobs, etc. which is useful for monitoring and debugging purposes.

[![](https://servicestack.net/img/posts/background-jobs/jobs-dashboard.webp)](https://servicestack.net/img/posts/background-jobs/jobs-dashboard.webp)

View Real-time progress of queued Jobs

[![](https://servicestack.net/img/posts/background-jobs/jobs-queue.webp)](https://servicestack.net/img/posts/background-jobs/jobs-queue.webp)

View real-time progress logs of executing Jobs

[![](https://servicestack.net/img/posts/background-jobs/jobs-logs.webp)](https://servicestack.net/img/posts/background-jobs/jobs-logs.webp)

View Job Summary and Monthly Databases of Completed and Failed Jobs

[![](https://servicestack.net/img/posts/background-jobs/jobs-completed.webp)](https://servicestack.net/img/posts/background-jobs/jobs-completed.webp)

View full state and execution history of each Job

[![](https://servicestack.net/img/posts/background-jobs/jobs-failed.webp)](https://servicestack.net/img/posts/background-jobs/jobs-failed.webp)

Cancel Running jobs and Requeue failed jobs

## Usage

For even greater reuse of your APIs you're able to queue your existing ServiceStack Request DTOs
as a Background Job in addition to [Commands](https://docs.servicestack.net/commands) 
for encapsulating units of logic into internal invokable, inspectable and auto-retryable building blocks.

### Queue Commands

Any API, Controller or Minimal API can execute jobs with the `IBackgroundJobs` dependency, e.g.
here's how you can run a background job to send a new email when an API is called in
any new Identity Auth template:

```csharp
class MyService(IBackgroundJobs jobs) : Service 
{
    public object Any(MyOrder request)
    {
        var jobRef = jobs.EnqueueCommand<SendEmailCommand>(new SendEmail {
            To = "my@email.com",
            Subject = $"Received New Order {request.Id}",
            BodyText = $"""
                       Order Details:
                       {request.OrderDetails.DumptTable()}
                       """,
        });
        //...
    }
}
```

Which records and immediately executes a worker to execute the `SendEmailCommand` with the specified
`SendEmail` Request argument. It also returns a reference to a Job which can be used later to query
and track the execution of a job.

### Queue APIs

Alternatively a `SendEmail` API could be executed with just the Request DTO:

```csharp
var jobRef = jobs.EnqueueApi(new SendEmail {
    To = "my@email.com",
    Subject = $"Received New Order {request.Id}",
    BodyText = $"""
               Order Details:
               {request.OrderDetails.DumptTable()}
               """,
});
```

Although Sending Emails is typically not an API you want to make externally available and would
want to [Restrict access](https://docs.servicestack.net/auth/restricting-services) or [limit usage to specified users](https://docs.servicestack.net/auth/identity-auth#declarative-validation-attributes).

In both cases the `SendEmail` Request is persisted into the Jobs SQLite database for durability
that gets updated as it progresses through the queue.

For execution the API or command is resolved from the IOC before being invoked with the Request.
APIs are executed via the [MQ Request Pipeline](https://docs.servicestack.net/order-of-operations)
and commands executed using the [Commands Feature](https://docs.servicestack.net/commands) where
they'll also be visible in the [Commands Admin UI](https://docs.servicestack.net/commands#command-admin-ui).

### Background Job Options

The behavior for each `Enqueue*` method for executing background jobs can be customized with
the following options:

- `Worker` - Serially process job using a named worker thread
- `Callback` - Invoke another command with the result of a successful job
- `DependsOn` - Execute jobs after successful completion of a dependent job
    - If parent job fails all dependent jobs are cancelled
- `UserId` - Execute within an Authenticated User Context
- `RunAfter` - Queue jobs that are only run after a specified date
- `RetryLimit` - Override default retry limit for how many attempts should be made to execute a job
- `TimeoutSecs` - Override default timeout for how long a job should run before being cancelled
- `RefId` - Allow clients to specify a unique Id (e.g Guid) to track job
- `Tag` - Group related jobs under a user specified tag
- `CreatedBy` - Optional field for capturing the owner of a job
- `BatchId` - Group multiple jobs with the same Id
- `ReplyTo` - Optional field for capturing where to send notification for completion of a Job
- `Args` - Optional String Dictionary of Arguments that can be attached to a Job

### Feature Overview

It packs most features needed in a Background Jobs solution including:

- Use your App's existing RDBMS (no other infrastructure dependencies)
- Execute existing APIs or versatile Commands
    - Commands auto registered in IOC
- Scheduled Reoccurring Tasks
    - Track Last Job Run
- Serially execute jobs with the same named Worker
- Queue Jobs dependent on successful completion of parent Job
- Queue Jobs to be executed after a specified Date
- Execute Jobs within the context of an Authenticated User
- Auto retry failed jobs on a default or per-job limit
- Timeout Jobs on a default or per-job limit
- Cancellable Jobs
- Requeue Failed Jobs
- Execute custom callbacks on successful execution of Job
- Maintain Status, Logs, and Progress of Executing Jobs
- Execute transitive (i.e. non-durable) jobs using named workers
- Attach optional `Tag`, `BatchId`, `CreatedBy`, `ReplyTo` and `Args` with Jobs

Please [let us know](https://servicestack.net/ideas) of any other missing features you'd love to see implemented.

## Schedule Recurring Tasks

In addition to queueing jobs to run in the background, it also supports scheduling recurring tasks
to execute APIs or Commands at fixed intervals.

:::youtube DtB8KaXXMCM
Schedule your Reoccurring Tasks with Background Jobs!
:::

APIs and Commands can be scheduled to run at either a `TimeSpan` or
[CRON Expression](https://github.com/HangfireIO/Cronos?tab=readme-ov-file#cron-format) interval, e.g:

### CRON Expression Examples

```csharp
// Every Minute Expression
jobs.RecurringCommand<CheckUrlsCommand>(Schedule.Cron("* * * * *"));

// Every Minute Constant
jobs.RecurringCommand<CheckUrlsCommand>(Schedule.EveryMinute, new CheckUrls {
    Urls = urls
});
```

### CRON Format

You can use any **unix-cron format** expression supported by the [HangfireIO/Cronos](https://github.com/HangfireIO/Cronos) library:

```txt
|------------------------------- Minute (0-59)
|     |------------------------- Hour (0-23)
|     |     |------------------- Day of the month (1-31)
|     |     |     |------------- Month (1-12; or JAN to DEC)
|     |     |     |     |------- Day of the week (0-6; or SUN to SAT)
|     |     |     |     |
|     |     |     |     |
*     *     *     *     *
```

The allowed formats for each field include:

| Field            | Format of valid values                     |
|------------------|--------------------------------------------|
| Minute           | 0-59                                       |
| Hour             | 0-23                                       |
| Day of the month | 1-31                                       |
| Month            | 1-12 (or JAN to DEC)                       |
| Day of the week  | 0-6 (or SUN to SAT; or 7 for Sunday)       |

#### Matching all values

To match all values for a field, use the asterisk: `*`, e.g here are two examples in which the minute field is left unrestricted:

- `* 0 1 1 1` - the job runs every minute of the midnight hour on January 1st and Mondays.
- `* * * * *` - the job runs every minute (of every hour, of every day of the month, of every month, every day of the week, because each of these fields is unrestricted too).

#### Matching a range

To match a range of values, specify your start and stop values, separated by a hyphen (-). Do not include spaces in the range. Ranges are inclusive. The first value must be less than the second.

The following equivalent examples run at midnight on Mondays, Tuesdays, Wednesdays, Thursdays, and Fridays (for all months):

- `0 0 * * 1-5`
- `0 0 * * MON-FRI`

#### Matching a list

Lists can contain any valid value for the field, including ranges. Specify your values, separated by a comma (,). Do not include spaces in the list, e.g:

- `0 0,12 * * *` - the job runs at midnight and noon.
- `0-5,30-35 * * * *` - the job runs in each of the first five minutes of every half hour (at the top of the hour and at half past the hour).

### TimeSpan Interval Examples

```csharp
jobs.RecurringCommand<CheckUrlsCommand>(
    Schedule.Interval(TimeSpan.FromMinutes(1)));

// With Example
jobs.RecurringApi(Schedule.Interval(TimeSpan.FromMinutes(1)), new CheckUrls {
    Urls = urls
});
```

That can be registered with an optional **Task Name** and **Background Options**, e.g:

```csharp
jobs.RecurringCommand<CheckUrlsCommand>("Check URLs", Schedule.EveryMinute, 
   new() {
       RunCommand = true // don't persist job
   });
```

> If no name is provided, the Command's Name or APIs Request DTO will be used

## Interned Cronos

A major source of friction in .NET Libraries and most Frameworks from all platforms in general is dependency conflicts.
E.g. Conflicting versions of JSON.NET have plagued many a .NET library and framework for several years, something that 
never impacted ServiceStack Apps since we maintain our own fast/flexible JSON Serializer and have never had a dependency 
to JSON.NET.

As supply chain attacks from external OSS libraries have become more common, it's even more important to avoid 
taking dependencies on external libraries where possible.

As we now have multiple packages that referenced 
[Hangfire's Cronos](https://github.com/HangfireIO/Cronos) library we've decided to intern it in ServiceStack, 
removing the previous dependency **ServiceStack.Jobs** had to Cronos. The only issue was that
[CronParser.cs](https://github.com/HangfireIO/Cronos/blob/main/src/Cronos/CronParser.cs) uses unsafe parsing and we
don't allow `<AllowUnsafeBlocks>` in any ServiceStack package, so it was rewritten to use Spans in our interned
[CronParser.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Common/Cronos/CronParser.cs) 
implementation. 

It's released under the same MIT License as Cronos so anyone else is welcome to use it, as is our port of their
[CronExpressionTests.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/tests/ServiceStack.Common.Tests/CronExpressionTests.cs)
to NUnit.

### Idempotent Registration

Scheduled Tasks are idempotent where the same registration with the same name will
either create or update the scheduled task registration without losing track of the
last time the Recurring Task, as such it's recommended to always define your App's
Scheduled Tasks on Startup:

```csharp
public class ConfigureBackgroundJobs : IHostingStartup
{
   public void Configure(IWebHostBuilder builder) => builder
     .ConfigureServices((context,services) => {
         //...
     }).ConfigureAppHost(afterAppHostInit: appHost => {
         var services = appHost.GetApplicationServices();
         var jobs = services.GetRequiredService<IBackgroundJobs>();
         
         // App's Scheduled Tasks Registrations:
         jobs.RecurringCommand<MyCommand>(Schedule.Hourly);
     });
}
```

### Background Jobs Admin UI

The last job the Recurring Task ran is also viewable in the Jobs Admin UI:

[![](https://servicestack.net/img/posts/background-jobs/jobs-scheduled-tasks-last-job.webp)](https://servicestack.net/img/posts/background-jobs/jobs-scheduled-tasks-last-job.webp)

### Executing non-durable jobs

`IBackgroundJobs` also supports `RunCommand*` methods for executing background jobs transiently
(i.e. non-durable), which is useful for commands that want to be serially executed by a named worker
but don't need to be persisted.

#### Execute in Background and return immediately

You could use this to queue system emails to be sent by the same **smtp** worker and are happy to
not have its state and execution history tracked in the Jobs database.

```csharp
var job = jobs.RunCommand<SendEmailCommand>(new SendEmail { ... }, 
    new() {
        Worker = "smtp"
    });
```

In this case `RunCommand` returns the actual `BackgroundJob` instance that will be updated by
the worker.

#### Execute in Background and wait for completion

You can also use `RunCommandAsync` if you prefer to wait until the job has been executed. Instead
of a Job it returns the **Result** of the command if it returned one.

```csharp
var result = await jobs.RunCommandAsync<SendEmailCommand>(new SendEmail {...}, 
    new() {
        Worker = "smtp"
    });
```

### Serially Execute Jobs with named Workers

By default jobs are executed immediately in a new Task, we can also change the behavior to
instead execute jobs one-by-one in a serial queue by specifying them to use the same named
worker as seen in the example above.

Alternatively you can annotate the command with the `[Worker]` attribute if you **always** want
all jobs executing the command to use the same worker:

```csharp
[Worker("smtp")]
public class SendEmailCommand(IBackgroundJobs jobs) : SyncCommand<SendEmail>
{
    //...
}
```

### Use Callbacks to process the results of Commands

Callbacks can be used to extend the lifetime of a job to include processing a callback to process its results.
This is useful where you would like to reuse the the same command but handle the results differently,
e.g. the same command can email results or invoke a webhook by using a callback:

```csharp
jobs.EnqueueCommand<CheckUrlsCommand>(new CheckUrls { Urls = allUrls },
    new() {
        Callback = nameof(EmailUrlResultsCommand),
    });

jobs.EnqueueCommand<CheckUrlsCommand>(new CheckUrls { Urls = criticalUrls },
    new() {
        Callback = nameof(WebhookUrlResultsCommand),
        ReplyTo = callbackUrl
    });
```

Callbacks that fail are auto-retried the same number of times as their jobs, which if they all fail then
the entire job is also marked as failed.

### Run Job dependent on successful completion of parent

Jobs can be queued to only run after the successful completion of another job, this is useful
for when you need to kick off multiple jobs after a long running task has finished like
generating monthly reports after monthly data has been aggregated, e.g:

```csharp
var jobRef = jobs.EnqueueCommand<AggregateMonthlyDataCommand>(new Aggregate {
    Month = DateTime.UtcNow
});

jobs.EnqueueCommand<GenerateSalesReportCommand>(new () {
   DependsOn = jobRef.Id,
});

jobs.EnqueueCommand<GenerateExpenseReportCommand>(new () {
   DependsOn = jobRef.Id,
});
```

Inside your command you can get a reference to your current job with `Request.GetBackgroundJob()`
which will have its `ParentId` populated with the parent job Id and `job.ParentJob` containing
a reference to the completed Parent Job where you can access its Request, Results, and other job
information:

```csharp
public class GenerateSalesReportCommand(ILogger<MyCommandNoArgs> log) 
    : SyncCommand
{
    protected override void Run()
    {
        var job = Request.GetBackgroundJob();
        var parentJob = job.ParentJob;
    }
}
```

### Atomic Batching Behavior

We can also use `DependsOn` to implement atomic batching behavior where from inside our
executing command we can queue new jobs that are dependent on the successful execution
of the current job, e.g:

```csharp
public class CheckUrlsCommand(IHttpClientFactory factory, IBackgroundJobs jobs)
    : AsyncCommand<CheckUrls>
{
    protected override async Task RunAsync(CheckUrls req, CancellationToken ct)
    {
        var job = Request.GetBackgroundJob();

        var batchId = Guid.NewGuid().ToString("N");
        using var client = factory.CreateClient();
        foreach (var url in req.Urls)
        {
            var msg = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await client.SendAsync(msg, ct);
            response.EnsureSuccessStatusCode();
      
            jobs.EnqueueCommand<SendEmailCommand>(new SendEmail {
                To = "my@email.com",
                Subject = $"{new Uri(url).Host} status",
                BodyText = $"{url} is up",
            }, new() {
                DependsOn = job.Id,
                BatchId = batchId,
            });
        }
    }
}
```

Where any dependent jobs are only executed if the job was successfully completed.
If instead an exception was thrown during execution, the job will be failed and
all its dependent jobs cancelled and removed from the queue.

### Executing jobs with an Authenticated User Context

If you have existing logic dependent on a Authenticated `ClaimsPrincipal` or ServiceStack
`IAuthSession` you can have your APIs and Commands also be executed with that user context
by specifying the `UserId` the job should be executed as:

```csharp
var openAiRequest = new CreateOpenAiChat {
   Request = new() {
       Model = "gpt-4",
       Messages = [
           new() {
               Content = request.Question
           }
       ]
   },
}; 

// Example executing API Job with User Context
jobs.EnqueueApi(openAiRequest, 
    new() {
      UserId = Request.GetClaimsPrincipal().GetUserId(),
      CreatedBy = Request.GetClaimsPrincipal().GetUserName(),
   });

// Example executing Command Job with User Context
jobs.EnqueueCommand<CreateOpenAiChatCommand>(openAiRequest, 
    new() {
      UserId = Request.GetClaimsPrincipal().GetUserId(),
      CreatedBy = Request.GetClaimsPrincipal().GetUserName(),
   });
```

Inside your API or Command you access the populated User `ClaimsPrincipal` or
ServiceStack `IAuthSession` using the same APIs that you'd use inside your ServiceStack APIs, e.g:

```csharp
public class CreateOpenAiChatCommand(IBackgroundJobs jobs) 
    : AsyncCommand<CreateOpenAiChat>
{
    protected override async Task RunAsync(
        CreateOpenAiChat request, CancellationToken token)
    {
        var user = Request.GetClaimsPrincipal();
        var session = Request.GetSession();
        //...
    }
}
```

### Queue Job to run after a specified date

Using `RunAfter` lets you queue jobs that are only executed after a specified `DateTime`,
useful for executing resource intensive tasks at low traffic times, e.g:

```csharp
var jobRef = jobs.EnqueueCommand<AggregateMonthlyDataCommand>(new Aggregate {
       Month = DateTime.UtcNow
   }, 
   new() {
       RunAfter = DateTime.UtcNow.Date.AddDays(1)
   });
```

### Attach Metadata to Jobs

All above Background Job Options have an effect on when and how Jobs are executed.
There are also a number of properties that can be attached to a Job that can be useful
in background job processing despite not having any effect on how jobs are executed.

These properties can be accessed by commands or APIs executing the Job and are visible
and can be filtered in the Jobs Admin UI to help find and analyze executed jobs.

```csharp
var jobRef = jobs.EnqueueCommand<CreateOpenAiChatCommand>(openAiRequest, 
   new() {
      // Group related jobs under a common tag
      Tag = "ai",
      // A User-specified or system generated unique Id to track the job
      RefId = request.RefId,
      // Capture who created the job
      CreatedBy = Request.GetClaimsPrincipal().GetUserName(),
      // Link jobs together that are sent together in a batch
      BatchId = batchId,
      // Capture where to notify the completion of the job to
      ReplyTo = "https:example.org/callback",
      // Additional properties about the job that aren't in the Request  
      Args = new() {
          ["Additional"] = "Metadata"
      }
   });
```

### Querying a Job

A job can be queried by either it's auto-incrementing `Id` Primary Key or by a unique `RefId`
that can be user-specified.

```csharp
var jobResult = jobs.GetJob(jobRef.Id);

var jobResult = jobs.GetJobByRefId(jobRef.RefId);
```

At a minimum a `JobResult` will contain the Summary Information about a Job as well as the
full information about a job depending on where it's located:

```csharp
class JobResult
{
    // Summary Metadata about a Job in the JobSummary Table 
    JobSummary Summary
    // Job that's still in the BackgroundJob Queue
    BackgroundJob? Queued
    // Full Job information in Monthly DB CompletedJob Table
    CompletedJob? Completed
    // Full Job information in Monthly DB FailedJob Table
    FailedJob? Failed
    // Helper to access full Job Information
    BackgroundJobBase? Job => Queued ?? Completed ?? Failed 
}
```

### Job Execution Limits

Default Retry and Timeout Limits can be configured on the `DatabaseJobFeature`:

```csharp
services.AddPlugin(new DatabaseJobFeature
{
   DefaultRetryLimit = 2,
   DefaultTimeout = TimeSpan.FromMinutes(10),
});
```

These limits are also overridable on a per-job basis, e.g:

```csharp
var jobRef = jobs.EnqueueCommand<AggregateMonthlyDataCommand>(new Aggregate {
       Month = DateTime.UtcNow
   }, 
   new() {
      RetryLimit = 3,
      Timeout = TimeSpan.FromMinutes(30),
   });
```

### Logging, Cancellation an Status Updates

We'll use the command for checking multiple URLs to demonstrate some recommended patterns
and how to enlist different job processing features.

```csharp
public class CheckUrlsCommand(
    ILogger<CheckUrlsCommand> logger,
    IBackgroundJobs jobs,
    IHttpClientFactory clientFactory) : AsyncCommand<CheckUrls>
{
    protected override async Task RunAsync(CheckUrls req, CancellationToken ct)
    {
        // 1. Create Logger that Logs and maintains logging in Jobs DB
        var log = Request.CreateJobLogger(jobs,logger);

        // 2. Get Current Executing Job
        var job = Request.GetBackgroundJob();

        var result = new CheckUrlsResult {
            Statuses = new()
        };
        using var client = clientFactory.CreateClient();
        for (var i = 0; i < req.Urls.Count; i++)
        {
            // 3. Stop processing Job if it's been cancelled 
            ct.ThrowIfCancellationRequested();

            var url = req.Urls[i];
            try
            {
                var msg = new HttpRequestMessage(HttpMethod.Get,url);
                var response = await client.SendAsync(msg, ct);

                result.Statuses[url] = response.IsSuccessStatusCode;
                log.LogInformation("{Url} is {Status}",
                    url, response.IsSuccessStatusCode ? "up" : "down");

                // 4. Optional: Maintain explicit progress and status updates
                log.UpdateStatus(i/(double)req.Urls.Count,$"Checked {i} URLs");
            }
            catch (Exception e)
            {
                log.LogError(e, "Error checking {Url}", url);
                result.Statuses[url] = false;
            }
        }

        // 5. Send Results to WebHook Callback if specified
        if (job.ReplyTo != null)
        {
            jobs.EnqueueCommand<NotifyCheckUrlsCommand>(result,
                new() {
                    ParentId = job.Id,
                    ReplyTo = job.ReplyTo,
                });
        }
    }
}
```

We'll cover some of the notable parts useful when executing Jobs:

#### 1. Job Logger

We can use a Job logger to enable database logging that can be monitored in real-time in the
Admin Jobs UI. Creating it with both `BackgroundJobs` and `ILogger` will return a combined
logger that both Logs to standard output and to the Jobs database:

```csharp
var log = Request.CreateJobLogger(jobs,logger);
```

Or just use `Request.CreateJobLogger(jobs)` to only save logs to the database.

#### 2. Resolve Executing Job

If needed the currently executing job can be accessed with:

```csharp
var job = Request.GetBackgroundJob();
```

Where you'll be able to access all the metadata the jobs were created with including `ReplyTo`
and `Args`.

#### 3. Check if Job has been cancelled

To be able to cancel a long running job you'll need to periodically check if a Cancellation
has been requested and throw a `TaskCanceledException` if it has to short-circuit the command
which can be done with:

```csharp
ct.ThrowIfCancellationRequested();
```

You'll typically want to call this at the start of any loops to prevent it from doing any more work.

#### 4. Optionally record progress and status updates

By default Background Jobs looks at the last API or Command run and worker used to estimate
the duration and progress for how long a running job will take.

If preferred your command can explicitly set a more precise progress and optional status update
that should be used instead, e.g:

```csharp
log.UpdateStatus(progress:i/(double)req.Urls.Count, $"Checked {i} URLs");
```

Although generally the estimated duration and live logs provide a good indication for the progress
of a job.

#### 5. Notify completion of Job

Calling a Web Hook is a good way to notify externally initiated job requests of the completion
of a job. You could invoke the callback within the command itself but there are a few benefits
to initiating another job to handle the callback:

- Frees up the named worker immediately to process the next task
- Callbacks are durable, auto-retried and their success recorded like any job
- If a callback fails the entire command doesn't need to be re-run again

We can queue a callback with the result by passing through the `ReplyTo` and link it to the
existing job with:

```csharp
if (job.ReplyTo != null)
{
   jobs.EnqueueCommand<NotifyCheckUrlsCommand>(result,
       new() {
           ParentId = job.Id,
           ReplyTo = job.ReplyTo,
       });
}
```

Which we can implement by calling the `SendJsonCallbackAsync` extension method with the
Callback URL and the Result DTO it should be called with:

```csharp
public class NotifyCheckUrlsCommand(IHttpClientFactory clientFactory) 
    : AsyncCommand<CheckUrlsResult>
{
    protected override async Task RunAsync(
        CheckUrlsResult request, CancellationToken token)
    {
        await clientFactory.SendJsonCallbackAsync(
            Request.GetBackgroundJob().ReplyTo, request, token);
    }
}
```

#### Callback URLs

`ReplyTo` can be any URL which by default will have the result POST'ed back to the URL with a JSON
Content-Type. Typically URLs will contain a reference Id so external clients can correlate a callback
with the internal process that initiated the job. If the callback API is publicly available you'll
want to use an internal Id that can't be guessed so the callback can't be spoofed, like a Guid, e.g:

    https://api.example.com?refId={RefId}

If needed the callback URL can be customized on how the HTTP Request callback is sent.

You can change the HTTP Method used by including it before the URL:

    PUT https://api.example.com

If the auth part contains a colon `:` it's treated as Basic Auth:

    username:password@https://api.example.com

If name starts with `http.` sends a HTTP Header

    http.X-API-Key:myApiKey@https://api.example.com

Otherwise it's sent as a Bearer Token:

    myToken123@https://api.example.com

Bearer Token or HTTP Headers starting with `$` is substituted with Environment Variable if exists:

    $API_TOKEN@https://api.example.com

When needed headers, passwords, and tokens can be URL encoded if they contain any delimiter characters.

## Implementing Commands

At a minimum a command need only implement the [IAsyncCommand interface](https://docs.servicestack.net/commands#commands-feature):

```csharp
public interface IAsyncCommand<in T>
{
    Task ExecuteAsync(T request);
}
```

Which is the singular interface that can execute any command.

However commands executed via Background Jobs have additional context your commands may need to
access during execution, including the `BackgroundJob` itself, the `CancellationToken` and
an Authenticated User Context.

To reduce the effort in creating commands with a `IRequest` context we've added a number ergonomic
base classes to better capture the different call-styles a unit of logic can have including
**Sync** or **Async** execution, whether they require **Input Arguments** or have **Result Outputs**.

Choosing the appropriate Abstract base class benefits from IDE tooling in generating the method
signature that needs to be implemented whilst Async commands with Cancellation Tokens in its method
signature highlights any missing async methods that are called without the token.

### Sync Commands

- `SyncCommand` - Requires No Arguments
- `SyncCommand<TRequest>` - Requires TRequest Argument
- `SyncCommandWithResult<TResult>` - Requires No Args and returns Result
- `SyncCommandWithResult<TReq,TResult>` - Requires Arg and returns Result

```csharp
public record MyArgs(int Id);
public record MyResult(string Message);

public class MyCommandNoArgs(ILogger<MyCommandNoArgs> log) : SyncCommand
{
    protected override void Run()
    {
        log.LogInformation("Called with No Args");
    }
}

public class MyCommandArgs(ILogger<MyCommandNoArgs> log) : SyncCommand<MyArgs>
{
    protected override void Run(MyArgs request)
    {
        log.LogInformation("Called with {Id}", request.Id);
    }
}

public class MyCommandWithResult(ILogger<MyCommandNoArgs> log) 
    : SyncCommandWithResult<MyResult>
{
    protected override MyResult Run()
    {
        log.LogInformation("Called with No Args and returns Result");
        return new MyResult("Hello World");
    }
}

public class MyCommandWithArgsAndResult(ILogger<MyCommandNoArgs> log) 
    : SyncCommandWithResult<MyArgs,MyResult>
{
    protected override MyResult Run(MyArgs request)
    {
        log.LogInformation("Called with {Id} and returns Result", request.Id);
        return new MyResult("Hello World");
    }
}
```

### Async Commands

- `AsyncCommand` - Requires No Arguments
- `AsyncCommand<TRequest>` - Requires TRequest Argument
- `AsyncCommandWithResult<TResult>` - Requires No Args and returns Result
- `AsyncCommandWithResult<TReq,TResult>` - Requires Arg and returns Result

```csharp
public class MyAsyncCommandNoArgs(ILogger<MyCommandNoArgs> log) : AsyncCommand
{
    protected override async Task RunAsync(CancellationToken token)
    {
        log.LogInformation("Async called with No Args");
    }
}

public class MyAsyncCommandArgs(ILogger<MyCommandNoArgs> log) 
    : AsyncCommand<MyArgs>
{
    protected override async Task RunAsync(MyArgs request, CancellationToken t)
    {
        log.LogInformation("Async called with {Id}", request.Id);
    }
}

public class MyAsyncCommandWithResult(ILogger<MyCommandNoArgs> log) 
    : AsyncCommandWithResult<MyResult>
{
    protected override async Task<MyResult> RunAsync(CancellationToken token)
    {
        log.LogInformation("Async called with No Args and returns Result");
        return new MyResult("Hello World");
    }
}

public class MyAsyncCommandWithArgsAndResult(ILogger<MyCommandNoArgs> log) 
    : AsyncCommandWithResult<MyArgs,MyResult>
{
    protected override async Task<MyResult> RunAsync(
        MyArgs request, CancellationToken token)
    {
        log.LogInformation("Called with {Id} and returns Result", request.Id);
        return new MyResult("Hello World");
    }
}
```
