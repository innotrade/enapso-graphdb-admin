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

    // returns all repositories
    getRepositories: async function () {
        let lOptions = {
            "method": "GET",
            "uri": this.getBaseURL() + "/rest/repositories",
            "headers": this.getHeaders(),
            "json": true
        };
        return request(lOptions);
    },

    createRepository: async function(aOptions) {

    },

    downloadRepositoryToText: async function (aOptions = {
        repository: "Test",
        format: EnapsoGraphDBClient.FORMAT_TURTLE.type,
        context: null
    }) {
        let options = {
            method: 'GET',
            headers: this.getHeaders(),
            uri: this.getBaseURL() + '/repositories/' + aOptions.repository + '/statements'
                + '?infer=false&Accept=' + encodeURIComponent(aOptions.format)
                + (aOptions.context ? '&context=' + encodeURIComponent('<' + aOptions.context) + '>' : '')
        };
        return request(options);
    },

    downloadRepositoryToFile: async function (aOptions = {
        repository: "Test",
        format: EnapsoGraphDBClient.FORMAT_TURTLE.type,
        context: null,
        filename: "statements" + EnapsooGraphDBClient.FORMAT_TURTLE.extension
    }) {
        var lRes = await this.downloadRepositoryToText(aOptions);
        // todo: Implement error handling
        fs.writeFileSync(aOptions.filename, lRes);
        return lRes;
    },

    clearRepository: async function (aOptions = { repository: "Test" }) {
        let lEndpoint = this.getEndpoint({ repository: aOptions.repository });
        let lRes = lEndpoint.update(
            `CLEAR ALL`
        );
        return lRes;
    },

    getLocations: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.BASEURL + '/rest/locations',
            headers: this.getHeaders(),
            json: true
        };
        return request(options);
    },

    getUsers: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.getBaseURL() + '/rest/security/user',
            headers: this.getHeaders(),
            json: true
        };
        return request(options);
    },

    getContexts: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.getBaseURL() + "/repositories/" + aOptions.repository + "/contexts",
            headers: this.getHeaders(),
            json: true
        };
        var lRes = await request(options);
        // transform the bindings into a more convenient result format (optional)
        lRes = EnapsoGraphDBClient.transformBindingsToResultSet(lRes, {
            // drop the prefixes for easier resultset readability (optional)
            dropPrefixes: false
        });
        return lRes;
    },

    clearContext: async function (aOptions = { repository: "Test", context: "Test" }) {
        let lEndpoint = this.getEndpoint({ repository: aOptions.repository });
        let lRes = lEndpoint.update(
            `CLEAR GRAPH <${aOptions.context}>`
        );
        return lRes;
    },

    upload: async function (aOptions) {
        aOptions = aOptions || {};
        let lConfig = {
            "baseURI": aOptions.baseURI,
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
            baseURI: aOptions.baseURI,
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
