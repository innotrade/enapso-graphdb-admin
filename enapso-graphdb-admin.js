// Innotrade Enapso GraphDB Admin
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// For further detalils please also refer to the GraphDB admin documentation at: http://localhost:7200/webapi
// http://graphdb.ontotext.com/documentation/free/devhub/workbench-rest-api/location-and-repository-tutorial.html

const fs = require('fs');
const request = require('request-promise');

// require the Enapso GraphDB Client package
const EnapsoGraphDBClient = require('enapso-graphdb-client');

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

    execRequest: async function(aOptions) {
        var lRes;
        try {
            aOptions.resolveWithFullResponse = true;
            lRes = await request(aOptions);
            lRes = {
                "success": 200 === lRes.statusCode,
                "statusCode":  lRes.statusCode,
                "statusMessage":  
                    lRes.statusMessage ? 
                    lRes.statusMessage : 
                    (200 === lRes.statusCode ? "OK" : "ERROR " + lRes.statusCode),
                "data": lRes.body
            };
        } catch(lErr) {
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

    createRepository: async function(aOptions) {

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
        aOptions.filename = aOptions.filename || "statements" + EnapsooGraphDBClient.FORMAT_TURTLE.extension;
        var lRes = await this.downloadToText(aOptions);
        if(lRes.success) {
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
        if(typeof aOptions === "string") {
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

    upload: async function (aOptions) {
        aOptions = aOptions || {};
        let lConfig = {
            "baseURI": aOptions.baseIRI,
            "context": aOptions.context,
            "data": aOptions.data,
            "forceSerial": false,
            "format": aOptions.format,
            "message": 'message',
            "name": "",
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

        return request(options);
    },

    uploadFromFile: async function (aOptions) {
        let lBuffer = fs.readFileSync(aOptions.filename);
        var lRes = await this.upload({
            data: lBuffer.toString(),
            format: aOptions.format,
            baseIRI: aOptions.baseIRI,
            context: aOptions.context
        });
        return lRes;
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
for(let lKey in EnapsoGraphDBAdmin) {
    EnapsoGraphDBClient.Endpoint.prototype[lKey] = EnapsoGraphDBAdmin[lKey];
}

module.exports = EnapsoGraphDBAdmin;
