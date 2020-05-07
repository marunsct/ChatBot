/*eslint no-console: 0*/
"use strict";
/**
 * Required External Modules
 */
const express = require("express");
//const path = require("path");
const bodyParser = require('body-parser');
//const request = require('request');

// Custom modules, Variables and Configurations
const oDataRequest = require("./CustomModules/oDataRequest");
const config = require('./config');
const caiOperations = require("./CustomModules/caiOperations");

/**
 * App Variables
 */
var app = express();
const port = config.PORT;

/**
 *  App Configuration
 */

app.set('port', port);
app.use(bodyParser.json());

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
//	res.status(200).send("Initial Request ");
var	reply = [{
						type: 'text',
						content: "how are you"
					}, {
						type: 'text',
						content: "How Can I help you?"
					}];
				var response = JSON.stringify({
				replies: reply,
				conversation: {
					memory: req.body.conversation.memory
				}
			});
			//console.log(respon + 'hii');
			res.statusCode = 200;
			res.setHeader('content-type', 'application/json');
			res.send(response);				
});

// Get status of a Sales Order

app.post("/SalesorderStatus", (req, res) => {

	var memory = req.body.conversation.memory;
	var options = config.options;

	options.url = options.url + "SALES_ORDERSet('" + memory.SO.raw + "')";
	options.method = "GET";

	// Call oData to get the values.
	oDataRequest.calloData(options).then(body => {

		caiOperations.formatReply(memory, 'displayso', JSON.parse(body.body)).then(reply => {

			var response = JSON.stringify({
				replies: reply,
				conversation: {
					memory: memory
				}
			});
			//console.log(respon + 'hii');
			res.statusCode = 200;
			res.setHeader('content-type', 'application/json');
			res.send(response);

		});
	});

});

// Get Sales Orders based on Filters

app.post("/SalesorderList", (req, res) => {

	var memory = req.body.conversation.memory;
	var options = config.options;

	options.url = options.url + "SALES_ORDERSet?$filter";
	options.method = "GET";

	// Call oData to get the values.
	console.log("hiiii");
	caiOperations.getFilters(memory).then((filters) => {

		console.log(filters);
		options.url = options.url + filters;
		console.log(options.url);
		oDataRequest.calloData(options).then(body => {

			caiOperations.formatReply(memory, 'displaysoset', JSON.parse(body.body)).then(reply => {

				var response = JSON.stringify({
					replies: reply,
					conversation: {
						memory: memory
					}
				});
				//console.log(respon + 'hii');
				console.log(response);
				res.statusCode = 200;
				res.setHeader('content-type', 'application/json');
				res.send(response);

			});
		});
	});

});

// Url Handle for Creating Sales Orders

app.post("/SalesorderCreate", (req, res) => {

	var memory = req.body.conversation.memory;
	var options = config.options;
	options.url = "";
	options.method = "GET";

	oDataRequest.calloData(options).then(result => {

		options.method = "POST";
		options.url = "";
		options.headers["x-csrf-token"] = result.headers['x-csrf-token'];
		options.headers.Cookie = result.headers['set-cookie'];

		var entity1 = {
			d: {
				DocType: "OR",
				SalesOrg: memory.sorg.raw,
				DistrChan: memory.dis_channel.raw,
				Division: memory.division.raw,
				Salesdocument: "",
				Type: "",
				Message: "",
				// PartnRole: "",
				PartnNumb: memory.customer.raw,
				ItmNumber: "",
				Material: memory.material.raw,
				TargetQty: memory.quantity.raw
			}
		};

		options.json = entity1;

		oDataRequest.calloData(options).then(resp => {

			caiOperations.formatReply(memory, 'createso', JSON.parse(resp.body)).then(reply => {

				var response = JSON.stringify({
					replies: reply,
					conversation: {
						memory: memory
					}
				});
				//console.log(respon + 'hii');
				res.statusCode = 200;
				res.setHeader('content-type', 'application/json');
				res.send(response);

			});

		});

	});

});

/**
 * Server Activation
 */

app.listen(port, () => {
	console.log(`Listening to requests on http://localhost:${port}`);
});