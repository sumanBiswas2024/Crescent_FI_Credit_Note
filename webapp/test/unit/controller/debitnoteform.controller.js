/*global QUnit*/

sap.ui.define([
	"com/crescent/app/debitnoteform/controller/debitnoteform.controller"
], function (Controller) {
	"use strict";

	QUnit.module("debitnoteform Controller");

	QUnit.test("I should test the debitnoteform controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
