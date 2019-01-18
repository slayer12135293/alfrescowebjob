using System.Collections.Generic;

namespace WebJob1.Models
{
    public class QnamePath
    {
        public string Name { get; set; }
        public string PrefixedName { get; set; }
    }

    public class NameType
    {
        public string Name { get; set; }
        public string PrefixedName { get; set; }
    }

    public class Result
    {
        public string NodeRef { get; set; }
        public QnamePath QnamePath { get; set; }
        public NameType Name { get; set; }
        public string ParentNodeRef { get; set; }
    }

    public class SearchResultObj
    {
        public int NumResults { get; set; }
        public List<Result> Results { get; set; }
        public int SearchElapsedTime { get; set; }
    }
}
