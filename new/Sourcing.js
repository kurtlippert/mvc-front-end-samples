var RMS = RMS || {};
RMS.UI = RMS.UI || {};
RMS.UI.Administration = RMS.UI.Administration || {};
RMS.UI.Administration.Sourcing = RMS.UI.Administration.Sourcing || {};

RMS.UI.Administration.Sourcing = (function ($, sourcing) {

    sourcing.ListSize = 350;

    sourcing.InitializeWizard = function (modelId) {

        var form = $("#sourcing-wizard");

        function initializeSteps () {

            form.steps({
                headerTag: "h3",
                bodyTag: "section",
                transitionEffect: "slideLeft",
                autoFocus: true,
                labels: {
                    next: RMS.UI.Strings.SOURCING_NEXT_BTN,
                    previous: RMS.UI.Strings.SOURCING_PREV_BTN,
                    finish: RMS.UI.Strings.SOURCING_FINISH_BTN
                },
                onStepChanging: function (event, currentIndex, newIndex) {
                    var wizardKendoValidator;

                    if (currentIndex > newIndex) {
                        return true;
                    }

                    if (currentIndex === 0) {
                        wizardKendoValidator = $("#sourcing-wizard").find("#sourcing-wizard-p-0").kendoValidator({
                            rules: {
                                emptyTitle: function (input) {
                                    if (input.is("input[name=configuration-title]")) {
                                        if (input.val().length === 0 || !input.val().trim()) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                emptyDescription: function (input) {
                                    if (input.is("textarea[name=configuration-description]")) {
                                        if (input.val().length === 0 || !input.val().trim()) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            },
                            messages: {
                                emptyTitle: RMS.UI.Strings.ERR_SOURCING_EMPTY_TITLE,
                                emptyDescription: RMS.UI.Strings.ERR_SOURCING_EMPTY_DESCRIPTION
                            }
                        }).data("kendoValidator");

                        wizardKendoValidator.hideMessages();
                        if (wizardKendoValidator.validate()) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    if (currentIndex === 1) {
                        wizardKendoValidator = $("#sourcing-wizard").find("#sourcing-wizard-p-1").kendoValidator({
                            rules: {
                                invalidWorkflow: function (input) {
                                    if (input.is("input[name=source-workflows]")) {
                                        if (input.val() !== "" && $("input[name=source-workflows]").data("kendoComboBox").selectedIndex === -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                invalidRequisition: function (input) {
                                    if (input.is("input[name=source-requisitions]")) {
                                        if (input.val() !== "" && $("input[name=source-requisitions]").data("kendoComboBox").selectedIndex === -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                invalidFolder: function (input) {
                                    if (input.is("input[name=source-folders]")) {
                                        if (input.val() !== "" && $("input[name=source-folders]").data("kendoComboBox").selectedIndex === -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            },
                            messages: {
                                invalidWorkflow: RMS.UI.Strings.ERR_SOURCING_INVALID_WORKFLOW,
                                invalidRequisition: RMS.UI.Strings.ERR_SOURCING_INVALID_REQ,
                                invalidFolder: RMS.UI.Strings.ERR_SOURCING_INVALID_FOLDER
                            }
                        }).data("kendoValidator");

                        wizardKendoValidator.hideMessages();
                        if (wizardKendoValidator.validate()) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    if (currentIndex === 2) {
                        wizardKendoValidator = $("#sourcing-wizard").find("#sourcing-wizard-p-2").kendoValidator({
                            rules: {
                                invalidWorkflow: function (input) {
                                    if (input.is("input[name=destination-workflows]")) {
                                        if (input.val() !== "" && $("input[name=destination-workflows]").data("kendoComboBox").selectedIndex === -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                invalidFolder: function (input) {
                                    if (input.is("input[name=destination-folders]")) {
                                        if (input.val() !== "" && $("input[name=destination-folders]").data("kendoComboBox").selectedIndex === -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                invalidConfigurationIDField: function (input) {
                                    if (input.is("input[name=field-def-id]")) {
                                        if (input.val() !== "" && $("input[name=field-def-id]").data("kendoComboBox").selectedIndex === -1) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            },
                            messages: {
                                invalidWorkflow: RMS.UI.Strings.ERR_SOURCING_INVALID_WORKFLOW,
                                invalidFolder: RMS.UI.Strings.ERR_SOURCING_INVALID_FOLDER,
                                invalidConfigurationIDField: RMS.UI.Strings.ERR_SOURCING_INVALID_CONFIG_ID
                            }
                        }).data("kendoValidator");

                        wizardKendoValidator.hideMessages();
                        if (wizardKendoValidator.validate()) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    form.validate().settings.ignore = ":hidden";
                    return form.valid();
                },
                onFinished: function (event, currentIndex) {

                    var model = {};
                    var $sourcingWizard = $("form#sourcing-wizard");
                    model.title = $sourcingWizard.find("#configuration-title").val();

                    model.description = $sourcingWizard.find("#configuration-description").val();

                    model.staticCriteriaOperator = $sourcingWizard.find("#static-criteria-operator").val();

                    model.dynamicCriteriaOperator = $sourcingWizard.find("#dynamic-criteria-operator").val();

                    model.isActive = $sourcingWizard.find("#configuration-is-active").val() === "yes" ? true : false;

                    var sourceWorkflow = {};
                    var sourceWorkflowsData = $sourcingWizard.find("#source-workflows").data("kendoComboBox");
                    sourceWorkflow.key = sourceWorkflowsData.value();
                    sourceWorkflow.value = sourceWorkflowsData.text();
                    model.sourceWorkflow = sourceWorkflow;

                    var sourceRequisition = {};
                    var sourceRequisitionsData = $sourcingWizard.find("#source-requisitions").data("kendoComboBox");
                    sourceRequisition.key = sourceRequisitionsData.value();
                    sourceRequisition.value = sourceRequisitionsData.text();
                    model.sourceRequisition = sourceRequisition;

                    var sourceFolder = {};
                    var sourceFoldersData = $sourcingWizard.find("#source-folders").data("kendoComboBox");
                    sourceFolder.key = sourceFoldersData.value();
                    sourceFolder.value = sourceFoldersData.text();
                    model.sourceFolder = sourceFolder;

                    var destinationWorkflow = {};
                    var destinationWorkflowsData = $sourcingWizard.find("#destination-workflows").data("kendoComboBox");
                    destinationWorkflow.key = destinationWorkflowsData.value();
                    destinationWorkflow.value = destinationWorkflowsData.text();
                    model.destinationWorkflow = destinationWorkflow;

                    var destinationFolder = {};
                    var destinationFoldersData = $sourcingWizard.find("#destination-folders").data("kendoComboBox");
                    destinationFolder.key = destinationFoldersData.value();
                    destinationFolder.value = destinationFoldersData.text();
                    model.destinationFolder = destinationFolder;

                    var fieldDefId = {};
                    var fieldDefIdData = $sourcingWizard.find("#field-def-id").data("kendoComboBox");
                    fieldDefId.key = fieldDefIdData.value();
                    fieldDefId.value = fieldDefIdData.text();
                    model.fieldDefId = fieldDefId;

                    var staticCriteriaList = [];
                    var staticCriteriaGridData = $sourcingWizard.find("#static-criteria-grid").data("kendoGrid").dataSource.data();
                    $.each(staticCriteriaGridData, function (i, item) {
                        var staticCriteria = {
                            Displaytext: item.Displaytext,
                            SolrFieldName: item.SolrFieldName,
                            Operator: (typeof item.Operator === "object") ? item.Operator.value : item.Operator,
                            Value: item.Value,
                            StartDate: item.StartDate,
                            EndDate: item.EndDate,
                            SearchDataTypeId: item.SearchDataTypeId,
                            DomainListId: item.DomainListId,
                            DomainListValueDisplaytext: item.DomainListValueDisplaytext
                        };
                        staticCriteriaList.push(staticCriteria);
                    });
                    model.staticCriteria = staticCriteriaList;

                    var dynamicCriteriaList = [];
                    var dynamicCriteriaGridData = $sourcingWizard.find("#dynamic-criteria-grid").data("kendoGrid").dataSource.data();
                    $.each(dynamicCriteriaGridData, function (i, item) {
                        var dynamicCriteria = {
                            CandidateFieldDisplaytext: item.CandidateFieldDisplaytext,
                            RequisitionFieldDisplaytext: item.RequisitionFieldDisplaytext,
                            SolrFieldName: item.SolrFieldName,
                            SearchDataTypeId: item.SearchDataTypeId,
                            Operator: (typeof item.Operator === "object") ? item.Operator.value : item.Operator,
                            RequisitionFieldId: item.RequisitionFieldId
                        };
                        dynamicCriteriaList.push(dynamicCriteria);
                    });
                    model.dynamicCriteria = dynamicCriteriaList;

                    var passedData = {};
                    passedData.model = JSON.stringify(model);

                    $.ajax({
                        type: 'POST',
                        url: (modelId !== null) ? RP.Settings.SourcingUpdateConfiguration + "/" + modelId : RP.Settings.SourcingAddConfiguration,
                        cache: false,
                        dataType: 'json',
                        data: passedData,
                        success: function () {
                            RMS.UI.Dialog.CommonEvents.CloseTargetDialog($("#sourcing-wizard"));
                        }
                    });
                }
            });
        }

        function initializeGlobalCriteria () {

            // Global criteria areas
            var $textValueArea = form.find("div#text-area").hide();
            var $domainListValueArea = form.find("div#domain-list-area").hide();
            var $operatorAreaText = form.find("div#operator-area-text").hide();
            var $operatorAreaDates = form.find("div#operator-area-dates").hide();
            var $startDateArea = form.find("div#start-date-area").hide();
            var $endDateArea = form.find("div#end-date-area").hide();

            // Global criteria inputs
            var $operatorForDates = $operatorAreaDates.find("input#operatorForDates");
            var $operatorForText = $operatorAreaText.find("input#operatorForText");
            var $startDate = $startDateArea.find("input#start-date");
            var $endDate = $endDateArea.find("input#end-date");
            var $textValue = $textValueArea.find("input#value");
            var $domainListValue = $domainListValueArea.find("input#domain-list-values");

            var $criteriaGrid = form.find("#static-criteria-grid").hide();

            // On global criterion add
            form.find("#btn-static-add").click(function () {
                var wizardKendoValidator = $("#sourcing-wizard").find("#sourcing-wizard-p-3").kendoValidator({
                    rules: {
                        invalidCandidateField: function (input) {
                            if (input.is("input[name=searchable-candidate-fields-static]")) {
                                if (input.val() !== "" && $("input[name=searchable-candidate-fields-static]").data("kendoComboBox").selectedIndex === -1) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        emptyCandidateField: function (input) {
                            if (input.is("input[name=searchable-candidate-fields-static]")) {
                                if (input.val() === "") {
                                    return false;
                                }
                            }
                            return true;
                        },
                        invalidCandidateFieldValue: function (input) {
                            if (input.is("input[name=domain-list-values_input]")) {
                                if (input.val() !== "" && $("#domain-list-values").data("kendoComboBox").selectedIndex === -1) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        emptyCandidateFieldValue: function (input) {
                            if ($("#sourcing-wizard").find("#sourcing-wizard-p-3").find("input[name=domain-list-values_input]").is(":visible")) {
                                if (input.is("input[name=domain-list-values_input]")) {
                                    if (input.val() === "") {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        },
                        invalidStartDate: function (input) {
                            if (input.is("input[name=start-date]")) {
                                if (input.val() !== "" && !kendo.parseDate(input.val())) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        emptyStartDate: function (input) {
                            if ($("#sourcing-wizard").find("#sourcing-wizard-p-3").find("#start-date").is(":visible")) {
                                if (input.is("input[name=start-date]")) {
                                    if (input.val() === "") {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        },
                        invalidEndDate: function (input) {
                            if (input.is("input[name=end-date]")) {
                                if (input.val() !== "" && !kendo.parseDate(input.val())) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        emptyEndDate: function (input) {
                            if ($("#sourcing-wizard").find("#sourcing-wizard-p-3").find("#end-date").is(":visible")) {
                                if (input.is("input[name=end-date]")) {
                                    if (input.val() === "") {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        }
                    },
                    messages: {
                        invalidCandidateField: RMS.UI.Strings.ERR_SOURCING_INVALID_CANDIDATE,
                        emptyCandidateField: RMS.UI.Strings.ERR_SOURCING_EMPTY_CANDIDATE,
                        invalidCandidateFieldValue: RMS.UI.Strings.ERR_SOURCING_INVALID_CANDIDATE_VALUE,
                        emptyCandidateFieldValue: RMS.UI.Strings.ERR_SOURCING_EMPTY_CANDIDATE_VALUE,
                        invalidStartDate: RMS.UI.Strings.ERR_SOURCING_INVALID_START_DATE,
                        emptyStartDate: RMS.UI.Strings.ERR_SOURCING_EMPTY_START_DATE,
                        invalidEndDate: RMS.UI.Strings.ERR_SOURCING_INVALID_END_DATE,
                        emptyEndDate: RMS.UI.Strings.ERR_SOURCING_EMPTY_END_DATE
                    }
                }).data("kendoValidator");

                wizardKendoValidator.hideMessages();
                if (wizardKendoValidator.validate()) {
                    $criteriaGrid.show();

                    var operator = { text: "", value: ""};
                    if ($operatorAreaText.is(":visible")) {
                        operator.text = $operatorForText.data("kendoDropDownList").text();
                        operator.value = $operatorForText.data("kendoDropDownList").value();
                    }
                    else if ($operatorAreaDates.is(":visible")) {
                        operator.text = $operatorForDates.data("kendoDropDownList").text();
                        operator.value = $operatorForDates.data("kendoDropDownList").value();
                    }

                    var staticCriteriaValue = null;
                    var staticCriteriaValueDisplaytext = null;
                    var staticCriteriaDateStart = null;
                    var staticCriteriaDateEnd = null;
                    if ($startDateArea.is(":visible") && $endDateArea.is(":visible") && operator.text === "Between") {
                        staticCriteriaDateStart = $startDate.val();
                        staticCriteriaDateEnd = $endDate.val();
                    }
                    else if ($startDateArea.is(":visible") && operator.text !== "Between") {
                        staticCriteriaDateStart = $startDate.val();
                    }
                    else if ($domainListValueArea.is(":visible")) {
                        var domainListData = $domainListValue.data("kendoComboBox");
                        staticCriteriaValue = domainListData.value();
                        staticCriteriaValueDisplaytext = domainListData.text();
                    }
                    else if ($textValueArea.is(":visible")) {
                        staticCriteriaValue = $textValue.val();
                    }

                    var criteriaGridData = $criteriaGrid.data("kendoGrid");
                    var solrFieldData = form.find("#searchable-candidate-fields-static").data("kendoComboBox");
                    criteriaGridData.dataSource.add(
                    {
                        Displaytext: solrFieldData.input.val(),
                        Operator: operator,
                        Value: staticCriteriaValue,
                        StartDate: staticCriteriaDateStart,
                        EndDate: staticCriteriaDateEnd,
                        SolrFieldName: (solrFieldData.dataItem()) ? solrFieldData.dataItem().SolrFieldName : null,
                        SearchDataTypeId: (solrFieldData.dataItem()) ? solrFieldData.dataItem().SearchDataTypeId : null,
                        DomainListId: (solrFieldData.dataItem()) ? solrFieldData.dataItem().DomainListId : null,
                        DomainListValueDisplaytext: staticCriteriaValueDisplaytext
                    });
                }
            });

            // On global criterion remove
            form.find("#btn-static-rm").click(function () {
                $criteriaGrid.hide();
                var criteriaGridData = $criteriaGrid.data("kendoGrid");
                criteriaGridData.dataSource.data([]);
            });
        }

        function initializeSpecificCriteria () {

            var $criteriaGrid = form.find("#dynamic-criteria-grid").hide();

            // On global criterion add
            form.find("#btn-dynamic-add").click(function () {
                var wizardKendoValidator = $("#sourcing-wizard").find("#sourcing-wizard-p-4").kendoValidator({
                    rules: {
                        invalidCandidateField: function (input) {
                            if (input.is("input[name=searchable-candidate-fields-dynamic_input]")) {
                                if (input.val() !== "" && $("#searchable-candidate-fields-dynamic").data("kendoComboBox").selectedIndex === -1) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        emptyCandidateField: function (input) {
                            if (input.is("input[name=searchable-candidate-fields-dynamic_input]")) {
                                if (input.val() === "") {
                                    return false;
                                }
                            }
                            return true;
                        },
                        invalidRequisitionField: function (input) {
                            if (input.is("input[name=searchable-requisition-fields-dynamic_input]")) {
                                if (input.val() !== "" && $("#searchable-requisition-fields-dynamic").data("kendoComboBox").selectedIndex === -1) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        emptyRequisitionField: function (input) {
                            if (input.is("input[name=searchable-requisition-fields-dynamic_input]")) {
                                if (input.val() === "") {
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    messages: {
                        invalidCandidateField:RMS.UI.Strings.ERR_SOURCING_INVALID_CANDIDATE,
                        emptyCandidateField: RMS.UI.Strings.ERR_SOURCING_EMPTY_CANDIDATE,
                        invalidRequisitionField: RMS.UI.Strings.ERR_SOURCING_INVALID_REQ_FIELD,
                        emptyRequisitionField: RMS.UI.Strings.ERR_SOURCING_EMPTY_REQ_FIELD
                    }
                }).data("kendoValidator");

                wizardKendoValidator.hideMessages();
                if (wizardKendoValidator.validate()) {
                    $criteriaGrid.show();

                    var $operatorAreaText = form.find("div#specific-operator-area-text");
                    var $operatorForText = $operatorAreaText.find("input#specificOperatorForText");

                    var operator = { text: "", value: "" };
                    operator.text = $operatorForText.data("kendoDropDownList").text();
                    operator.value = $operatorForText.data("kendoDropDownList").value();
                    console.log(operator);

                    var candidateData = form.find("#searchable-candidate-fields-dynamic").data("kendoComboBox");
                    var requisitionData = form.find("#searchable-requisition-fields-dynamic").data("kendoComboBox");

                    var candidateDisplayText = (candidateData.text() === "") ? "-" : candidateData.text();
                    var requisitionDisplayText = (requisitionData.text() === "") ? "-" : requisitionData.text();
                    var requisitionFieldId = (requisitionData.dataItem()) ? requisitionData.dataItem().FieldDefId : null;
                    var solrFieldName = (candidateData.dataItem()) ? candidateData.dataItem().SolrFieldName : null;
                    var searchDataTypeId = (candidateData.dataItem()) ? candidateData.dataItem().SearchDataTypeId : null;

                    var criteriaGridData = $criteriaGrid.data("kendoGrid");
                    criteriaGridData.dataSource.add(
                    {
                        CandidateFieldDisplaytext: candidateDisplayText,
                        RequisitionFieldDisplaytext: requisitionDisplayText,
                        SolrFieldName: solrFieldName,
                        SearchDataTypeId: searchDataTypeId,
                        Operator: operator,
                        RequisitionFieldId: requisitionFieldId
                    });
                }
            });

            // On global criterion remove
            form.find("#btn-dynamic-rm").click(function () {
                $criteriaGrid.hide();
                var criteriaGridData = $criteriaGrid.data("kendoGrid");
                criteriaGridData.dataSource.data([]);
            });
        }

        initializeSteps();
        initializeGlobalCriteria();
        initializeSpecificCriteria();

    };

    sourcing.ResizeList = function (e, size) {

        e.sender.list.width(size);
    }

    sourcing.DisplayDateRange = function (isBetween) {

        var $sourcingWizard = $("form#sourcing-wizard");
        var $staticCriteriaDateStart = $sourcingWizard.find("div#start-date-area");
        var $staticCriteriaDateEnd = $sourcingWizard.find("div#end-date-area");

        $staticCriteriaDateEnd.hide();
        if (isBetween) {
            $staticCriteriaDateStart.show();
            $staticCriteriaDateEnd.show();
        }
        else {
            $staticCriteriaDateStart.find("#start-date").data("kendoDatePicker").max(new Date(2099, 12, 31));
            $staticCriteriaDateStart.show();
        }
    }

    sourcing.DeleteGridRow = function (element) {

        var row = $(element).closest("tr");
        var $gridElement = row.parent().parent().parent();
        var gridData = $gridElement.data("kendoGrid");
        gridData.removeRow(row);

        if (gridData.dataSource.total() < 1) {
            $gridElement.hide();
        }
    }

    sourcing.SourceWorkflows = new function () {

        this.InEditMode = new function () {

            this.Change = function (e) {

                var sourceRequisitions = $("#sourcing-wizard").find("#source-requisitions").data("kendoComboBox");
                var sourceFolders = $("#sourcing-wizard").find("#source-folders").data("kendoComboBox");

                // Every time there's a change, we know we want to clear it's child controls
                sourceRequisitions.input.val("");
                sourceFolders.input.val("");

                // Only add cascading if there is a data item selected on the parent
                if (e.sender.dataItem()) {
                    // Add cascading for requisitions
                    var sourceRequisitionsData = new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: RP.Settings.SourcingGetRequisitions,
                                data: {
                                    workflowId: e.sender.dataItem().Key
                                }
                            },
                            parameterMap: function(data) {
                                data.requisitionFilter = sourceRequisitions.input.val();
                                return data;
                            }
                        }
                    });

                    // Add cascading for folders
                    var sourceFoldersData = new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: RP.Settings.SourcingGetSourceFoldersForWorkflow,
                                data: {
                                    workflowId: e.sender.dataItem().Key
                                }
                            },
                            parameterMap: function(data) {
                                data.folderFilter = sourceFolders.input.val();
                                return data;
                            }
                        }
                    });

                    // Update the data source
                    sourceRequisitions.setDataSource(sourceRequisitionsData);
                    sourceFolders.setDataSource(sourceFoldersData);
                    sourceRequisitions.enable(true);
                    sourceFolders.enable(true);
                } else {
                    sourceRequisitions.enable(false);
                    sourceFolders.enable(false);
                }
            }
        }
    }

    sourcing.DestinationWorkflows = new function () {

        this.InEditMode = new function () {

            this.Change = function (e) {

                var sourceFolders = $("#sourcing-wizard").find("#destination-folders").data("kendoComboBox");

                // Every time there's a change, we know we want to clear it's child controls
                sourceFolders.input.val("");

                // Only add cascading if there is a data item selected on the parent
                if (e.sender.dataItem()) {
                    // Cascading for destination folders
                    var sourceFoldersData = new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: RP.Settings.SourcingGetDestinationFoldersForWorkflow,
                                data: {
                                    workflowId: e.sender.dataItem().Key
                                }
                            },
                            parameterMap: function(data) {
                                data.folderFilter = sourceFolders.input.val();
                                return data;
                            }
                        }
                    });

                    // Update the data source
                    sourceFolders.setDataSource(sourceFoldersData);
                    sourceFolders.enable(true);
                } else {
                    sourceFolders.enable(false);
                }
            }
        }
    }

    sourcing.GlobalCandidateFields = new function () {

        this.Change = function (e) {

            var searchDataTypeId;
            if (e.sender.dataItem()) {
                searchDataTypeId = e.sender.dataItem().SearchDataTypeId;
            } else {
                // No need to run through the remaining logic if there's no data
                return;
            }

            // Don't want any areas showing we don't want to show
            var $sourcingWizard = $("form#sourcing-wizard");
            var $staticCriteriaTextArea = $sourcingWizard.find("div#text-area").hide();
            var $staticCriteriaDomainListArea = $sourcingWizard.find("div#domain-list-area").hide();
            var $staticCriteriaOperatorAreaForText = $sourcingWizard.find("div#operator-area-text").hide();
            var $staticCriteriaOperatorAreaForDates = $sourcingWizard.find("div#operator-area-dates").hide();
            var $startDateArea = $sourcingWizard.find("div#start-date-area").hide();
            var $endDateArea = $sourcingWizard.find("div#end-date-area").hide();
            var $operatorForText = $staticCriteriaOperatorAreaForText.find("input#operatorForText");

            // Need to know when to use a combobox(!=1 and domainListId != 0) / textbox(!=1 and domainListId = 0) vs. data-picker(1)
            if (searchDataTypeId !== 1) {
                $operatorForText.data("kendoDropDownList").select(0);
                $staticCriteriaOperatorAreaForText.show();
                var domainListId = e.sender.dataItem().DomainListId;
                if (domainListId !== 0) {
                    var domainListValues = $staticCriteriaDomainListArea.find("#domain-list-values").data("kendoComboBox");

                    // For filtering purposes, we'd want to clear the combo-box
                    domainListValues.input.val("");

                    var domainListData = new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: RP.Settings.SourcingGetDomainListValues,
                                data: {
                                    domainListId: domainListId
                                }
                            },
                            parameterMap: function(data) {
                                data.domainListFilter = domainListValues.input.val();
                                return data;
                            }
                        }
                    });

                    domainListValues.enable(true);
                    domainListValues.setDataSource(domainListData);
                    $staticCriteriaDomainListArea.show();
                } else {
                    $staticCriteriaTextArea.find("input#value").val("");
                    $staticCriteriaTextArea.show();
                }
            } else {
                // Want to reset the date areas
                $staticCriteriaOperatorAreaForDates.find("#operatorForDates").data("kendoDropDownList").select(0);
                $staticCriteriaOperatorAreaForDates.show();
                $endDateArea.hide();
                $startDateArea.find("#start-date").val("");
                $endDateArea.find("#end-date").val("");

                sourcing.DisplayDateRange($staticCriteriaOperatorAreaForDates.find("#operatorForDates").val() === "between");
            }
        }

        this.FirstDataBound = function (e) {

            sourcing.ResizeList(e, sourcing.ListSize);
        }
    }

    sourcing.GlobalCriteriaOperator = new function () {

        this.Change = function (e) {

            sourcing.DisplayDateRange(e.sender.dataItem().Value === "between");
        }
    }

    sourcing.GlobalCriteriaStartDate = new function () {

        this.Change = function () {

            var $sourcingWizard = $("form#sourcing-wizard");
            var endPicker = $sourcingWizard.find("#end-date-area").find("#end-date").data("kendoDatePicker"),
                startDate = this.value();

            if (startDate) {
                startDate = new Date(startDate);
                startDate.setDate(startDate.getDate() + 1);
                endPicker.min(startDate);
            }
        }
    }

    sourcing.GlobalCriteriaEndDate = new function () {

        this.Change = function () {

            var $sourcingWizard = $("form#sourcing-wizard");
            var startPicker = $sourcingWizard.find("#start-date-area").find("#start-date").data("kendoDatePicker"),
                endDate = this.value();

            if (endDate) {
                endDate = new Date(endDate);
                endDate.setDate(endDate.getDate() - 1);
                startPicker.max(endDate);
            }
        }
    }

    sourcing.SpecificCandidateFields = new function () {

        this.FirstDataBound = function (e) {

            sourcing.ResizeList(e, sourcing.ListSize);
        }
    }

    sourcing.SpecificRequisitionFields = new function () {

        this.FirstDataBound = function (e) {

            sourcing.ResizeList(e, sourcing.ListSize);
        }
    }

    sourcing.GlobalCriteriaGrid = new function () {

        this.InEditMode = new function () {

            this.FirstDataBound = function (e) {

                if (e.sender.element.data("kendoGrid").dataSource.total() > 0) {
                    e.sender.element.show();
                }
            }
        }
    }

    sourcing.SpecificCriteriaGrid = new function () {

        this.InEditMode = new function () {

            this.FirstDataBound = function (e) {

                if (e.sender.element.data("kendoGrid").dataSource.total() > 0) {
                    e.sender.element.show();
                }
            }
        }
    }

    return sourcing;
})(jQuery, RMS.UI.Administration.Sourcing || {})