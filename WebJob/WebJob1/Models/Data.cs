using Newtonsoft.Json;

namespace WebJob1.Models
{
    public class Data
    {
        [JsonProperty(PropertyName = "ticket")]
        public string Ticket { get; set; }
    }
    public class LoginResponse
    {
        [JsonProperty(PropertyName = "data")]
        public Data Data { get; set; }

    }
}