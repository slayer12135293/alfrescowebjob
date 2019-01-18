using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJob1.Models
{
    public class MailContent
    {
        public string NodePrefix { get; set; }  
        public string EstateName { get; set; }
        public string LinkToSite { get; set; }
        public string RawBody { get; set; }
        
    }
}
