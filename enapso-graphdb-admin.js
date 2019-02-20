// Innotrade Enapso GraphDB Admin
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// For further detalils please also refer to the GraphDB admin documentation at: http://localhost:7200/webapi
// http://graphdb.ontotext.com/documentation/free/devhub/workbench-rest-api/location-and-repository-tutorial.html

const https = require('https');
const http = require('http');
const fs = require("fs");
const request = require('request-promise');

// require the Enapso GraphDB Client package
const EnapsoGraphDBClient = require("enapso-graphdb-client");

const EnapsoGraphDBAdmin = {

    QUERY_URL: process.env.GRAPHDB_QUERY_URL || 'http://localhost:7200/repositories/{repositoryID}',
    UPDATE_URL: process.env.GRAPHDB_UPDATE_URL || 'http://localhost:7200/repositories/{repositoryID}/statements',
    USERNAME: process.env.GRAPHDB_USERNAME || "Test",
    PASSWORD: process.env.GRAPHDB_PASSWORD || "Test",
    REPOSITORY: process.env.GRAPHDB_REPOSITORY || "Test",
    BASEURL: process.env.GRAPHDB_BASEURL || "http://localhost:7200",
    DEFAULT_PREFIXES: [
        EnapsoGraphDBClient.PREFIX_OWL,
        EnapsoGraphDBClient.PREFIX_RDF,
        EnapsoGraphDBClient.PREFIX_RDFS
    ],

    // the GraphDB endpoint for queries and updates
    graphDBEndpoints: {},

    // instantiate the GraphDB endpoint 
    getGraphDBEndpoint: function (aOptions = { repository: this.REPOSITORY }) {
        let lRepo = aOptions.repository;
        if (!this.graphDBEndpoints[lRepo]) {
            this.graphDBEndpoints[lRepo] =
                new EnapsoGraphDBClient.Endpoint({
                    queryURL: this.QUERY_URL.replace(/\{repositoryID\}/ig, lRepo),
                    updateURL: this.UPDATE_URL.replace(/\{repositoryID\}/ig, lRepo),
                    username: this.USERNAME,
                    password: this.PASSWORD,
                    prefixes: this.DEFAULT_PREFIXES
                });
        }
        return this.graphDBEndpoints[lRepo];
    },

    getRepositories: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.BASEURL + '/rest/repositories',
            headers: {
                'Accept': 'application/sparql-results+json,application/json',
            },
            json: true
        };
        return request(options);
    },

    downloadRepository: async function (aOptions = { repository: "Test", format: EnapsoGraphDBClient.FORMAT_TURTLE }) {
        let options = {
            method: 'GET',
            uri: this.BASEURL + '/repositories/' + aOptions.repository + '/statements'
                + '?infer=false&Accept=' + encodeURIComponent(aOptions.format.type)
        };
        return request(options);
    },

    clearRepository: async function (aOptions = { repository: "Test" }) {
        let lEndpoint = this.getGraphDBEndpoint({ repository: aOptions.repository });
        let lRes = lEndpoint.update(
            `CLEAR ALL`
        );
        return lRes;
    },

    getLocations: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.BASEURL + '/rest/locations',
            headers: {
                'Accept': 'application/sparql-results+json,application/json',
            },
            json: true
        };
        return request(options);
    },

    getUsers: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.BASEURL + '/rest/security/user',
            headers: {
                'Accept': 'application/sparql-results+json,application/json',
            },
            json: true
        };
        return request(options);
    },

    getContexts: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.BASEURL + "/repositories/" + aOptions.repository + "/contexts",
            headers: {
                'Accept': 'application/sparql-results+json,application/json',
            },
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
        let lEndpoint = this.getGraphDBEndpoint({ repository: aOptions.repository });
        let lRes = lEndpoint.update(
            `CLEAR GRAPH <${aOptions.context}>`
        );
        return lRes;
    },

    upload: async function (aOptions) {
        aOptions = aOptions || {};
        /*
        let lFromURL = aOptions.url;
        let lRepository = aOptions.repository || this.REPOSITORY;
        let lUsername = aOptions.username || this.USERNAME;
        let lPassword = aOptions.password || this.PASSWORD;
        let lBaseURL = aOptions.baseURL || this.BASEURL;
        let lBaseURI = aOptions.baseURI;
        let lFormat = aOptions.format;
        let lName = aOptions.name;
        */

        let lConfig = {
            "baseURI": aOptions.baseURI,
            "context": aOptions.context,
            "data": aOptions.data,  // lFromURL
            "forceSerial": true,
            "format": aOptions.format, // lFormat,
            "message": 'message',
            "name": "", // lName,
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
            "status": "PENDING",
            "timestamp": 0,
            "type": "free"
        };

        let lHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (this.USERNAME && this.PASSWORD) {
            lHeaders.Authorization =
                'Basic ' + Buffer.from(this.USERNAME + ':' + this.PASSWORD).toString('base64');
        }

        let options = {
            method: 'POST',
            // uri: this.BASEURL + '/rest/data/import/upload/' + this.REPOSITORY, // + '/url',
            uri: this.BASEURL + '/rest/data/import/upload/' + this.REPOSITORY + '/text',
            body: lConfig,
            headers: lHeaders,
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

module.exports = EnapsoGraphDBAdmin;
