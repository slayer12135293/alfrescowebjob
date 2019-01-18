using System;
using System.Collections.Generic;

namespace WebJob1.Models
{
    public class Site
    {
        public string Url { get; set; }
        public string SitePreset { get; set; }
        public string ShortName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Node { get; set; }
        public string TagScope { get; set; }
        public List<string> SiteManagers { get; set; }
        public bool IsMemberOfGroup { get; set; }
        public bool IsPublic { get; set; }
        public string Visibility { get; set; }
    }
}
