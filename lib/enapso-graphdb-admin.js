// Innotrade Enapso GraphDB Admin
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// For further detalils please also refer to the GraphDB admin documentation at: http://localhost:7200/webapi
// http://graphdb.ontotext.com/documentation/free/devhub/workbench-rest-api/location-and-repository-tutorial.html

const fs = require('fs');
const request = require('request-promise');

// require the Enapso GraphDB Client package
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');

const EnapsoGraphDBAdmin = {

	getHeaders: function () {
		return {
			"Accept":
				"application/json, text/plain, */*", //application/sparql-results+json,
			"Content-Type":
				"application/json;charset=UTF-8",
			"X-GraphDB-Repository":
				this.getRepository(),
			"Authorization":
				this.getAuthorization()
		}
	},

	execRequest: async function (aOptions) {
		var lRes;
		try {
			aOptions.resolveWithFullResponse = true;
			lRes = await request(aOptions);
			// success is OK (200) and ACCEPTED (202)
			let success = 200 === lRes.statusCode || 202 === lRes.statusCode || 201 === lRes.statusCode;
			lRes = {
				"success": success,
				"statusCode": lRes.statusCode,
				"statusMessage":
					lRes.statusMessage ?
						lRes.statusMessage :
						(success ? "OK" : "ERROR " + lRes.statusCode),
				"data": lRes.body
			};
		} catch (lErr) {
			lRes = {
				"success": false,
				"statusCode": lErr.statusCode ? lErr.statusCode : -1,
				"statusMessage": lErr.message
			}
		}
		return lRes;
	},

	// returns all repositories
	getRepositories: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/repositories",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	createRepository: async function (aOptions) {
		aOptions = aOptions || {};
		let lConfig = {
			"id": aOptions.id,
			"location": "",
			"params": {
				"baseURL": {
					"label": "Base URL",
					"name": "baseURL",
					"value": aOptions.baseURL != undefined ? aOptions.baseURL : "http://ont.enapso.comexample.org/graphdb#"
				},
				"entityIndexSize": {
					"label": "Entity index size",
					"name": "entityIndexSize",
					"value": aOptions.entityIndexSize != undefined ? aOptions.entityIndexSize : "200000"
				},
				"entityIdSize": {
					"label": "Entity ID bit-size",
					"name": "entityIdSize",
					"value": aOptions.entityIdSize != undefined ? aOptions.entityIdSize :"32"
				},
				"ruleset": {
					"label": "Ruleset",
					"name": "ruleset",
					"value": "owl-horst-optimized"
				},
				"storageFolder": {
					"label": "Storage folder",
					"name": "storageFolder",
					"value": "storage"
				},
				"enableContextIndex": {
					"label": "Use context index",
					"name": "enableContextIndex",
					"value": "false"
				},
				"cacheMemory": {
					"label": "Total cache memory",
					"name": "cacheMemory",
					"value": "80m"
				},
				"tupleIndexMemory": {
					"label": "Tuple index memory",
					"name": "tupleIndexMemory",
					"value": "80m"
				},
				"enablePredicateList": {
					"label": "Use predicate indices",
					"name": "enablePredicateList",
					"value": "false"
				},
				"predicateMemory": {
					"label": "Predicate index memory",
					"name": "predicateMemory",
					"value": "0"
				},
				"ftsMemory": {
					"label": "Full-text search memory",
					"name": "ftsMemory",
					"value": "0"
				},
				"ftsIndexPolicy": {
					"label": "Full-text search indexing policy",
					"name": "ftsIndexPolicy",
					"value": "never"
				},
				"ftsLiteralsOnly": {
					"label": "Full-text search literals only",
					"name": "ftsLiteralsOnly",
					"value": "true"
				},
				"inMemoryLiteralProperties": {
					"label": "Cache literal language tags",
					"name": "inMemoryLiteralProperties",
					"value": "false"
				},
				"enableLiteralIndex": {
					"label": "Enable literal index",
					"name": "enableLiteralIndex",
					"value": "true"
				},
				"indexCompressionRatio": {
					"label": "Index compression ratio",
					"name": "indexCompressionRatio",
					"value": "-1"
				},
				"checkForInconsistencies": {
					"label": "Check for inconsistencies",
					"name": "checkForInconsistencies",
					"value": "false"
				},
				"disableSameAs": {
					"label": "Disable owl:sameAs",
					"name": "disableSameAs",
					"value": "false"
				},
				"enableOptimization": {
					"label": "Enable query optimisation",
					"name": "enableOptimization",
					"value": "true"
				},
				"transactionIsolation": {
					"label": "Transaction isolation",
					"name": "transactionIsolation",
					"value": "true"
				},
				"transactionMode": {
					"label": "Transaction mode",
					"name": "transactionMode",
					"value": "safe"
				},
				"queryTimeout": {
					"label": "Query time-out (seconds)",
					"name": "queryTimeout",
					"value": "0"
				},
				"queryLimitResults": {
					"label": "Limit query results",
					"name": "queryLimitResults",
					"value": "0"
				},
				"throwQueryEvaluationExceptionOnTimeout": {
					"label": "Throw exception on query time-out",
					"name": "throwQueryEvaluationExceptionOnTimeout",
					"value": "false"
				},
				"readOnly": {
					"label": "Read-only",
					"name": "readOnly",
					"value": "false"
				},
				"nonInterpretablePredicates": {
					"label": "Non-interpretable predicates",
					"name": "nonInterpretablePredicates",
					"value": "http://www.w3.org/2000/01/rdf-schema#label;http://www.w3.org/1999/02/22-rdf-syntax-ns#type;http://www.ontotext.com/owlim/ces#gazetteerConfig;http://www.ontotext.com/owlim/ces#metadataConfig"
				}

			},
			"title": "",
			"type": "free"
		};

		let options = {
			method: 'POST',
			uri: 'http://localhost:7200/' + '/rest/repositories',
			body: lConfig,
			json: true
		};

		let resp = await this.execRequest(options);
		return resp;

	},

	deleteRepo: async function (aOptions) {
		aOptions = aOptions || {};
		let lOptions = {
			"method": "DELETE",
			"uri": 'http://localhost:7200/' + "/rest/repositories/" + aOptions.repo,
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	downloadToText: async function (aOptions) {
		aOptions = aOptions || {};
		aOptions.repository = aOptions.repository || this.getRepository();
		aOptions.format = aOptions.format || EnapsoGraphDBClient.FORMAT_TURTLE.type;
		let lOptions = {
			"method": "GET",
			"headers": this.getHeaders(),
			"uri": this.getBaseURL() + "/repositories/" + aOptions.repository + "/statements"
				+ "?infer=" + (aOptions.inference ? "true" : "false")
				+ "&Accept=" + encodeURIComponent(aOptions.format)
				+ (aOptions.context ? "&context=" + encodeURIComponent("<" + aOptions.context) + ">" : "")
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	downloadToFile: async function (aOptions) {
		aOptions = aOptions || {};
		aOptions.filename = aOptions.filename || "statements" + EnapsoGraphDBClient.FORMAT_TURTLE.extension;
		var lRes = await this.downloadToText(aOptions);
		if (lRes.success) {
			// todo: error handling and make it asynchronous
			fs.writeFileSync(aOptions.filename, lRes.data);
		}
		return lRes;
	},

	// empty the entire repository including all its named graphs
	// caution! this operation cannot be undone!
	clearRepository: async function () {
		let lRes = await this.update(
			`CLEAR ALL`
		);
		return lRes;
	},

	// get locations (requires repositoty manager role)
	getLocations: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/locations",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	// get users and their roles  (requires admin role)
	getUsers: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/security/user",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	// get the contexts (named graphs of the repository)
	getContexts: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/repositories/" + this.getRepository() + "/contexts",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = await request(lOptions);
		// transform the bindings into a more convenient result format (optional)
		lRes = EnapsoGraphDBClient.transformBindingsToResultSet(lRes, {
			// drop the prefixes for easier resultset readability (optional)
			dropPrefixes: false
		});
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	// remove the entire context (named graph) of the repository
	// caution! this operation cannot be undone!
	clearContext: async function (aOptions) {
		aOptions = aOptions || {};
		if (typeof aOptions === "string") {
			aOptions = {
				"context": aOptions
			};
		}
		aOptions.context = aOptions.context || this.getDefaultContext();
		let lSPARQL = `CLEAR GRAPH <${aOptions.context}>`;
		let lRes = await this.update(lSPARQL);
		return lRes;
	},

	// get locations (requires repositoty manager role)
	getSavedQueries: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/sparql/saved-queries",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	// Result from GraphDB
	// {
	//     "heapMemoryUsage": {
	//         "max": 8070889472,
	//         "committed": 8070889472,
	//         "init": 2147483648,
	//         "used": 2332859576
	//     },
	//     "nonHeapMemoryUsage": {
	//         "max": -1,
	//         "committed": 222101504,
	//         "init": 2555904,
	//         "used": 216038536
	//     },
	//     "threadCount": 48,
	//     "cpuLoad": 0.7800099401970747,
	//     "classCount": 24553
	// },      

	getResources: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/monitor/resource",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	// [
	//     {
	//       "trackId": "4117",
	//       "isRequestedToStop": false,
	//       "sparqlString": "INSERT DATA { ... }",
	//       "state": "IN_COMMIT",
	//       "type": "UPDATE",
	//       "numberOfOperations": 47,
	//       "msSinceCreated": 61,
	//       "humanLifetime": "0s"
	//     }
	// ]

	getQuery: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/monitor/query",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	getQueryCount: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/monitor/query/count",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	getImports: async function () {
		let lOptions = {
			"method": "GET",
			"uri": this.getBaseURL() + "/rest/data/import/active/" + this.getRepository(),
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	performGarbageCollection: async function () {
		let lOptions = {
			"method": "POST",
			"uri": this.getBaseURL() + "/rest/monitor/resource/gc",
			"headers": this.getHeaders(),
			"json": true
		};
		var lRes = this.execRequest(lOptions);
		return lRes;
	},

	wait: async function (aMilliseconds) {
		let lPromise = new Promise(function (resolve) {
			setTimeout(function () {
				resolve({ ok: 200 })
			}, aMilliseconds);
		});
		return lPromise;
	},

	waitForGraphDB: async function (aOptions) {
		aOptions = aOptions || {};
		if (!aOptions.memoryWatermark) {
			aOptions.memoryWatermark = 0.80;
		}
		if (!aOptions.cpuWatermark) {
			aOptions.cpuWatermark = 0.80;
		}
		if (!aOptions.timeout) {
			aOptions.timeout = 1 * 60 * 1000; // one minute in milli seconds
		}
		if (!aOptions.timeout) {
			aOptions.timeout = 1 * 60 * 1000; // one minute in milli seconds
		}
		if (aOptions.performGarbageCollection !== true) {
			aOptions.performGarbageCollection = false;
		}
		let me = this;
		let lPromise = new Promise(async function (resolve) {
			let lStarted = new Date().getTime();
			let lTimeout = lStarted + aOptions.timeout;
			let lResources, lYetAgain;
			do {
				lResources = await me.getResources();
				if (aOptions.callback) {
					aOptions.callback(lResources);
				}
				lYetAgain = (new Date().getTime() < lTimeout);
				if (lYetAgain) {
					await me.wait(aOptions.interval);
				}
			} while (lYetAgain);
			// perform garbage collection on demand
			if (aOptions.performGarbageCollection) {
				let lGCRes = await me.performGarbageCollection();
				if (aOptions.callback) {
					aOptions.callback(lGCRes);
				}
			}
			resolve({
				data: lResources
			});
		});

		return lPromise;
	},

	upload: async function (aOptions) {
		aOptions = aOptions || {};
		let lConfig = {
			"baseURI": aOptions.baseIRI,
			"context": aOptions.context,
			"data": aOptions.data,
			"forceSerial": false,
			"format": aOptions.format,
			"message": 'message',
			"name": aOptions.filename,
			"parserSettings": {
				"failOnUnknownDataTypes": false,
				"failOnUnknownLanguageTags": false,
				"normalizeDataTypeValues": false,
				"normalizeLanguageTags": false,
				"preserveBNodeIds": false,
				"stopOnError": false,
				"verifyDataTypeValues": false,
				"verifyLanguageTags": false,
				"verifyRelativeURIs": false,
				"verifyURISyntax": false
			},
			"replaceGraphs": [
			],
			"status": "NONE",
			"timestamp": 0,
			"type": "text"
		};

		let options = {
			method: 'POST',
			uri: this.getBaseURL() + '/rest/data/import/upload/' + this.getRepository() + '/text',
			body: lConfig,
			headers: this.getHeaders(),
			json: true
		};

		let resp = await this.execRequest(options);
		return resp;
	},

	// upload a file to graphdb
	uploadFromFile: async function (options) {
		let buffer;
		try {
			buffer = fs.readFileSync(options.filename, 'utf8');
		} catch (err) {
			return {
				statusCode: 400,
				message: err.message,
				success: false
			}
		}
		var res = await this.upload({
			data: buffer,
			format: options.format,
			baseIRI: options.baseIRI,
			context: options.context,
			filename: options.filename
		});
		return res;
	},

	uploadFromURL: async function (aOptions) {
		var lRes = await this.upload({
			data: aOptions.URL,
			format: aOptions.format,
			baseURI: aOptions.baseURI,
			context: aOptions.context
		});
		return lRes;
	},

	uploadFromData: async function (aOptions) {
		var lRes = await this.upload({
			data: aOptions.data,
			format: aOptions.format,
			baseURI: aOptions.baseURI,
			context: aOptions.context
		});
		return lRes;
	}
}

// extend the Enapso GraphDB client by the additional Admin features
for (let lKey in EnapsoGraphDBAdmin) {
	EnapsoGraphDBClient.Endpoint.prototype[lKey] = EnapsoGraphDBAdmin[lKey];
}

module.exports = EnapsoGraphDBAdmin
