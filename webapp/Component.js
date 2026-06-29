sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "com/crescent/app/creditnoteformfico/model/models",
    "sap/ui/core/library",
    "sap/ui/thirdparty/jquery"
], function (UIComponent, MessageBox, models, coreLibrary, jQuery) {
    "use strict";

    return UIComponent.extend("com.crescent.app.creditnoteformfico.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        /**
         * Initializes the component, sets up models, and checks OData service availability
         */
        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Log SAPUI5 version for debugging
            console.log("SAPUI5 Version:", sap.ui.version);

            // Set the device model
            this.setModel(models.createDeviceModel(), "device");

            // Get the OData model and log details
            const oModel = this.getModel(); // Default OData model from manifest.json
            console.log("OData Model:", oModel);
            console.log("OData Model Type:", oModel ? oModel.getMetadata().getName() : "undefined");

            // Check OData model initialization
            if (!oModel || typeof oModel !== "object" || !oModel.isA || !oModel.isA("sap.ui.model.odata.v4.ODataModel")) {
                const sModelType = oModel && oModel.getMetadata ? oModel.getMetadata().getName() : "undefined";
                MessageBox.error(
                    `OData model is not initialized or not an OData V4 model. Model type: ${sModelType}. Please check the manifest.json configuration or service availability.`,
                    {
                        title: "Model Initialization Error",
                        onClose: function () {
                            console.warn("OData model initialization failed. Application functionality may be limited.");
                        }
                    }
                );
            } else {
                // Check OData service availability by fetching $metadata
                const sServiceUrl = oModel.getServiceUrl() + "$metadata";
                jQuery.ajax({
                    url: sServiceUrl,
                    method: "GET",
                    success: function () {
                        console.log("OData service metadata loaded successfully.");
                    },
                    error: function (oError) {
                        const sError = oError.statusText || "Failed to load OData service metadata.";
                        const sStatus = oError.status ? `Status: ${oError.status}` : "";
                        MessageBox.error(`Metadata loading failed: ${sError} ${sStatus}. Please check the service URL or network connection.`, {
                            title: "Service Initialization Error",
                            onClose: function () {
                                console.warn("Metadata loading failed. Application functionality may be limited.");
                            }
                        });
                    }
                });
            }

            // Enable routing
            this.getRouter().initialize();
        }
    });
});