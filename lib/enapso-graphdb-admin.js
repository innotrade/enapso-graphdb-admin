// Innotrade enapso GraphDB Admin
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze and Muhammad Yasir
// For further detalils please also refer to the GraphDB admin documentation at: http://localhost:7200/webapi
// http://graphdb.ontotext.com/documentation/free/devhub/workbench-rest-api/location-and-repository-tutorial.html

const fs = require("fs");
const request = require("request-promise");

// require the enapso GraphDB Client package
const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

const EnapsoGraphDBAdmin = {
  getHeaders: function () {
    return {
      Accept: "application/json, text/plain, */*", //application/sparql-results+json,
      "Content-Type": "application/json;charset=UTF-8",
      "X-GraphDB-Repository": this.getRepository(),
      Authorization: this.getAuthorization(),
    };
  },

  execRequest: async function (options) {
    return new Promise(async (resolve, reject) => {
      var res;
      try {
        options.resolveWithFullResponse = true;
        res = await request(options);
        // success is OK (200) and ACCEPTED (202) and CREATED (201)
        let success =
          200 === res.statusCode ||
          202 === res.statusCode ||
          201 === res.statusCode ||
          204 === res.statusCode;
        res = {
          success: success,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage
            ? res.statusMessage
            : success
            ? "OK"
            : "ERROR " + res.statusCode,
          data: res.body,
        };
        resolve(res);
        // console.log("OK: " + JSON.stringify(res));
      } catch (err) {
        res = {
          success: false,
          statusCode: err.statusCode ? err.statusCode : -1,
          statusMessage:
            err.error && err.error.message ? err.error.message : err.message,
        };
        reject(res);
        // console.log("ERROR: " + JSON.stringify(res));
      }
      //	return res;
    });
  },

  waitForAsynchronousResponse: async function (args) {
    args = args || {};
    let options = {
      method: "GET",
      uri: args.uri,
      headers: this.getHeaders(),
      json: true,
    };
    let resp = await this.execRequest(options);
    return resp;
  },

  waitForUploadResponse: async function (args) {
    args = args || {};
    args.timeout = args.timeout || 60000;
    args.interval = args.interval || 1000;
    let resp;
    let start = new Date().getTime(),
      end;
    let finish = false,
      timeout = false;
    do {
      resp = await this.waitForAsynchronousResponse({
        uri: this.getBaseURL() + "/rest/data/import/upload/"+this.getRepository(),
      });
      // console.log("WAITING: " + JSON.stringify(resp));
      if (resp === "0" || resp === 0) {
        finish = true;
      } else if (resp && resp.data && Array.isArray(resp.data)) {
        finish = true;
        for (let item of resp.data) {
          if (
            item.status &&
            item.status !== "DONE" &&
            item.status !== "ERROR"
          ) {
            finish = false;
            break;
          }
        }
      }
      // console.log("? " + success);
      end = new Date().getTime();

      timeout = start + args.timeout < end;
      if (!timeout && !finish) {
        await new Promise(function (resolve) {
          setTimeout(function () {
            resolve();
          }, args.interval);
        });
      }
    } while (!timeout && !finish);
    return resp;
  },

  // returns all repositories
  getRepositories: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      let lOptions = {
        method: "GET",
        uri: this.getBaseURL() + "/rest/repositories",
        headers: this.getHeaders(),
        json: true,
      };

      try {
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  createRepository: async function (aOptions) {
    aOptions = aOptions || {};

    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      let config = {
        id: aOptions.id,
        location: aOptions.location !== undefined ? aOptions.location : "",
        params: {
          baseURL: {
            label: "Base URL",
            name: "baseURL",
            value:
              aOptions.baseURL !== undefined
                ? aOptions.baseURL
                : "http://ont.enapso.com#",
          },
          entityIndexSize: {
            label: "Entity index size",
            name: "entityIndexSize",
            value:
              aOptions.entityIndexSize !== undefined
                ? aOptions.entityIndexSize
                : "200000",
          },
          entityIdSize: {
            label: "Entity ID bit-size",
            name: "entityIdSize",
            value:
              aOptions.entityIdSize !== undefined
                ? aOptions.entityIdSize
                : "32",
          },
          ruleset: {
            label: "Ruleset",
            name: "ruleset",
            value:
              aOptions.ruleset !== undefined
                ? aOptions.ruleset
                : "owl-horst-optimized",
          },
          storageFolder: {
            label: "Storage folder",
            name: "storageFolder",
            value:
              aOptions.storageFolder !== undefined
                ? aOptions.storageFolder
                : "storage",
          },
          enableContextIndex: {
            label: "Use context index",
            name: "enableContextIndex",
            value:
              aOptions.enableContextIndex !== undefined
                ? aOptions.enableContextIndex
                : "false",
          },
          cacheMemory: {
            label: "Total cache memory",
            name: "cacheMemory",
            value:
              aOptions.cacheMemory !== undefined ? aOptions.cacheMemory : "80m",
          },
          tupleIndexMemory: {
            label: "Tuple index memory",
            name: "tupleIndexMemory",
            value:
              aOptions.tupleIndexMemory !== undefined
                ? aOptions.tupleIndexMemory
                : "80m",
          },
          enablePredicateList: {
            label: "Use predicate indices",
            name: "enablePredicateList",
            value:
              aOptions.enablePredicateList !== undefined
                ? aOptions.enablePredicateList
                : "false",
          },
          predicateMemory: {
            label: "Predicate index memory",
            name: "predicateMemory",
            value:
              aOptions.predicateMemory !== undefined
                ? aOptions.predicateMemory
                : "0",
          },
          ftsMemory: {
            label: "Full-text search memory",
            name: "ftsMemory",
            value: aOptions.ftsMemory !== undefined ? aOptions.ftsMemory : "0",
          },
          ftsIndexPolicy: {
            label: "Full-text search indexing policy",
            name: "ftsIndexPolicy",
            value:
              aOptions.ftsIndexPolicy !== undefined
                ? aOptions.ftsIndexPolicy
                : "never",
          },
          ftsLiteralsOnly: {
            label: "Full-text search literals only",
            name: "ftsLiteralsOnly",
            value:
              aOptions.ftsLiteralsOnly !== undefined
                ? aOptions.ftsLiteralsOnly
                : "true",
          },
          inMemoryLiteralProperties: {
            label: "Cache literal language tags",
            name: "inMemoryLiteralProperties",
            value:
              aOptions.inMemoryLiteralProperties !== undefined
                ? aOptions.inMemoryLiteralProperties
                : "false",
          },
          enableLiteralIndex: {
            label: "Enable literal index",
            name: "enableLiteralIndex",
            value:
              aOptions.enableLiteralIndex !== undefined
                ? aOptions.enableLiteralIndex
                : "true",
          },
          indexCompressionRatio: {
            label: "Index compression ratio",
            name: "indexCompressionRatio",
            value:
              aOptions.indexCompressionRatio !== undefined
                ? aOptions.indexCompressionRatio
                : "-1",
          },
          checkForInconsistencies: {
            label: "Check for inconsistencies",
            name: "checkForInconsistencies",
            value:
              aOptions.checkForInconsistencies !== undefined
                ? aOptions.checkForInconsistencies
                : "false",
          },
          disableSameAs: {
            label: "Disable owl:sameAs",
            name: "disableSameAs",
            value:
              aOptions.disableSameAs !== undefined
                ? aOptions.disableSameAs
                : "false",
          },
          enableOptimization: {
            label: "Enable query optimisation",
            name: "enableOptimization",
            value:
              aOptions.enableOptimization !== undefined
                ? aOptions.enableOptimization
                : "true",
          },
          transactionIsolation: {
            label: "Transaction isolation",
            name: "transactionIsolation",
            value:
              aOptions.transactionIsolation !== undefined
                ? aOptions.transactionIsolation
                : "true",
          },
          transactionMode: {
            label: "Transaction mode",
            name: "transactionMode",
            value:
              aOptions.transactionMode !== undefined
                ? aOptions.transactionMode
                : "safe",
          },
          queryTimeout: {
            label: "Query time-out (seconds)",
            name: "queryTimeout",
            value:
              aOptions.queryTimeout !== undefined ? aOptions.queryTimeout : "0",
          },
          queryLimitResults: {
            label: "Limit query results",
            name: "queryLimitResults",
            value:
              aOptions.queryLimitResults !== undefined
                ? aOptions.queryLimitResults
                : "0",
          },
          throwQueryEvaluationExceptionOnTimeout: {
            label: "Throw exception on query time-out",
            name: "throwQueryEvaluationExceptionOnTimeout",
            value:
              aOptions.throwQueryEvaluationExceptionOnTimeout !== undefined
                ? aOptions.throwQueryEvaluationExceptionOnTimeout
                : "false",
          },
          readOnly: {
            label: "Read-only",
            name: "readOnly",
            value:
              aOptions.readOnly !== undefined ? aOptions.readOnly : "false",
          },
          nonInterpretablePredicates: {
            label: "Non-interpretable predicates",
            name: "nonInterpretablePredicates",
            value:
              aOptions.nonInterpretablePredicates !== undefined
                ? aOptions.nonInterpretablePredicates
                : "http://www.w3.org/2000/01/rdf-schema#label;http://www.w3.org/1999/02/22-rdf-syntax-ns#type;http://www.ontotext.com/owlim/ces#gazetteerConfig;http://www.ontotext.com/owlim/ces#metadataConfig",
          },
          isShacl: {
            label: "Supports SHACL validation",
            name: "isShacl",
            value: aOptions.isShacl !== undefined ? aOptions.isShacl : false,
          },
        },
        title:
          aOptions.title !== undefined ? aOptions.title : "enapso Repository",
        type: aOptions.type !== undefined ? aOptions.type : "free",
      };

      let options = {
        method: "POST",
        uri: this.getBaseURL() + "/rest/repositories",
        body: config,
        json: true,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: this.getAuthorization(),
        },
      };
      try {
        let resp = await this.execRequest(options);
        resolve(resp);
      } catch (err) {
        reject(err);
      }

      //return resp;
    });
  },

  /* since 9.1.1: 
{
  "JSON": {
    "id": "enapso-dev",
    "params": {
      "baseURL": {
        "label": "Base URL",
        "name": "baseURL",
        "value": "http://example.org/owlim#"
      },
      "cacheSelectNodes": {
        "label": "Cache select nodes",
        "name": "cacheSelectNodes",
        "value": "true"
      },
      "checkForInconsistencies": {
        "label": "Check for inconsistencies",
        "name": "checkForInconsistencies",
        "value": "false"
      },
      "defaultNS": {
        "label": "Default namespaces for imports(';' delimited)",
        "name": "defaultNS",
        "value": ""
      },
      "disableSameAs": {
        "label": "Disable owl:sameAs",
        "name": "disableSameAs",
        "value": "true"
      },
      "enableContextIndex": {
        "label": "Use context index",
        "name": "enableContextIndex",
        "value": "false"
      },
      "enableLiteralIndex": {
        "label": "Enable literal index",
        "name": "enableLiteralIndex",
        "value": "true"
      },
      "enablePredicateList": {
        "label": "Use predicate indices",
        "name": "enablePredicateList",
        "value": "true"
      },
      "entityIdSize": {
        "label": "Entity ID bit-size",
        "name": "entityIdSize",
        "value": "32"
      },
      "entityIndexSize": {
        "label": "Entity index size",
        "name": "entityIndexSize",
        "value": "10000000"
      },
      "globalLogValidationExecution": {
        "label": "Log every execution step of the SHACL validation",
        "name": "globalLogValidationExecution",
        "value": "false"
      },
      "id": {
        "label": "Repository ID",
        "name": "id",
        "value": "repo-test"
      },
      "ignoreNoShapesLoadedException": {
        "label": "Ignore no shapes loaded exception",
        "name": "ignoreNoShapesLoadedException",
        "value": "false"
      },
      "imports": {
        "label": "Imported RDF files(';' delimited)",
        "name": "imports",
        "value": ""
      },
      "inMemoryLiteralProperties": {
        "label": "Cache literal language tags",
        "name": "inMemoryLiteralProperties",
        "value": "true"
      },
      "logValidationPlans": {
        "label": "Log the executed validation plans",
        "name": "logValidationPlans",
        "value": "false"
      },
      "logValidationViolations": {
        "label": "Log validation violations",
        "name": "logValidationViolations",
        "value": "false"
      },
      "parallelValidation": {
        "label": "Run parallel validation",
        "name": "parallelValidation",
        "value": "true"
      },
      "performanceLogging": {
        "label": "Log the execution time per shape",
        "name": "performanceLogging",
        "value": "false"
      },
      "queryLimitResults": {
        "label": "Limit query results",
        "name": "queryLimitResults",
        "value": "0"
      },
      "queryTimeout": {
        "label": "Query time-out (seconds)",
        "name": "queryTimeout",
        "value": "0"
      },
      "rdfsSubClassReasoning": {
        "label": "RDFS subClass reasoning",
        "name": "rdfsSubClassReasoning",
        "value": "true"
      },
      "readOnly": {
        "label": "Read-only",
        "name": "readOnly",
        "value": "false"
      },
      "repositoryType": {
        "label": "Repository type",
        "name": "repositoryType",
        "value": "file-repository"
      },
      "ruleset": {
        "label": "Ruleset",
        "name": "ruleset",
        "value": "rdfsplus-optimized"
      },
      "storageFolder": {
        "label": "Storage folder",
        "name": "storageFolder",
        "value": "storage"
      },
      "throwQueryEvaluationExceptionOnTimeout": {
        "label": "Throw exception on query time-out",
        "name": "throwQueryEvaluationExceptionOnTimeout",
        "value": "false"
      },
      "title": {
        "label": "Repository title",
        "name": "title",
        "value": "GraphDB Free repository"
      },
      "undefinedTargetValidatesAllSubjects": {
        "label": "Validate subjects when target is undefined",
        "name": "undefinedTargetValidatesAllSubjects",
        "value": "false"
      },
      "validationEnabled": {
        "label": "Enable the SHACL validation",
        "name": "validationEnabled",
        "value": "true"
      }
    },
    "title": "enapso DEV",
    "type": "free"
  }
}
*/

  createUser: async function (aOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      aOptions = aOptions || {};
      // use empty array in case not authorities are passed
      if (aOptions.authorities === undefined) {
        aOptions.authorities = [];
      }

      let config = {
        appSettings: {
          DEFAULT_SAMEAS:
            aOptions.DEFAULT_SAME_AS !== undefined
              ? aOptions.DEFAULT_SAME_AS
              : true,
          DEFAULT_INFERENCE:
            aOptions.DEFAULT_INFERENCE !== undefined
              ? aOptions.DEFAULT_INFERENCE
              : true,
          EXECUTE_COUNT:
            aOptions.EXECUTE_COUNT !== undefined
              ? aOptions.EXECUTE_COUNT
              : true,
          IGNORE_SHARED_QUERIES:
            aOptions.IGNORE_SHARED_QUERIES !== undefined
              ? aOptions.IGNORE_SHARED_QUERIES
              : false,
        },
        grantedAuthorities: aOptions.authorities,
      };

      let options = {
        method: "POST",
        uri: this.getBaseURL() + "/rest/security/user/" + aOptions.username,
        headers: {
          Accept: "application/json, text/plain, */*", // application/sparql-results+json,
          "Content-Type": "application/json;charset=UTF-8",
          // "X-GraphDB-Repository":
          // 	this.getRepository(),
          Authorization: this.getAuthorization(),
          "X-GraphDB-Password": aOptions.password,
        },
        body: config,
        json: true,
      };
      try {
        let resp = await this.execRequest(options);
        resolve(resp);
      } catch (err) {
        reject(err);
      }
    });
  },

  updateUser: async function (aOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}
      aOptions = aOptions || {};
      // use empty array in case not authorities are passed
      if (aOptions.authorities === undefined) {
        aOptions.authorities = [];
      }

      let config = {
        appSettings: {
          DEFAULT_SAMEAS:
            aOptions.DEFAULT_SAME_AS !== undefined
              ? aOptions.DEFAULT_SAME_AS
              : true,
          DEFAULT_INFERENCE:
            aOptions.DEFAULT_INFERENCE !== undefined
              ? aOptions.DEFAULT_INFERENCE
              : true,
          EXECUTE_COUNT:
            aOptions.EXECUTE_COUNT !== undefined
              ? aOptions.EXECUTE_COUNT
              : true,
          IGNORE_SHARED_QUERIES:
            aOptions.IGNORE_SHARED_QUERIES !== undefined
              ? aOptions.IGNORE_SHARED_QUERIES
              : false,
        },
        grantedAuthorities: aOptions.authorities,
      };

      let options = {
        method: "PUT",
        uri: this.getBaseURL() + "/rest/security/user/" + aOptions.username,
        headers: {
          Accept: "application/json, text/plain, */*", // application/sparql-results+json,
          "Content-Type": "application/json;charset=UTF-8",
          // "X-GraphDB-Repository":
          // 	this.getRepository(),
          Authorization: this.getAuthorization(),
          "X-GraphDB-Password": aOptions.password,
        },
        body: config,
        json: true,
      };
      try {
        let resp = await this.execRequest(options);
        resolve(resp);
      } catch (err) {
        reject(err);
      }
    });
  },

  deleteUser: async function (aOptions) {
    aOptions = aOptions || {};

    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      let lOptions = {
        method: "DELETE",
        uri: this.getBaseURL() + "/rest/security/user/" + aOptions.user,
        json: true,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: this.getAuthorization(),
        },
      };
      try {
        var resp = await this.execRequest(lOptions);
        resolve(resp);
      } catch (err) {
        reject(err);
      }
    });
  },

  deleteRepository: async function (aOptions) {
    aOptions = aOptions || {};

    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      let lOptions = {
        method: "DELETE",
        uri: this.getBaseURL() + "/rest/repositories/" + aOptions.id,
        json: true,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: this.getAuthorization(),
        },
      };

      try {
        var resp = await this.execRequest(lOptions);
        resolve(resp);
      } catch (err) {
        reject(err);
      }
    });
  },

  downloadToText: async function (aOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      aOptions = aOptions || {};
      aOptions.repository = aOptions.repository || this.getRepository();
      aOptions.format =
        aOptions.format || EnapsoGraphDBClient.FORMAT_TURTLE.type;
      let lOptions = {
        method: "GET",
        headers: this.getHeaders(),
        uri:
          this.getBaseURL() +
          "/repositories/" +
          aOptions.repository +
          "/statements" +
          "?infer=" +
          (aOptions.inference ? "true" : "false") +
          "&Accept=" +
          encodeURIComponent(aOptions.format) +
          (aOptions.context
            ? "&context=" + encodeURIComponent("<" + aOptions.context) + ">"
            : ""),
      };

      try {
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  downloadToFile: async function (aOptions) {
    aOptions = aOptions || {};

    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}
      // todo: here the format must be selectable!

      try {
        aOptions.filename =
          aOptions.filename ||
          "statements" + EnapsoGraphDBClient.FORMAT_TURTLE.extension;
        var lRes = await this.downloadToText(aOptions);
        if (lRes.success) {
          // todo: error handling and make it asynchronous
          fs.writeFileSync(aOptions.filename, lRes.data);
          resolve(lRes);
        }
      } catch (err) {
        reject(err);
      }
    });
  },

  // empty the entire repository including all its named graphs
  // caution! this operation cannot be undone!
  clearRepository: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      try {
        let lRes = await this.update(`CLEAR ALL`);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  // get locations (requires repositoty manager role)
  getLocations: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}
      let lOptions = {
        method: "GET",
        uri: this.getBaseURL() + "/rest/locations",
        headers: this.getHeaders(),
        json: true,
      };

      try {
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  // get users and their roles  (requires admin role)
  getUsers: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      let lOptions = {
        method: "GET",
        uri: this.getBaseURL() + "/rest/security/user",
        headers: this.getHeaders(),
        json: true,
      };

      try {
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  // get the contexts (named graphs of the repository)
  getContexts: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      let lOptions = {
        method: "GET",
        uri:
          this.getBaseURL() +
          "/repositories/" +
          this.getRepository() +
          "/contexts",
        headers: this.getHeaders(),
        json: true,
      };
      var lRes = await request(lOptions);
      // transform the bindings into a more convenient result format (optional)
      lRes = EnapsoGraphDBClient.transformBindingsToResultSet(lRes, {
        // drop the prefixes for easier resultset readability (optional)
        dropPrefixes: false,
      });

      try {
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  // remove the entire context (named graph) of the repository
  // caution! this operation cannot be undone!
  clearContext: async function (options) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}
      options = options || {};
      if (typeof options === "string") {
        options = {
          context: options,
        };
      }
      options.context = options.context || this.getDefaultContext();
      let sparql = `clear graph <${options.context}>`;

      try {
        let res = await this.update(sparql);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },

  // remove the entire shacl context (named graph) of the repository
  // caution! this operation cannot be undone!
  dropShaclGraph: async function (options) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}
      options = options || {};
      if (typeof options === "string") {
        options = {
          context: options,
        };
      }
      // this is the reserved graph name in GraphDB from version 9.1:
      options.context =
        options.context || "http://rdf4j.org/schema/rdf4j#SHACLShapeGraph";
      let sparql = `drop graph <${options.context}>`;

      try {
        let res = await this.update(sparql);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },

  // get locations (requires repositoty manager role)
  getSavedQueries: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}
      let lOptions = {
        method: "GET",
        uri: this.getBaseURL() + "/rest/sparql/saved-queries",
        headers: this.getHeaders(),
        json: true,
      };

      try {
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
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
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}
      let lOptions = {
        method: "GET",
        uri: this.getBaseURL() + "/rest/monitor/resource",
        headers: this.getHeaders(),
        json: true,
      };

      try {
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
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
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      try {
        let lOptions = {
          method: "GET",
          uri: this.getBaseURL() + "/rest/monitor/query",
          headers: this.getHeaders(),
          json: true,
        };
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  getQueryCount: async function () {
    let lOptions = {
      method: "GET",
      uri: this.getBaseURL() + "/rest/monitor/query/count",
      headers: this.getHeaders(),
      json: true,
    };
    var lRes = this.execRequest(lOptions);
    return lRes;
  },

  getImports: async function () {
    let lOptions = {
      method: "GET",
      uri:
        this.getBaseURL() + "/rest/data/import/active/" + this.getRepository(),
      headers: this.getHeaders(),
      json: true,
    };
    var lRes = this.execRequest(lOptions);
    return lRes;
  },

  performGarbageCollection: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      try {
        let lOptions = {
          method: "POST",
          uri: this.getBaseURL() + "/rest/monitor/resource/gc",
          headers: this.getHeaders(),
          json: true,
        };
        var lRes = this.execRequest(lOptions);
        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },

  wait: async function (aMilliseconds) {
    let lPromise = new Promise(function (resolve) {
      setTimeout(function () {
        resolve({ ok: 200 });
      }, aMilliseconds);
    });
    return lPromise;
  },

  waitForGraphDB: async function (aOptions) {
    aOptions = aOptions || {};
    if (!aOptions.memoryWatermark) {
      aOptions.memoryWatermark = 0.8;
    }
    if (!aOptions.cpuWatermark) {
      aOptions.cpuWatermark = 0.8;
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

    let lPromise = new Promise(async (resolve) => {
      let lStarted = new Date().getTime();
      let lTimeout = lStarted + aOptions.timeout;
      let lResources, lYetAgain;
      do {
        lResources = await this.getResources();
        if (aOptions.callback) {
          aOptions.callback(lResources);
        }
        lYetAgain = new Date().getTime() < lTimeout;
        if (lYetAgain) {
          await this.wait(aOptions.interval);
        }
      } while (lYetAgain);
      // perform garbage collection on demand
      if (aOptions.performGarbageCollection) {
        let lGCRes = await this.performGarbageCollection();
        if (aOptions.callback) {
          aOptions.callback(lGCRes);
        }
      }
      resolve({
        data: lResources,
      });
    });

    return lPromise;
  },

  upload: async function (aOptions) {
    aOptions = aOptions || {};
    let lConfig = {
      baseURI: aOptions.baseIRI,
      context: aOptions.context,
      data: aOptions.data,
      forceSerial: false,
      format: aOptions.format,
      message: "message",
      name: aOptions.filename,
      parserSettings: {
        failOnUnknownDataTypes: false,
        failOnUnknownLanguageTags: false,
        normalizeDataTypeValues: false,
        normalizeLanguageTags: false,
        preserveBNodeIds: false,
        stopOnError: false,
        verifyDataTypeValues: false,
        verifyLanguageTags: false,
        verifyRelativeURIs: false,
        verifyURISyntax: false,
      },
      replaceGraphs: [],
      status: "NONE",
      timestamp: 0,
      type: "text",
    };

    let options = {
      method: "POST",
      uri:
        this.getBaseURL() +
        "/rest/data/import/upload/" +
        this.getRepository() +
        "/text",
      body: lConfig,
      headers: this.getHeaders(),
      json: true,
    };

    let resp = await this.execRequest(options);

    let uploadResp = await this.waitForUploadResponse();
    resp.uploadResponse = uploadResp;

    return resp;
  },

  // upload a file to graphdb
  uploadFromFile: async function (options) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      let buffer;
      try {
        buffer = fs.readFileSync(options.filename, "utf8");
      } catch (err) {
        reject({
          statusCode: 400,
          message: err.message,
          success: false,
        });
      }

      try {
        var res = await this.upload({
          data: buffer,
          format: options.format,
          baseIRI: options.baseIRI,
          context: options.context,
          filename: options.filename,
        });
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },

  uploadFromURL: async function (aOptions) {
    var lRes = await this.upload({
      data: aOptions.URL,
      format: aOptions.format,
      baseURI: aOptions.baseURI,
      context: aOptions.context,
    });
    return lRes;
  },

  uploadFromData: async function (aOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loginStatus;
      } catch (e) {}

      try {
        var lRes = await this.upload({
          data: aOptions.data,
          format: aOptions.format,
          baseURI: aOptions.baseURI,
          context: aOptions.context,
        });

        resolve(lRes);
      } catch (err) {
        reject(err);
      }
    });
  },
};

// extend the enapso GraphDB client by the additional Admin features
for (let key in EnapsoGraphDBAdmin) {
  EnapsoGraphDBClient.Endpoint.prototype[key] = EnapsoGraphDBAdmin[key];
}

module.exports = EnapsoGraphDBAdmin;
