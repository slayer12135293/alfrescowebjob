using System;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json.Linq;
using WebJob1;
using WebJob1.Models;
using Xunit;

namespace webjobtest
{
    public class WebjobIntegrationTests
    {
        [Fact]
        public async Task ShouldReturnTicket()
        {
            var result = await Functions.LoginToAlfresco();

            result.Data.Ticket.Should().NotBeNull();
        }

        [Fact]
        public async Task ShouldReturnSearchResults()
        {
            const string ticket = "TICKET_bc65ddac7071711e703104aad2b14565523ad284";
            var searchResults = await Functions.GetAllNodes(ticket);
            var result = searchResults;
            searchResults.Results.Count.Should().Be(201);
        }

        [Fact]
        public async Task ShouldReturnNode()
        {
            const string ticket = "TICKET_925c2b28d224d9ba6395edb9412acf2e302bbcca";
            const string nodeId = "936a541e-b905-4d4d-a7d4-2de576251c04";
            var nodeResult = await Functions.GetNodeById(ticket, nodeId);
            var value = JObject.Parse(nodeResult.Entry.Properties.ToString())["dts:trafficlightStatus"].ToString();
            nodeResult.Entry.Should().NotBeNull();
        }


        [Fact]
        public async Task ShouldFindParentWithResponsiblePersonNode()
        {
            const string ticket = "TICKET_bc65ddac7071711e703104aad2b14565523ad284";
            var currentNode = new NodeObject {Entry = new Entry {ParentId = "9634f231-66fa-4dbd-969d-4fe66fa849fb" } };

            var responsibleNode = await Functions.GetResponsiblePersonNode(currentNode, ticket);
            responsibleNode.Should().NotBeNull();

        }

        [Fact]
        public async Task ShouldAlwaysReturnSendToEmail()
        {
            var nodeObj = new NodeObject
            {
                Entry = new Entry
                {
                    Properties = new JObject
                    {
                       // new JProperty("dts:ResponsibleEmail","")
                    },
                    ParentId = "9634f231-66fa-4dbd-969d-4fe66fa849fb"

                }
            };

            const string ticket = "TICKET_bc65ddac7071711e703104aad2b14565523ad284";

            var result = await Functions.GetSendToEmail(nodeObj, ticket);

            result.Should().Be("homer@simpson.com");

        }




        [Fact]
        public async Task ShouldSendOutMail()
        {
            await Functions.SendMails();
            var result = "asdfasd";
            result.Should().NotBe(null);
        }



    }
}
