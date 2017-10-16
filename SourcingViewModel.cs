namespace PC.RMS.RP.Areas.Administration.ViewModels
{
    using System.Collections.Generic;
    using System.ComponentModel;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public class SourcingViewModel
    {
        public int? Id { get; set; }

        [DisplayName("Configuration Title")]
        public string Title { get; set; }

        public string Description { get; set; }

        [DisplayName("Results Include:")]
        public string StaticCriteriaOperator { get; set; }

        [DisplayName("Results Include:")]
        public string DynamicCriteriaOperator { get; set; }

        [DisplayName("Is Active?")]
        public bool IsActive { get; set; }

        [DisplayName("Source Workflow")]
        public KeyValuePair<int, string> SourceWorkflow { get; set; }

        [DisplayName("Source Requisition")]
        public KeyValuePair<int, string> SourceRequisition { get; set; }

        [DisplayName("Source Folder")]
        public KeyValuePair<int, string> SourceFolder { get; set; }

        [DisplayName("Destination Workflow")]
        public KeyValuePair<int, string> DestinationWorkflow { get; set; }

        [DisplayName("Destination Folder")]
        public KeyValuePair<int, string> DestinationFolder { get; set; }

        [DisplayName("Configuration ID Field")]
        public KeyValuePair<int, string> FieldDefId { get; set; }

        public IList<StaticCriterionView> StaticCriteria { get; set; }

        public IList<DynamicCriterionView> DynamicCriteria { get; set; }
    }
}