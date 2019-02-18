// Innotrade Enapso GraphDB Admin
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

const https = require('https');
const http = require('http');
const fs = require("fs");
const request = require('request-promise');

const EnapsoGraphDBAdmin = {

    USERNAME: process.env.GRAPHDB_USERNAME,
    PASSWORD: process.env.GRAPHDB_PASSWORD,
    REPOSITORY: process.env.GRAPHDB_REPOSITORY,
    BASEURL: process.env.GRAPHDB_BASEURL,

    uploadFromURL: async function (aOptions) {
        aOptions = aOptions || {};
        let lFromURL = aOptions.url;
        let lRepository = aOptions.repository || this.REPOSITORY;
        let lUsername = aOptions.username || this.USERNAME;
        let lPassword = aOptions.password || this.PASSWORD;
        let lBaseURL = aOptions.baseURL || this.BASEURL;
        let lBaseURI = aOptions.baseURI;
        let lFormat = aOptions.format;
        let lName = aOptions.name;

        let lConfig = {
            "baseURI": lBaseURI,
            "context": "",
            "data": lFromURL,
            "forceSerial": true,
            "format": lFormat,
            "message": 'message',
            "name": lName,
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

        if (lUsername && lPassword) {
            lHeaders.Authorization =
                'Basic ' + Buffer.from(lUsername + ':' + lPassword).toString('base64');
        }

        let options = {
            method: 'POST',
            uri: lBaseURL + '/rest/data/import/upload/' + lRepository + '/url',
            body: lConfig,
            headers: lHeaders,
            json: true
        };

        return request(options);
    }

}

module.exports = EnapsoGraphDBAdmin;