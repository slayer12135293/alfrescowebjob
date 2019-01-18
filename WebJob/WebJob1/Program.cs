using System;
using System.Diagnostics;
using System.Net.Mail;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace WebJob1
{
    // To learn more about Microsoft Azure WebJobs SDK, please see https://go.microsoft.com/fwlink/?LinkID=320976
    class Program
    {
        // Please set the following connection strings in app.config for this WebJob to run:
        // AzureWebJobsDashboard and AzureWebJobsStorage
        static void Main()
        {
            //var config = new JobHostConfiguration();

            //if (config.IsDevelopment)
            //{
            //    config.UseDevelopmentSettings();
            //}

            //var host = new JobHost(config);
            //// The following code ensures that the WebJob will be running continuously
            //host.RunAndBlock();

            //var builder = new HostBuilder();
            //var host = builder.Build();
            //using (host)
            //{
            //    host.Run();
            //}

            //Functions.SendMails().Wait();
            Console.WriteLine("Job started");
            Functions.SendMails().Wait();
            Console.WriteLine("Job ended");

    }

        //private const string Timer = "0 1 * * * *";

        ////public static async Task SendReminderMails([TimerTrigger(Timer, RunOnStartup = true)]
        ////    TimerInfo timer)
        ////{
        ////    await Functions.SendMails();
        ////}

        //public static void CronJob([TimerTrigger("1/2 * * * * *", RunOnStartup = true)] TimerInfo timer)
        //{
        //    Console.WriteLine("Cron job fired!");
        //}
    }
}
