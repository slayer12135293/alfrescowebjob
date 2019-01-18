using Newtonsoft.Json.Linq;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Json;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using WebJob1.Models;
using static System.Int32;

namespace WebJob1
{
  public class Functions
  {
    private const string BaseUrl = "";
    private const string SiteUrl = "";

    private const string LoginPath = "/alfresco/service/api/login";

    //private const string SitesPath = "/alfresco/service/api/sites?";
    private const string SearchPath =
    "/alfresco/service/slingshot/node/search?lang=lucene&store=workspace://SpacesStore&q=";

    private const string NodePath = "/alfresco/api/-default-/public/alfresco/versions/1/nodes/";
    private const string UserName = "admin";
    private const string Psw = "";
    private const string SendGridApiKey = "";
    private const string MailTemplateId = "";
    private const string AdminMail = "";


    public static async Task SendMails()
    {
      var loginResponse = await LoginToAlfresco();
      var ticket = loginResponse.Data.Ticket;
      var nodes = await GetAllNodes(ticket);


      Console.WriteLine(nodes.Results.Count);

      var mailBucket = new List<MailBucketItem>();

      await FillingMailBucket(nodes, ticket, mailBucket);


      var groupedList = mailBucket.GroupBy(x => x.Email).Select(group => group.ToList()).ToList();

      Console.WriteLine("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

      foreach (var item in groupedList)
      {
        Console.WriteLine(item.Count);

        var tempMailTo = string.Empty;
        var tempRawHtmlBody = string.Empty;
        foreach (var node in item)
        {
          tempMailTo = node.Email;

          var updatedTotalRemindersSent = 1;
          if (node.NodeObjectDetail.Entry.Properties["dts:TotalRemindersSent"] != null)
          {
            updatedTotalRemindersSent = Parse(node.NodeObjectDetail.Entry.Properties["dts:TotalRemindersSent"].ToString()) + 1;
          }

          // update nodes
          using (var client = new HttpClient())
          {
            var updatedProperty = new JObject
{
{
"properties",
new JObject
{
{"dts:LastReminderSentTo", tempMailTo},
{"dts:LastReminderSentDate", DateTime.Now},
{"dts:TotalRemindersSent", updatedTotalRemindersSent}
}
}
};

            //Console.WriteLine($"{BaseUrl}{NodePath}{nodeDetail.Entry.Id}?alf_ticket={ticket}");
            var response = await client.PutAsJsonAsync($"{BaseUrl}{NodePath}{node.NodeObjectDetail.Entry.Id}?alf_ticket={ticket}",
            updatedProperty);
            response.EnsureSuccessStatusCode();
            Console.WriteLine($"node updated: {node.NodeObjectDetail.Entry.Id}");
          }
          tempMailTo = node.Email;


          //var sendToEmail = await GetSendToEmail(nodeDetail, ticket);
          var linkToSite = GetSiteLink(node.NodeObjectDetail);
          var estateName = node.NodeObjectDetail.Entry.Path.Elements[5].Name;
          var nodeReference = node.NodeObjectDetail.Entry.Path.Elements.Count == 7
          ? $"{node.NodeObjectDetail.Entry.Path.Elements[6].Name} / {node.NodeObjectDetail.Entry.Name}"
          : $"{node.NodeObjectDetail.Entry.Path.Elements[6].Name} / {node.NodeObjectDetail.Entry.Path.Elements[6].Name} / {node.NodeObjectDetail.Entry.Name}";

          tempRawHtmlBody += $"{nodeReference} i fastigheten <b>{estateName}</b> med länken : {linkToSite.Replace(" ", "%20")} </br>";
        }
        var mailContent = new MailContent
        {
          EstateName = "homer",
          NodePrefix = "peter",
          RawBody = tempRawHtmlBody
        };
        await SendReminderMail(mailContent, tempMailTo, ticket);
      }

      Console.WriteLine($"Total number of mails should be sent: {mailBucket.Count}");
    }

    private static async Task FillingMailBucket(SearchResultObj nodes, string ticket, List<MailBucketItem> mailBucket)
    {
      foreach (var node in nodes.Results)
      {
        try
        {
          var nodeRefArray = node.NodeRef.Split('/');
          var nodeDetail = await GetNodeById(ticket, nodeRefArray[nodeRefArray.Length - 1]);

          if (nodeDetail.Entry.Properties["dts:LastReminderSentDate"] == null)
          {
            Console.WriteLine("11111111111111111111111111111111111");
            //await SendReminderMail(nodeDetail, ticket, sentMails);
            var sendToEmail = await GetSendToEmail(nodeDetail, ticket);
            mailBucket.Add(new MailBucketItem { Email = sendToEmail, NodeObjectDetail = nodeDetail });
          }
          else
          {
            if (nodeDetail.Entry.Properties["dts:TotalRemindersSent"] == null)
            {
              Console.WriteLine("222222222222222222222222222222222222222");
              //await SendReminderMail(nodeDetail, ticket);
              var sendToEmail = await GetSendToEmail(nodeDetail, ticket);
              mailBucket.Add(new MailBucketItem { Email = sendToEmail, NodeObjectDetail = nodeDetail });
            }
            else
            {
              var lastSentDateString = nodeDetail.Entry.Properties["dts:LastReminderSentDate"].ToString();
              var now = DateTime.Now;
              var lastSentDate = Convert.ToDateTime(lastSentDateString);
              var totalRemindersSent = Parse(nodeDetail.Entry.Properties["dts:TotalRemindersSent"].ToString());

              var sentInterval = (now - lastSentDate).TotalDays;

              if (sentInterval > 0) // such magic numbers, such business rules~~
              {
                //Console.WriteLine("33333333333333333333333333333333");
                //await SendReminderMail(nodeDetail, ticket);
                var sendToEmail = await GetSendToEmail(nodeDetail, ticket);
                mailBucket.Add(new MailBucketItem { Email = sendToEmail, NodeObjectDetail = nodeDetail });
              }
            }
          }
        }
        catch (Exception e)
        {
          Console.WriteLine(e);
        }
      }
    }

    private static async Task SendReminderMail(MailContent mailContent, string sendToEmail, string ticket)
    {
      var sendGridClient = new SendGridClient(SendGridApiKey);
      var msg = new SendGridMessage();
      msg.SetFrom(new EmailAddress("noreplay@datscha.com", "Ready4Sale"));
      msg.SetTemplateId(MailTemplateId);
      msg.AddTo(new EmailAddress("lei.liu@datscha.com"));
      msg.SetTemplateId(MailTemplateId);
      msg.SetTemplateData(mailContent);
      await sendGridClient.SendEmailAsync(msg);

      Console.WriteLine($"Mail sent to:  {sendToEmail}");

      // potential save mail in text file? 
    }

    public static async Task<string> GetSendToEmail(NodeObject nodeObject, string ticket)
    {
      string sendToEmail;

      if (nodeObject.Entry.Properties.ContainsKey("dts:ResponsibleEmail"))
      {
        sendToEmail = nodeObject.Entry.Properties["dts:ResponsibleEmail"].ToString() != ""
        ? JObject.Parse(nodeObject.Entry.Properties.ToString())["dts:ResponsibleEmail"].ToString()
        : AdminMail;
      }
      else
      {
        var responsiblePersonNode = await GetResponsiblePersonNode(nodeObject, ticket);
        sendToEmail = responsiblePersonNode.Entry.Properties["dts:ResponsibleEmail"].ToString() != ""
        ? JObject.Parse(responsiblePersonNode.Entry.Properties.ToString())["dts:ResponsibleEmail"].ToString()
        : AdminMail;
      }

      return sendToEmail;
    }

    public static string GetSiteLink(NodeObject nodeObject)
    {
      var pathArray = nodeObject.Entry.Path.Elements;

      return pathArray.Count < 7 ? string.Empty : $"{SiteUrl}/{pathArray[4].Name}/{pathArray[4].Id}/{pathArray[5].Name}/{pathArray[5].Id}/{pathArray[6].Name}/{pathArray[6].Id}/datacategory";

      //return pathArray.Count >= 7
      //  ? $"{SiteUrl}/{pathArray[4].Name}/{pathArray[4].Id}/{pathArray[5].Name}/{pathArray[5].Id}/{nodeObject.Entry.Name}/{nodeObject.Entry.Id}"
      //  : $"{SiteUrl}/{pathArray[4].Name}/{pathArray[4].Id}/{pathArray[5].Name}/{pathArray[5].Id}/{pathArray[6].Name}/{pathArray[6].Id}/datacategory";
    }


    public static async Task<NodeObject> GetResponsiblePersonNode(NodeObject currentNode, string ticket)
    {
      var result = new NodeObject
      {
        Entry = new Entry { Properties = new JObject { new JProperty("dts:ResponsibleEmail", AdminMail) } }
      };
      var notFound = true;
      var tempId = currentNode.Entry.ParentId;

      while (notFound)
      {
        var parentNode = await GetNodeById(ticket, tempId);
        if (parentNode.Entry.ParentId == null)
        {
          return result;
        }

        if (parentNode.Entry.Properties.ContainsKey("dts:ResponsibleEmail"))
        {
          notFound = false;
          result = parentNode;
        }
        else
        {
          tempId = parentNode.Entry.ParentId;
        }
      }


      return result;
    }

    public static async Task<LoginResponse> LoginToAlfresco()
    {
      HttpResponseMessage loginResponse;
      using (var client = new HttpClient())
      {
        var loginBody = new JsonObject { { "username", UserName }, { "password", Psw } };
        var loginBodyContent = new StringContent(loginBody.ToString(), Encoding.UTF8, "application/json");
        loginResponse = await client.PostAsync($"{BaseUrl}{LoginPath}", loginBodyContent);
      }

      loginResponse.EnsureSuccessStatusCode();
      return await loginResponse.Content.ReadAsAsync<LoginResponse>();
    }

    public static async Task<SearchResultObj> GetAllNodes(string ticket)
    {
      var query = $"TYPE:\"cm:folder\" AND @dts\\:ExpiryMonth: [MIN TO {DateTime.Now:yyyyy-MM-dd}]";

      using (var client = new HttpClient())
      {
        var searchResultResponse = await client.GetAsync($"{BaseUrl}{SearchPath}{query}&alf_ticket={ticket}");
        searchResultResponse.EnsureSuccessStatusCode();
        return await searchResultResponse.Content.ReadAsAsync<SearchResultObj>();
      }
    }

    public static async Task<NodeObject> GetNodeById(string ticket, string id)
    {
      using (var client = new HttpClient())
      {
        var nodeResponse = await client.GetAsync($"{BaseUrl}{NodePath}{id}?include=properties,path&alf_ticket={ticket}");
        nodeResponse.EnsureSuccessStatusCode();
        return await nodeResponse.Content.ReadAsAsync<NodeObject>();
      }
    }
  }
}
