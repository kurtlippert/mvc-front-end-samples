namespace PC.RMS.RP.Areas.Administration.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using System.Web.WebPages;

    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;

    using Newtonsoft.Json;

    using PC.RMS.AdvancedSourcing.Core.Application.Messages;
    using PC.RMS.AdvancedSourcing.Core.Application.Services;
    using PC.RMS.Core.Common.Domain.Services;
    using PC.RMS.Core.Common.Infrastructure.Services;
    using PC.RMS.RP.Areas.Administration.ViewModels;
    using PC.RMS.Web.Response;

    using Web;

    public class SourcingController : BaseAuthenticatedController
    {
        private readonly IConfigurationSetupService configurationSetupService;
        private readonly IConfigurer configurer;
        private readonly IObjectMapper objectMapper;
        private readonly IContextManager contextManager;

        public SourcingController(
            IConfigurationSetupService configurationSetupService, 
            IConfigurer configurer, 
            IObjectMapper objectMapper,
            IContextManager contextManager)
        {
            this.configurationSetupService = configurationSetupService;
            this.configurer = configurer;
            this.objectMapper = objectMapper;
            this.contextManager = contextManager;
        }

        public ActionResult Index(int? configurationId)
        {
            var viewModel =
                new SourcingViewModel
                {
                    Title = string.Empty,
                    Description = string.Empty,
                    SourceWorkflow = new KeyValuePair<int, string>(),
                    SourceRequisition = new KeyValuePair<int, string>(),
                    SourceFolder = new KeyValuePair<int, string>(),
                    DestinationWorkflow = new KeyValuePair<int, string>(),
                    DestinationFolder = new KeyValuePair<int, string>(),
                    FieldDefId = new KeyValuePair<int, string>(),
                    StaticCriteria = new List<StaticCriterionView>(),
                    DynamicCriteria = new List<DynamicCriterionView>()
                };

            if (configurationId.HasValue)
            {
                viewModel = this.GetExistingConfiguration((int)configurationId);
                ViewBag.IsEdit = true;
            }
            else
            {
                ViewBag.IsEdit = false;
            }

            // ReSharper disable once Mvc.ViewNotResolved
            return this.View(viewModel);
        }

        public ActionResult ConfigurationLoader()
        {
            var configurations = new List<SourcingViewModel>();
            configurations.AddRange(this.GetAllExistingConfigurations().Select(this.MapMessageToViewModel));

            // ReSharper disable once Mvc.ViewNotResolved
            return this.View(configurations);
        }

        public ActionResult NegativeSearchInfo()
        {
            // ReSharper disable once Mvc.ViewNotResolved
            return this.View();
        }

        public JsonResult GetStaticCriteriaFromConfiguration([DataSourceRequest]DataSourceRequest request, int? configurationId)
        {
            IList<StaticCriterionView> staticCriterion = new List<StaticCriterionView>();

            if (configurationId.HasValue)
            {
                staticCriterion = this.GetExistingConfiguration((int)configurationId).StaticCriteria;
            }

            return this.Json(staticCriterion.ToDataSourceResult(request));
        }

        public JsonResult GetDynamicCriteriaFromConfiguration([DataSourceRequest] DataSourceRequest request, int? configurationId)
        {
            IList<DynamicCriterionView> dynamicCriterion = new List<DynamicCriterionView>();

            if (configurationId.HasValue)
            {
                dynamicCriterion = this.GetExistingConfiguration((int)configurationId).DynamicCriteria;
            }

            return this.Json(dynamicCriterion.ToDataSourceResult(request));
        }

        public JsonResult GetSourceWorkflows()
        {
           var workflows = this.configurationSetupService.GetSourceWorkflows(string.Empty)
                .Select(w => new KeyValuePair<int, string>(w.Key, w.Value));

           return this.Json(workflows, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDestinationWorkflows()
        {
            var workflows = this.configurationSetupService.GetDestinationWorkflows(string.Empty)
                .Select(w => new KeyValuePair<int, string>(w.Key, w.Value));

            return this.Json(workflows, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetRequisitions(int workflowId, string requisitionFilter)
        {
            var requisitions = this.configurationSetupService.GetRequisitions(workflowId, requisitionFilter)
                .Select(r => new KeyValuePair<int, string>(r.Key, r.Value));

            return this.Json(requisitions, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSourceFoldersForWorkflow(int workflowId, string folderFilter)
        {
            var folders = this.configurationSetupService.GetSourceFoldersForWorkflow(workflowId, folderFilter)
                .Select(f => new KeyValuePair<int, string>(f.Key, f.Value));

            return this.Json(folders, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDestinationFoldersForWorkflow(int workflowId, string folderFilter)
        {
            var folders = this.configurationSetupService.GetDestinationFoldersForWorkflow(workflowId, folderFilter)
                .Select(f => new KeyValuePair<int, string>(f.Key, f.Value));

            return this.Json(folders, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPotentialConfigurationIdFields(int requisitionId, string idFieldFilter)
        {
            var potentialConfigurationIdFields =
                this.configurationSetupService.GetPotentialConfigurationIdFields(requisitionId, idFieldFilter)
                    .Select(p => new KeyValuePair<int, string>(p.Key, p.Value));

            return this.Json(potentialConfigurationIdFields, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDomainListValues(int domainListId, string domainListFilter)
        {
            var domainListValues =
                this.configurationSetupService.GetDomainListValues(domainListId, domainListFilter)
                .Select(d => new KeyValuePair<int, string>(d.Key, d.Value));

            return this.Json(domainListValues, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSearchableCandidateFields()
        {
            return this.Json(this.configurationSetupService.GetSearchableCandidateFields(string.Empty), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSearchableRequisitionFields()
        {
            return this.Json(this.configurationSetupService.GetSearchableRequisitionFields(string.Empty), JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddConfiguration(string model)
        {
            SourcingViewModel deserializedModel = JsonConvert.DeserializeObject<SourcingViewModel>(model);
            SourcingConfigurationMessage message = this.objectMapper.Map<SourcingConfigurationMessage>(deserializedModel);

            message.ConfigurationIdValue = this.configurationSetupService.GetConfigurationIdValue(message);
            message.ClientId = this.contextManager.GetContext().ClientId;

            this.configurer.AddConfiguration(message);
            return this.Json(new SuccessResponse());
        }

        public JsonResult UpdateConfiguration(int id, string model)
        {
            SourcingViewModel deserializedModel = (SourcingViewModel)JsonConvert.DeserializeObject(model, typeof(SourcingViewModel));
            SourcingConfigurationMessage message = this.objectMapper.Map<SourcingConfigurationMessage>(deserializedModel);

            message.SourcingConfigurationId = id;
            message.ConfigurationIdValue = this.configurationSetupService.GetConfigurationIdValue(message);
            message.ClientId = this.contextManager.GetContext().ClientId;

            this.configurer.ModifyConfiguration(message);
            return this.Json(new SuccessResponse());
        }

        public JsonResult DeleteConfiguration(int id)
        {
            this.configurer.RemoveConfiguration(id);
            return this.Json(new SuccessResponse());
        }

        public ActionResult ConfirmDeleteConfiguration(int configurationId)
        {
            SourcingConfigurationMessage existingConfiguration = this.configurer.GetConfiguration(configurationId);
            SourcingViewModel model = this.MapMessageToViewModel(existingConfiguration);

            // ReSharper disable once Mvc.ViewNotResolved
            return this.View(model);
        }

        private IList<SourcingConfigurationMessage> GetAllExistingConfigurations()
        {
            return this.configurer.GetConfigurations();
        }

        private SourcingViewModel GetExistingConfiguration(int id)
        {
            SourcingConfigurationMessage existingConfiguration = this.configurer.GetConfiguration(id);
            SourcingViewModel model = this.MapMessageToViewModel(existingConfiguration);
            return model;
        }

        private SourcingViewModel MapMessageToViewModel(SourcingConfigurationMessage message)
        {
            var viewModel = new SourcingViewModel();

            viewModel.Id = message.SourcingConfigurationId;
            viewModel.Title = message.Title;
            viewModel.Description = message.Description;
            viewModel.IsActive = message.IsActive;
            viewModel.StaticCriteriaOperator = message.StaticCriteriaOperator;
            viewModel.DynamicCriteriaOperator = message.DynamicCriteriaOperator;
            viewModel.SourceWorkflow = new KeyValuePair<int, string>(message.SourceWorkflowId, this.configurationSetupService.GetWorkflowDisplaytext(message.SourceWorkflowId));
            viewModel.SourceRequisition = new KeyValuePair<int, string>(message.SourceRequisitionId, this.configurationSetupService.GetRequisitionTitle(message.SourceRequisitionId));
            viewModel.SourceFolder = new KeyValuePair<int, string>(message.SourceFolderId, this.configurationSetupService.GetFolderDisplaytext(message.SourceFolderId));
            viewModel.DestinationWorkflow = new KeyValuePair<int, string>(message.DestinationWorkflowId, this.configurationSetupService.GetWorkflowDisplaytext(message.DestinationWorkflowId));
            viewModel.DestinationFolder = new KeyValuePair<int, string>(message.DestinationFolderId, this.configurationSetupService.GetFolderDisplaytext(message.DestinationFolderId));
            viewModel.FieldDefId = new KeyValuePair<int, string>(message.FieldDefId, this.configurationSetupService.GetRequisitionFieldDisplaytext(message.FieldDefId));

            viewModel.StaticCriteria = new List<StaticCriterionView>();
            foreach (var staticCriterion in message.StaticCriteria)
            {
                var criterion = this.objectMapper.Map<StaticCriterionView>(staticCriterion);
                criterion.Displaytext = this.configurationSetupService.GetCandidateFieldDisplaytext(criterion.SolrFieldName);

                if (criterion.DomainListId > 0)
                {
                    criterion.DomainListValueDisplaytext = this.configurationSetupService.GetDomainListValueDisplaytext(
                        criterion.DomainListId,
                        Convert.ToInt32(criterion.Value));
                }

                if (criterion.StartDate == DateTime.MinValue)
                {
                        criterion.StartDate = null;
                }

                if (criterion.EndDate == DateTime.MinValue)
                {
                    criterion.EndDate = null;
                }

                viewModel.StaticCriteria.Add(criterion);
            }

            viewModel.DynamicCriteria = new List<DynamicCriterionView>();
            foreach (var dynamicCriterion in message.DynamicCriteria)
            {
                var criterion = this.objectMapper.Map<DynamicCriterionView>(dynamicCriterion);
                criterion.CandidateFieldDisplaytext = this.configurationSetupService.GetCandidateFieldDisplaytext(dynamicCriterion.SolrFieldName);
                criterion.RequisitionFieldDisplaytext = this.configurationSetupService.GetRequisitionFieldDisplaytext(dynamicCriterion.RequisitionFieldId);
                viewModel.DynamicCriteria.Add(criterion);
            }

            return viewModel;
        }
    }
}