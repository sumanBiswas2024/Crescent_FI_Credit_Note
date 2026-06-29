sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, MessageBox, Filter, FilterOperator, Fragment) {
    "use strict";

    const imageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAYAAALGCAYAAADWYpNXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAE1vSURBVHhe7d0FvJRV+gfwQ5eAYiB2IHa3YneLHbsGig0mtmJ3Ynd3sHZg19pdCBY2ioWCpP97Zo//XV115TLv3Jl7vt/9zOe+zxkWhHtn5n1/7znPafJznQAAAABkqWn6CgAAAGRIMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAAkDHBAAAAAGRMMAAAAAAZEwwAAABAxgQDAAAA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AABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkTDAAAAAAGRMMAAAAQMYEAwAAAJAxwQAAAABkrEmX7nv+nI4BAAAahWZhQjh4hjdC66bj0wjVrHnzCWHRBYeFJk3SABUlGAAAABqdLab6IBw106upoto1m2VsaD7ruFRRaZYSAAAAjUqrJuPDHl0GpYqq1+Ln0GxGoUBDEgwAAACNyrbTvBemaTE6VVS7ZjOPDU2ap4IGIRgAAAAajQ7NxoSdOg9OFVWv1YTQbHp9IBqaYAAAAGg0duo8JHRoblp6rYh9BZq4Km1wvgUAAECjME2Ln8I207yXKqpdk7YTQtNpzRaoBoIBAACgUdh92kGhddMJqaLaNZttrO0Jq4RgAAAAqHkztfohbDrV0FRR7Zp0mBCaTS3EqRaCAQAAoObt3eXt0LzJz6mi2jWfbWw6ohoIBgAAgJo2d5vvwtpTfJoqql2TTuND0ynMFqgmggEAAKCm7Tf9m9aq14yfzRaoQoIBAACgZi0x2VdhuQ5fpopq13Sa8aFpe0s+qo1gAAAAqFn7Tf9WOqLqNfk5NJt1XCqoJoIBAACgJq3S8bOwULtvUkW1a9plfGja1myBaiQYAAAAak6T8HPYZ7q3U0XVa/pzaD6L3gLVSjAAAADUnA07fRTmaDMiVVS7ZjOMC01apYKqIxgAAABqSosmE0KfLoNSRdVr/nNoNpPeAtVMMAAAANSULaf6IEzfalSqqHYxFGjSIhVUJcEAAABQM9o2HRd2m/adVFH1Wv5cWkZAdRMMAAAANaPnNO+GTi3GpIpqFxsONmmWCqqWYAAAAKgJUzQbHXp2HpIqql7rCaUtCql+ggEAAKAm7NplcJismQvNWtF8tnGhiSvOGhDC/wGdmZCOQPRiQwAAAABJRU5ErkJggg==";

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

                    // return this._loadImageAsBase64("com/crescent/app/creditnoteformfico/images/Crescent_logo_new.png")
                    //     .catch(error => {
                    //         console.warn(`Logo loading failed: ${error.message}. Using placeholder.`);
                    //         return null;
                    //     })
                    //     .then(base64Image => this._generatePdfFromData(base64Image, oCreditNoteDataModel.getData()));

                    return this._loadImageAsBase64()
                        .then(base64Image =>
                            this._generatePdfFromData(
                                base64Image,
                                oCreditNoteDataModel.getData()
                            )
                        );
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

        // _loadImageAsBase64: function (imagePath) {
        //     return new Promise((resolve, reject) => {
        //         const imageUrl = sap.ui.require.toUrl(imagePath);
        //         const xhr = new XMLHttpRequest();

        //         xhr.onload = () => {
        //             const reader = new FileReader();
        //             reader.onloadend = () => resolve(reader.result);
        //             reader.onerror = () => reject(new Error("Failed to convert image to base64"));
        //             reader.readAsDataURL(xhr.response);
        //         };
        //         xhr.onerror = () => reject(new Error("Failed to load image"));
        //         xhr.open('GET', imageUrl);
        //         xhr.responseType = 'blob';
        //         xhr.send();
        //     });
        // },
        
        _loadImageAsBase64: function () {
            return new Promise((resolve) => {

                var oImageUrl = jQuery.sap.getModulePath(
                    "com.crescent.app.creditnoteformfico",
                    "/image/Crescent_logo_v2.png"
                );

                console.log("Trying logo:", oImageUrl);

                var img = new Image();

                img.onload = function () {

                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var dataURL = canvas.toDataURL("image/png");

                    console.log("Logo loaded from repository");

                    resolve(dataURL);
                };

                img.onerror = function () {

                    console.warn(
                        "Logo file not found. Using embedded Base64 logo."
                    );

                    resolve(imageBase64);
                };

                img.src = oImageUrl;

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
                                        // base64Image
                                        //     ? { image: base64Image, width: 50, alignment: 'center', margin: [0, 0, 0, 0] }
                                        //     : { text: 'Logo Placeholder', style: 'subHeader', alignment: 'center', margin: [0, 0, 0, 0] }
                                        { image: base64Image, width: 50, alignment: 'center', margin: [0, 0, 0, 0] }
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

        // _numberToWords: function (num) {
        //     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        //     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        //     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        //     const thousands = ['', 'Thousand', 'Million', 'Billion'];

        //     if (!num || isNaN(num) || num === '0.00' || num === 0) {
        //         return 'Zero Only';
        //     }

        //     const numberValue = parseFloat(num);
        //     if (isNaN(numberValue)) {
        //         console.warn(`Invalid number input: ${num}`);
        //         return 'Zero Only';
        //     }

        //     const [integerPartStr, decimalPartStr] = numberValue.toFixed(2).split('.');
        //     let integerPart = parseInt(integerPartStr);
        //     const decimalPart = parseInt(decimalPartStr);

        //     if (integerPart < 0) {
        //         console.warn(`Negative number input: ${num}`);
        //         return 'Zero Only';
        //     }

        //     const toWords = n => {
        //         if (n < 10) return units[n];
        //         if (n < 20) return teens[n - 10];
        //         if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
        //         if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${toWords(n % 100)}`.trim();
        //         return '';
        //     };

        //     let str = '';
        //     let i = 0;

        //     while (integerPart > 0) {
        //         const chunk = integerPart % 1000;
        //         if (chunk) {
        //             str = `${toWords(chunk)} ${thousands[i]} ${str}`.trim();
        //         }
        //         integerPart = Math.floor(integerPart / 1000);
        //         i++;
        //     }

        //     if (decimalPart > 0) {
        //         str += ` and ${toWords(decimalPart)} Paise`;
        //     }

        //     return str ? `${str} Only` : 'Zero Only';
        // }

        _numberToWords: function (num) {
            if (!num || isNaN(num)) {
                return "Zero Only";
            }

            const ones = [
                "", "One", "Two", "Three", "Four",
                "Five", "Six", "Seven", "Eight", "Nine",
                "Ten", "Eleven", "Twelve", "Thirteen",
                "Fourteen", "Fifteen", "Sixteen",
                "Seventeen", "Eighteen", "Nineteen"
            ];

            const tens = [
                "", "", "Twenty", "Thirty", "Forty",
                "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
            ];

            const convertBelowThousand = (n) => {
                let str = "";

                if (n >= 100) {
                    str += ones[Math.floor(n / 100)] + " Hundred ";
                    n = n % 100;
                }

                if (n >= 20) {
                    str += tens[Math.floor(n / 10)] + " ";
                    n = n % 10;
                }

                if (n > 0) {
                    str += ones[n] + " ";
                }

                return str.trim();
            };

            const number = parseFloat(num);
            const [rupeesStr, paiseStr] = number.toFixed(2).split(".");

            let n = parseInt(rupeesStr, 10);
            const paise = parseInt(paiseStr, 10);

            if (n === 0 && paise === 0) {
                return "Zero Only";
            }

            let words = "";

            const crore = Math.floor(n / 10000000);
            n %= 10000000;

            const lakh = Math.floor(n / 100000);
            n %= 100000;

            const thousand = Math.floor(n / 1000);
            n %= 1000;

            const hundred = n;

            if (crore) {
                words += convertBelowThousand(crore) + " Crore ";
            }

            if (lakh) {
                words += convertBelowThousand(lakh) + " Lakh ";
            }

            if (thousand) {
                words += convertBelowThousand(thousand) + " Thousand ";
            }

            if (hundred) {
                words += convertBelowThousand(hundred) + " ";
            }

            words = words.trim();

            if (paise > 0) {
                words += " and " + convertBelowThousand(paise) + " Paise";
            }

            return words + " Only";
        }
    });
});