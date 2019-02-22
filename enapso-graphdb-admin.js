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

    BASE_URL: process.env.GRAPHDB_BASE_URL || 'http://localhost:7200',
    USERNAME: process.env.GRAPHDB_USERNAME || "Test",
    PASSWORD: process.env.GRAPHDB_PASSWORD || "Test",
    REPOSITORY: process.env.GRAPHDB_REPOSITORY || "Test",

    DEFAULT_PREFIXES: [
        EnapsoGraphDBClient.PREFIX_OWL,
        EnapsoGraphDBClient.PREFIX_RDF,
        EnapsoGraphDBClient.PREFIX_RDFS
    ],

    // the GraphDB endpoint for queries and updates
    mEndpoints: {},

    // instantiate the GraphDB endpoint 
    getEndpoint: function (aRepository) {
        if (!this.mEndpoints[aRepository]) {
            this.mEndpoints[aRepository] =
                new EnapsoGraphDBClient.Endpoint({
                    baseURL: this.BASE_URL,
                    repository: aRepository,
                    prefixes: this.DEFAULT_PREFIXES
                });
        }
        return this.mEndpoints[aRepository];
    },

    getHeaders: function (aOptions = { repository: 'Test' }) {
        let lEndpoint = this.getEndpoint(aOptions.repository);
        return {
            "Accept":
                "application/sparql-results+json,application/json",
            "Content-Type":
                "application/json",
            "Authorization":
                lEndpoint.getAuthenticationHeader()
        }
    },

    getRepositories: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.BASE_URL + '/rest/repositories',
            headers: this.getHeaders(),
            json: true
        };
        return request(options);
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
            uri: this.BASEURL + '/repositories/' + aOptions.repository + '/statements'
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
            uri: this.BASEURL + '/rest/security/user',
            headers: this.getHeaders(),
            json: true
        };
        return request(options);
    },

    getContexts: async function (aOptions) {
        let options = {
            method: 'GET',
            uri: this.BASEURL + "/repositories/" + aOptions.repository + "/contexts",
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

        let options = {
            method: 'POST',
            // uri: this.BASEURL + '/rest/data/import/upload/' + this.REPOSITORY, // + '/url',
            uri: this.getEndpoint(this.REPOSITORY).getBaseURL() + '/rest/data/import/upload/' + this.REPOSITORY + '/text',
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

module.exports = EnapsoGraphDBAdmin;
