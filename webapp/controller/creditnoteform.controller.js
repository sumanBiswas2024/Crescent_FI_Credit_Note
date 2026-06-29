sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, MessageBox, Filter, FilterOperator, Fragment) {
    "use strict";

    return Controller.extend("com.crescent.app.creditnoteformfico.controller.debitnoteform", {
        onInit: function () {
            this._busyDialog = new sap.m.BusyDialog();
            // Store references to input controls
            this._oDocumentNoInput = this.getView().byId("idDeliveryDocumentInput");
            this._oFiscalYearInput = this.getView().byId("idFiscalYearInput");

            if (!this._oDocumentNoInput) {
                console.error("Delivery Document Input control not found during initialization!");
            }
            if (!this._oFiscalYearInput) {
                console.error("Fiscal Year Input control not found during initialization!");
            }

            const oPdfContainer = this.byId("pdfIframeContainer");
            if (oPdfContainer) {
                oPdfContainer.setContent(this._getNoDataHtml());
            } else {
                console.error("pdfIframeContainer control not found during initialization!");
            }
        },
        _validateInputs: function () {
            const oDocumentNoInput = this._oDocumentNoInput;
            const oFiscalYearInput = this._oFiscalYearInput;
            let bValid = true;

            // Validate Fiscal Year
            if (!oFiscalYearInput.getValue().trim()) {
                oFiscalYearInput.setValueState("Error");
                // oFiscalYearInput.setValueStateText("Fiscal Year is required");
                bValid = false;
            } else {
                oFiscalYearInput.setValueState("None");
                // oFiscalYearInput.setValueStateText(" ");
            }

            // Validate Delivery Document
            if (!oDocumentNoInput.getValue().trim()) {
                oDocumentNoInput.setValueState("Error");
                // oDocumentNoInput.setValueStateText("Delivery Document is required");
                bValid = false;
            } else {
                oDocumentNoInput.setValueState("None");
                // oDocumentNoInput.setValueStateText(" ");
            }

            if (!bValid) {
                MessageBox.show("Please fill in all required fields");
            }

            return bValid;
        },
        onOpenFiscalYearDialog: function (oEvent) {
            var oFiscalYearInput = this._oFiscalYearInput;
            if (oFiscalYearInput && oFiscalYearInput.getValue() === "" && oEvent.getParameter("value") === "") {
                return;
            }

            this.idFiscalYearInput = oEvent.getSource().getId();
            if (!this.oOpenDialogFiscalYear) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.crescent.app.creditnoteformfico.view.fragments.DialogFiscalYear",
                    controller: this
                }).then(oDialog => {
                    this.oOpenDialogFiscalYear = oDialog;
                    this.getView().addDependent(oDialog);
                    this.oOpenDialogFiscalYear.open();
                }).catch(error => {
                    console.error("Fiscal Year Dialog load failed:", error);
                    MessageBox.error(`Failed to load Fiscal Year dialog: ${error.message}`);
                });
            } else {
                this.oOpenDialogFiscalYear.open();
            }
        },

        onOpenDeliveryDocumentDialog: function (oEvent) {
            var oDocumentNoInput = this._oDocumentNoInput;
            if (oDocumentNoInput && oDocumentNoInput.getValue() === "" && oEvent.getParameter("value") === "") {
                return;
            }

            const sViewId = this.getView().getId();
            console.log("Opening Document No dialog with view ID:", sViewId);

            this.idDeliveryDocumentInput = oEvent.getSource().getId();
            if (!this.oOpenDialogDocumentNo) {
                Fragment.load({
                    id: sViewId,
                    name: "com.crescent.app.creditnoteformfico.view.fragments.DialogDocumentNo",
                    controller: this
                }).then(oDialog => {
                    console.log("Document No Dialog loaded:", oDialog);
                    this.oOpenDialogDocumentNo = oDialog;
                    this.getView().addDependent(oDialog);
                    // Fetch data and wait before opening
                    this.onFetchDocOData().then(() => {
                        this.oOpenDialogDocumentNo.open();
                        console.log("Dialog opened, list ID:", Fragment.byId(sViewId, "idDocumentNoList"));
                    }).catch(error => {
                        MessageBox.error(`Failed to fetch document data: ${error.message}`);
                    });
                }).catch(error => {
                    console.error("Document No Dialog load failed:", error);
                    MessageBox.error(`Failed to load Document No dialog: ${error.message}`);
                });
            } else {
                // Fetch data and wait before re-opening
                this.onFetchDocOData().then(() => {
                    this.oOpenDialogDocumentNo.open();
                    console.log("Dialog re-opened, list ID:", Fragment.byId(sViewId, "idDocumentNoList"));
                }).catch(error => {
                    MessageBox.error(`Failed to fetch document data: ${error.message}`);
                });
            }
        },

        _handleFiscalYearConfirm: function (oEvent) {
            var oDocumentNoInput = this._oDocumentNoInput;
            var oFiscalYearInput = this._oFiscalYearInput;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sSelectedYear = oSelectedItem ? oSelectedItem.getTitle() : null;

            if (!oDocumentNoInput) {
                console.error("Delivery Document Input control not found!");
                return;
            }

            if (sSelectedYear && oFiscalYearInput) {
                oFiscalYearInput.setValue(sSelectedYear);
                oFiscalYearInput.setValueState("None");
                oDocumentNoInput.setEnabled(true);

                var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
                if (oGlobalDataModel) {
                    oGlobalDataModel.setProperty("/FiscalYear", sSelectedYear);
                }

                this.onFetchDocOData();
            }

            oEvent.getSource().getItems().forEach(function (oItem) {
                oItem.setVisible(true);
            });
        },

        onSearchDocumentNo: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue") || "";
            const sViewId = this.getView().getId();
            console.log("onSearchDocumentNo triggered with query:", sQuery, "View ID:", sViewId);

            // Guard: Ensure dialog is open
            if (!this.oOpenDialogDocumentNo || !this.oOpenDialogDocumentNo.isOpen()) {
                console.warn("Document No dialog not open, ignoring search.");
                return;
            }

            const oList = Fragment.byId(sViewId, "idDocumentNoList");
            console.log("List control:", oList, "Expected ID:", sViewId + "--idDocumentNoList");

            if (!oList) {
                console.error("List control 'idDocumentNoList' not found for view ID:", sViewId);
                MessageBox.error("Document list not found. Please ensure the dialog is loaded.");
                return;
            }

            const oBinding = oList.getBinding("items");

            if (!oBinding) {
                console.error("Items binding not found for idDocumentNoList. Binding info:", oList.getBindingInfo("items"));
                MessageBox.error("List binding not initialized. Please ensure data is loaded.");
                return;
            }

            if (sQuery) {
                const oFilter = new Filter({
                    path: "ReferenceDocument",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },

        onSelectionChangeDocumentNo: function (oEvent) {
            const oList = oEvent.getSource();
            const oGlobalModel = this.getOwnerComponent().getModel("globalData");
            const aSelectedDocumentNos = [];

            const aSelectedItems = oList.getSelectedItems();
            aSelectedItems.forEach(oItem => {
                const oContext = oItem.getBindingContext("documentNoData");
                const sDocumentNo = oContext.getProperty("ReferenceDocument");
                aSelectedDocumentNos.push(sDocumentNo);
            });

            oGlobalModel.setProperty("/selectedDocumentNos", aSelectedDocumentNos);
            oGlobalModel.setProperty("/selectedDocumentNosDisplay", aSelectedDocumentNos.join(", "));
        },

        onConfirmDocumentNo: function () {
            const oGlobalModel = this.getOwnerComponent().getModel("globalData");
            const aSelectedDocumentNos = oGlobalModel.getProperty("/selectedDocumentNos") || [];
            const sSelectedDocumentNosDisplay = oGlobalModel.getProperty("/selectedDocumentNosDisplay") || "";

            console.log("Confirmed Document Numbers:", aSelectedDocumentNos);
            console.log("Display Text:", sSelectedDocumentNosDisplay);

            oGlobalModel.refresh(true);
            this._resetDocumentNoDialog();
            this.oOpenDialogDocumentNo.close();

            // Trigger onFetchOData for selected document numbers
            // this.onFetchOData();
        },

        onCloseDocumentNo: function () {
            const oGlobalModel = this.getOwnerComponent().getModel("globalData");

            oGlobalModel.setProperty("/selectedDocumentNos", []);
            oGlobalModel.setProperty("/selectedDocumentNosDisplay", "");

            this._resetDocumentNoDialog();
            this.oOpenDialogDocumentNo.close();
        },

        _resetDocumentNoDialog: function () {
            const sViewId = this.getView().getId();
            const oList = Fragment.byId(sViewId, "idDocumentNoList");
            const oSearchField = Fragment.byId(sViewId, "idDocumentNoSearchField");

            if (oSearchField) {
                oSearchField.setValue("");
                this.onSearchDocumentNo({ getParameter: () => "" });
            }

            if (oList) {
                oList.getItems().forEach(oItem => oItem.setSelected(false));
            }
        },

        _handleFiscalYearCancel: function (oEvent) {
            var oDocumentNoInput = this._oDocumentNoInput;
            var oFiscalYearInput = this._oFiscalYearInput;

            if (!oDocumentNoInput) {
                console.error("Delivery Document Input control not found!");
                return;
            }

            if (oFiscalYearInput) {
                oFiscalYearInput.setValue("");
                oFiscalYearInput.setValueState("None");
                oDocumentNoInput.setEnabled(false);
            }

            oEvent.getSource().getItems().forEach(function (oItem) {
                oItem.setVisible(true);
            });
        },

        onFiscalYearClear: function (oEvent) {
            var oDocumentNoInput = this._oDocumentNoInput;
            var oFiscalYearInput = this._oFiscalYearInput;

            if (oFiscalYearInput && oFiscalYearInput.getValue() === "") {
                oDocumentNoInput.setEnabled(false);
            }
        },

        onFetchDocOData: function () {
            return new Promise((resolve, reject) => {
                const oDocModel = this.getOwnerComponent().getModel("docService");
                const oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
                const oDocumentNoDataModel = this.getOwnerComponent().getModel("documentNoData");

                if (!oDocModel || !oGlobalDataModel || !oDocumentNoDataModel) {
                    MessageBox.error("docService, globalData, or documentNoData model initialization failed.");
                    return reject(new Error("Model initialization failed."));
                }

                const sFiscalYear = oGlobalDataModel.getProperty("/FiscalYear") || "2024";
                const sEntityPath = `/docHelpSet(FiscalYear='${sFiscalYear}')/Set`;

                this._busyDialog.open();

                const aAllData = [];
                let iStart = 0;
                const iPageSize = 100; // matches backend paging

                const fetchPage = () => {
                    return oDocModel.bindList(sEntityPath, null, [], [], {
                        $$operationMode: sap.ui.model.odata.OperationMode.Server
                    }).requestContexts(iStart, iPageSize)
                        .then(aContexts => {
                            if (aContexts.length === 0) {
                                return false; // no more data
                            }

                            aAllData.push(...aContexts.map(ctx => ctx.getObject()));
                            iStart += iPageSize;
                            return true; // keep fetching
                        });
                };

                const fetchAll = () => {
                    return fetchPage().then(hasMore => {
                        if (hasMore) {
                            return fetchAll();
                        }
                    });
                };

                fetchAll()
                    .then(() => {
                        if (!aAllData.length) {
                            MessageBox.warning("No data found for the specified Fiscal Year.");
                            return resolve();
                        }
                        oDocumentNoDataModel.setData({ value: aAllData });
                        console.log("Fetched Document No data:", aAllData);
                        resolve();
                    })
                    .catch(error => {
                        MessageBox.error(`Error fetching document data: ${error.message}`);
                        console.error("OData fetch error:", error);
                        reject(error);
                    })
                    .finally(() => {
                        this._busyDialog.close();
                    });
            });
        },

        onFetchOData: function () {

            // Validate inputs before proceeding
            if (!this._validateInputs()) {
                return;
            }

            const oModel = this.getOwnerComponent().getModel();
            const oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
            const oCreditNoteDataModel = this.getOwnerComponent().getModel("creditNoteData");
            const oPdfContainer = this.byId("pdfIframeContainer");

            if (!oModel || !oModel.bindList || !oGlobalDataModel || !oCreditNoteDataModel || !oPdfContainer) {
                MessageBox.error("OData model, globalData model, creditNoteData model, or pdfIframeContainer initialization failed.");
                return;
            }

            const sFiscalYear = oGlobalDataModel.getProperty("/FiscalYear") || "2024";
            const aDocumentNos = oGlobalDataModel.getProperty("/selectedDocumentNos") || ["5105600176"];

            if (!aDocumentNos.length) {
                oPdfContainer.setContent(this._getNoDataHtml());
                MessageBox.error("No document numbers selected.");
                return;
            }

            const sEntityPath = "/ZFI_CREDIT_NOTE";
            const sDocumentNoFilter = aDocumentNos.map(sDocNo => `Document_No eq '${sDocNo}'`).join(" or ");
            const sFilter = `CompanyCode eq '1000' and FiscalYear eq '${sFiscalYear}' and (${sDocumentNoFilter})`;
            const sUrlParameters = {
                "$count": "true",
                "$filter": sFilter
            };

            this._busyDialog.open();

            const aAllData = [];
            let iStart = 0;
            const iPageSize = 100; // backend default page size

            const fetchPage = () => {
                return oModel.bindList(sEntityPath, null, [], [], sUrlParameters)
                    .requestContexts(iStart, iPageSize)
                    .then(aContexts => {
                        if (aContexts.length === 0) {
                            return false; // no more pages
                        }
                        aAllData.push(...aContexts.map(ctx => ctx.getObject()));
                        iStart += iPageSize;
                        return true; // continue fetching
                    });
            };

            const fetchAll = () => {
                return fetchPage().then(hasMore => {
                    if (hasMore) {
                        return fetchAll();
                    }
                });
            };

            fetchAll()
                .then(() => {
                    if (!aAllData.length) {
                        oPdfContainer.setContent(this._getNoDataHtml());
                        MessageBox.warning("No data returned from OData service.");
                        return;
                    }

                    oCreditNoteDataModel.setData({ value: aAllData });
                    console.log("Fetched debitSet data:", aAllData);

                    return this._loadImageAsBase64("com/crescent/app/creditnoteformfico/images/Crescent_logo_new.png")
                        .catch(error => {
                            console.warn(`Logo loading failed: ${error.message}. Using placeholder.`);
                            return null;
                        })
                        .then(base64Image => this._generatePdfFromData(base64Image, oCreditNoteDataModel.getData()));
                })
                .catch(error => {
                    oPdfContainer.setContent(this._getNoDataHtml());
                    MessageBox.error(`Error fetching data: ${error.message}`);
                    console.error("OData fetch error:", error);
                })
                .finally(() => {
                    this._busyDialog.close();
                });
        },

        _loadImageAsBase64: function (imagePath) {
            return new Promise((resolve, reject) => {
                const imageUrl = sap.ui.require.toUrl(imagePath);
                const xhr = new XMLHttpRequest();

                xhr.onload = () => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("Failed to convert image to base64"));
                    reader.readAsDataURL(xhr.response);
                };
                xhr.onerror = () => reject(new Error("Failed to load image"));
                xhr.open('GET', imageUrl);
                xhr.responseType = 'blob';
                xhr.send();
            });
        },

        _formatDate: function (dateStr) {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            if (isNaN(date)) return 'N/A';

            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
        },

        _formatNumber: function (value, decimals) {
            const num = parseFloat(value);
            if (isNaN(num)) return (decimals === 3 ? '0.000' : '0.00');
            return num.toFixed(decimals);
        },

        _findFirstValidRecord: function (records) {
            if (!Array.isArray(records) || records.length === 0) return {};

            const mergedRecord = {};
            // Loop through all properties from all objects
            records.forEach(record => {
                if (record && typeof record === "object") {
                    Object.keys(record).forEach(key => {
                        // Only set if not already set and value is valid
                        if (
                            mergedRecord[key] == null || mergedRecord[key] === "" ||
                            mergedRecord[key] === undefined
                        ) {
                            if (record[key] != null && record[key] !== "") {
                                mergedRecord[key] = record[key];
                            }
                        }
                    });
                }
            });

            return mergedRecord;
        },

        _generatePdfFromData: function (base64Image, data) {
            var oPdfContainer = this.byId("pdfIframeContainer");
            if (!oPdfContainer) {
                console.error("pdfIframeContainer control not found!");
                MessageBox.error("PDF container not found. Please check the view configuration.");
                return;
            }

            if (typeof pdfMake === "undefined") {
                oPdfContainer.setContent(this._getNoDataHtml());
                MessageBox.error("PDF library not loaded. Please refresh the page.");
                return;
            }

            if (!data?.value?.length) {
                oPdfContainer.setContent(this._getNoDataHtml());
                MessageBox.error("Invalid or missing OData. Please try again.");
                return;
            }

            // ✅ Get the first non-empty record
            var firstRecord = this._findFirstValidRecord(data.value) || {};

            var borderLayout = {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
                paddingLeft: () => 4,
                paddingRight: () => 4,
                paddingTop: () => 4,
                paddingBottom: () => 4
            };
            var headerLayout = {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
                paddingLeft: () => 12,
                paddingRight: () => 12,
                paddingTop: () => 12,
                paddingBottom: () => 12
            };
            var noBordersNoPadding = {
                hLineWidth: () => 0,
                vLineWidth: () => 0,
                paddingLeft: () => 0,
                paddingRight: () => 0,
                paddingTop: () => 0,
                paddingBottom: () => 0
            };

            var items = data.value.map(item => ({
                materialCode: item.Material_Code || ' ',
                description: item.Material_Description
                    ? item.Material_Description
                    : (item.GLAccountLongName || ' '),
                hsn: item.HSN || ' ',
                quantity: this._formatNumber(item.Quantity, 3),
                uom: item.UOM || ' ',
                unitPrice: this._formatNumber(item.Unit_Price, 2),
                totalPrice: this._formatNumber(item.Total_Price, 2),
                currency: item.Currency || 'INR',
                cgstRate: item.Cgst_Rate ? `${this._formatNumber(item.Cgst_Rate, 2)}%` : '0.00%',
                cgstAmt: this._formatNumber(item.Cgst_Amt, 2),
                sgstRate: item.Sgst_Rate ? `${this._formatNumber(item.Sgst_Rate, 2)}%` : '0.00%',
                sgstAmt: this._formatNumber(item.Sgst_Amt, 2),
                igstRate: item.Igst_Rate ? `${this._formatNumber(item.Igst_Rate, 2)}%` : '0.00%',
                igstAmt: this._formatNumber(item.Igst_Amt, 2)
            }));

            // ✅ Skip first record if Document_No starts with "16"
            if (data.value[0]?.Document_No?.startsWith("16")) {
                items = items.slice(1);
            }



            var totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0).toFixed(2);
            var totalCgst = items.reduce((sum, item) => sum + (parseFloat(item.cgstAmt) || 0), 0).toFixed(2);
            var totalSgst = items.reduce((sum, item) => sum + (parseFloat(item.sgstAmt) || 0), 0).toFixed(2);
            var totalIgst = items.reduce((sum, item) => sum + (parseFloat(item.igstAmt) || 0), 0).toFixed(2);
            var grandTotal = (parseFloat(totalPrice) + parseFloat(totalCgst) + parseFloat(totalSgst) + parseFloat(totalIgst)).toFixed(2);

            var itemsPerPage = 18;
            var tableBody = [
                [{ colSpan: 14, stack: [{ table: { widths: ['*'], body: [[{ text: 'CREDIT NOTE', style: 'header', alignment: 'center', border: [false, false, false, false] }]] } }], border: [true, true, true, true], layout: headerLayout }, ...Array(13).fill({})],
                [{
                    colSpan: 14,
                    table: {
                        widths: ['12%', '38%', '38%', '12%'],
                        heights: [50, 50],
                        body: [
                            [
                                {
                                    stack: [
                                        base64Image
                                            ? { image: base64Image, width: 50, alignment: 'center', margin: [0, 0, 0, 0] }
                                            : { text: 'Logo Placeholder', style: 'subHeader', alignment: 'center', margin: [0, 0, 0, 0] }
                                    ],
                                    border: [true, true, true, false]
                                },
                                {
                                    stack: [
                                        { text: 'CRESCENT FOUNDRY CO PVT. LTD.', style: 'subHeader', alignment: 'left', margin: [2, 2, 2, 2] },
                                        { text: firstRecord.Plant_Address_Line1 || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: firstRecord.Plant_Address_Line2 || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: 'CIN NO: U29100WB1982PTCO35426', style: 'tableBody', alignment: 'left', margin: [2, 4, 2, 0] },
                                        { text: `GSTNO: ${firstRecord.GSTN_No || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `PAN NO: ${firstRecord.PAN_No || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `STATE CODE: ${firstRecord.Plant_State_Code || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] }
                                    ],
                                    border: [true, true, true, true]
                                },
                                {
                                    stack: [
                                        { text: `Tel: 03322826819`, style: 'tableBody', alignment: 'left', margin: [2, 2, 2, 0] },
                                        { text: `Fax: (033)2282-1886/3952`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `Website: admin@crescentfoundry.in`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: '4th FLOOR, SUIT NO 406, LORDS BUILDING, 7/1 LORD SINHA ROAD', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: 'Kolkata 700071, WB', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `Document No: ${firstRecord.Document_No || ''}`, style: 'tableBody', alignment: 'left', bold: true, margin: [2, 15, 2, 0] },
                                        { text: `Document Date: ${this._formatDate(firstRecord.Document_Date) || ''}`, style: 'tableBody', alignment: 'left', bold: true, margin: [2, 0, 2, 0] },
                                        { text: `Ref. No: ${firstRecord.ref_doc || ''}`, style: 'tableBody', alignment: 'left', bold: true, margin: [2, 0, 2, 0] },
                                        { text: `Ref. Date: ${this._formatDate(firstRecord.ref_date) || ''}`, style: 'tableBody', alignment: 'left', bold: true, margin: [2, 0, 2, 0] }
                                    ],
                                    border: [true, true, true, true]
                                },
                                {
                                    stack: [
                                        { text: '', style: 'tableBody', margin: [0, 0, 0, 0] }
                                    ],
                                    border: [true, true, true, false]
                                },
                            ],
                            [
                                {
                                    stack: [
                                        { text: '', style: 'tableBody', margin: [0, 0, 0, 0] }
                                    ],
                                    border: [true, false, true, true]
                                },
                                {
                                    stack: [
                                        { text: 'Bill To', style: 'subHeader', alignment: 'left', margin: [2, 2, 2, 2] },
                                        { text: firstRecord.Customer_Name || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: firstRecord.Customer_Address_Line1 || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: firstRecord.Customer_Address_Line3 || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: firstRecord.Customer_Address_Line4 || ' ', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `GST No: ${firstRecord.Customer_GST_No || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `PAN No: ${firstRecord.Customer_PAN_No || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `Place of Supply: ${firstRecord.Place_Of_Supply_City || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] }
                                    ],
                                    border: [true, true, true, true]
                                },
                                {
                                    stack: [
                                        { text: 'Ship To', style: 'subHeader', alignment: 'left', margin: [2, 2, 2, 2] },
                                        { text: firstRecord.Customer_Name || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: firstRecord.Customer_Address_Line1 || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: firstRecord.Customer_Address_Line3 || '', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: firstRecord.Customer_Address_Line4 || ' ', style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `GST No: ${firstRecord.Customer_GST_No || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `PAN No: ${firstRecord.Customer_PAN_No || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] },
                                        { text: `Place of Supply: ${firstRecord.Place_Of_Supply_City || ''}`, style: 'tableBody', alignment: 'left', margin: [2, 0, 2, 0] }
                                    ],
                                    border: [true, true, true, true]
                                },
                                {
                                    stack: [
                                        { text: '', style: 'tableBody', margin: [0, 0, 0, 0] }
                                    ],
                                    border: [true, false, true, true]
                                }
                                
                            ]
                        ]
                    },
                    layout: headerLayout
                }, ...Array(13).fill({})],
                [
                    { text: 'Material Code', style: 'tableHeader', alignment: 'left' },
                    { text: 'Material / GL Description', style: 'tableHeader', alignment: 'left' },
                    { text: 'HSN/SAC', style: 'tableHeader' },
                    { text: 'Quantity', style: 'tableHeader' },
                    { text: 'UOM', style: 'tableHeader' },
                    { text: 'Currency', style: 'tableHeader' },
                    { text: 'Unit Price', style: 'tableHeader' },
                    { text: 'Total Price', style: 'tableHeader' },
                    { text: 'CGST Rate', style: 'tableHeader' },
                    { text: 'CGST Amt', style: 'tableHeader' },
                    { text: 'SGST Rate', style: 'tableHeader' },
                    { text: 'SGST Amt', style: 'tableHeader' },
                    { text: 'IGST Rate', style: 'tableHeader' },
                    { text: 'IGST Amt', style: 'tableHeader' }
                ]
            ];

            let i = 0;
            while (i < items.length) {
                var chunk = items.slice(i, i + itemsPerPage);
                chunk.forEach((item, index) => {
                    var row = [
                        { text: item.materialCode, style: 'tableBodySmall', alignment: 'left' },
                        { text: item.description, style: 'tableBodySmall', alignment: 'left' },
                        { text: item.hsn, style: 'tableBodySmall' },
                        { text: item.quantity, style: 'tableBodySmall' },
                        { text: item.uom, style: 'tableBodySmall' },
                        { text: item.currency, style: 'tableBodySmall' },
                        { text: item.unitPrice, style: 'tableBodySmall', alignment: 'right' },
                        { text: item.totalPrice, style: 'tableBodySmall', alignment: 'right' },
                        { text: item.cgstRate, style: 'tableBodySmall' },
                        { text: item.cgstAmt, style: 'tableBodySmall', alignment: 'right' },
                        { text: item.sgstRate, style: 'tableBodySmall' },
                        { text: item.sgstAmt, style: 'tableBodySmall', alignment: 'right' },
                        { text: item.igstRate, style: 'tableBodySmall' },
                        { text: item.igstAmt, style: 'tableBodySmall', alignment: 'right' }
                    ];
                    if (index === chunk.length - 1 && i + itemsPerPage < items.length) {
                        row[0].pageBreak = 'after';
                        row[0].margin = [0, 0, 0, 0];
                        row[0].layout = noBordersNoPadding;
                    }
                    tableBody.push(row);
                });
                i += itemsPerPage;
            }

            tableBody.push(
                [
                    { colSpan: 4, text: `Reason of Credit Note: ${firstRecord.Note_In_Header || ' '}`, style: 'subHeader', alignment: 'left' },
                    {}, {}, {},
                    { colSpan: 2, text: 'Total', style: 'subHeader', alignment: 'left' },
                    {},
                    {},
                    { text: totalPrice, style: 'subHeader', alignment: 'right' },
                    {},
                    { text: totalCgst, style: 'subHeader', alignment: 'right' },
                    {},
                    { text: totalSgst, style: 'subHeader', alignment: 'right' },
                    {},
                    { text: totalIgst, style: 'subHeader', alignment: 'right' }
                ],
                [
                    { colSpan: 4, text: '', style: 'tableBody' },
                    {}, {}, {},
                    { colSpan: 2, text: 'Grand Total', style: 'subHeader', alignment: 'left' },
                    {},  // Added missing placeholder
                    { colSpan: 8, text: grandTotal, style: 'subHeader', alignment: 'right' },
                    {}, {}, {}, {}, {}, {}, {}
                ],
                [
                    { colSpan: 14, text: 'RCM APPLICABLE - YES/NO', style: 'subHeader', alignment: 'left' },
                    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                ],
                [
                    { colSpan: 14, text: `Amount in Words: ${this._numberToWords(grandTotal)}`, style: 'subHeader', alignment: 'left' },
                    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                ]
            );

            var docDefinition = {
                pageSize: 'A4',
                pageMargins: [20, 20, 20, 70],
                content: [{
                    table: {
                        widths: ['10%', '12%', '8%', '7%', '4%', '5%', '5%', '9%', '5%', '9%', '5%', '9%', '5%', '9%'],
                        headerRows: 3,
                        body: tableBody
                    },
                    layout: borderLayout
                }],
                footer: (currentPage, pageCount) => ({
                    stack: [
                        { columns: [{ text: 'Authorised Signatory', style: 'subHeader', alignment: 'right' }], margin: [20, 0, 30, 4] },
                        { text: 'CRESCENT FOUNDRY CO PVT. LTD', style: 'subHeader', alignment: 'right', margin: [20, 0, 30, 4] },
                        { columns: [{ text: 'SAP generated document', style: 'footerText', alignment: 'center' }], margin: [30, 0, 20, 4] }
                    ]
                }),
                styles: {
                    header: { fontSize: 10, bold: true },
                    subHeader: { fontSize: 7, bold: true },
                    tableHeader: { fontSize: 6, bold: true, fillColor: '#f0f0f0', alignment: 'center' },
                    tableBody: { fontSize: 6, alignment: 'center' },
                    tableBodySmall: { fontSize: 5, alignment: 'center' },
                    footerText: { fontSize: 6, italics: true }
                },
                defaultStyle: { font: 'Roboto', fontSize: 7 }
            };

            try {
                var pdfDoc = pdfMake.createPdf(docDefinition);
                pdfDoc.getBlob(blob => {
                    var url = URL.createObjectURL(blob);
                    oPdfContainer.setContent(`<iframe src="${url}" width="100%" height="900px" style="border:none;"></iframe>`);
                });
            } catch (error) {
                oPdfContainer.setContent(this._getNoDataHtml());
                MessageBox.error(`PDF generation failed: ${error.message}`);
                console.error('PDF Generation Error:', error);
            }
        },

        _getNoDataHtml: function () {
            return `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; border: 1px solid var(--sapUiContentForegroundBorderColor); background-color: var(--sapUiGroupContentBackground); border-radius: 8px; margin: 20px;">
            <span class="sap-icon sap-icon--message-information" style="font-size: 24px; color: var(--sapUiBaseText); margin-bottom: 10px;"></span>
            <p style="font-size: 18px; font-weight: bold; color: var(--sapUiBaseText); margin: 0;">No Data Available</p>
            <p style="font-size: 14px; color: var(--sapUiSecondaryText); margin: 5px 0 0 0;">Please Select Fiscal Year & Delivery Document No</p>
        </div>
    `;
        },

        _numberToWords: function (num) {
            const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            const thousands = ['', 'Thousand', 'Million', 'Billion'];

            if (!num || isNaN(num) || num === '0.00' || num === 0) {
                return 'Zero Only';
            }

            const numberValue = parseFloat(num);
            if (isNaN(numberValue)) {
                console.warn(`Invalid number input: ${num}`);
                return 'Zero Only';
            }

            const [integerPartStr, decimalPartStr] = numberValue.toFixed(2).split('.');
            let integerPart = parseInt(integerPartStr);
            const decimalPart = parseInt(decimalPartStr);

            if (integerPart < 0) {
                console.warn(`Negative number input: ${num}`);
                return 'Zero Only';
            }

            const toWords = n => {
                if (n < 10) return units[n];
                if (n < 20) return teens[n - 10];
                if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
                if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${toWords(n % 100)}`.trim();
                return '';
            };

            let str = '';
            let i = 0;

            while (integerPart > 0) {
                const chunk = integerPart % 1000;
                if (chunk) {
                    str = `${toWords(chunk)} ${thousands[i]} ${str}`.trim();
                }
                integerPart = Math.floor(integerPart / 1000);
                i++;
            }

            if (decimalPart > 0) {
                str += ` and ${toWords(decimalPart)} Paise`;
            }

            return str ? `${str} Only` : 'Zero Only';
        }
    });
});