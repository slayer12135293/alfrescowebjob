using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace WebJob1.Models
{
    public class CreatedByUser
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
    }


    public class Element
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class Path
    {
        public string Name { get; set; }
        public bool IsComplete { get; set; }
        public List<Element> Elements { get; set; }
    }
    public class ModifiedByUser
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
    }

   

    public class Entry
    {
        public List<string> AspectNames { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsFolder { get; set; }
        public bool IsFile { get; set; }
        public CreatedByUser CreatedByUser { get; set; }
        public DateTime ModifiedAt { get; set; }
        public Path Path { get; set; }
        public ModifiedByUser ModifiedByUser { get; set; }
        public string Name { get; set; }
        public string Id { get; set; }
        public string NodeType { get; set; }
        public JObject Properties { get; set; }
        public string ParentId { get; set; }
    }

    public class NodeObject
    {
        public Entry Entry { get; set; }
    }

    public class MailBucketItem
    {
      public NodeObject NodeObjectDetail { get; set; }
      public string Email { get; set; }
     
    }
}
