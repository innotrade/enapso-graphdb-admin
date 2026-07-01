// Innotrade ENAPSO - Graph Database Admin Example (QLever)
// (C) Copyright 2021-2025 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s): Alexander Schulze and Muhammad Yasir
//
// QLever exposes no dedicated import / upload / replace REST endpoints. The admin
// layer therefore wraps the incoming data into SPARQL 1.1 Update statements
// (INSERT DATA / CLEAR) and runs them through the client. This demo exercises the
// operations that are supported for QLever.
require('@innotrade/enapso-config');
const fsPromises = require('fs').promises,
    { EnapsoGraphDBClient } = requireEx('@innotrade/enapso-graphdb-client'),
    { EnapsoGraphDBAdmin } = require('../index'),
    { EnapsoLogger, EnapsoLoggerFactory } = require('@innotrade/enapso-logger');
EnapsoLoggerFactory.createGlobalLogger('enLogger');
enLogger.setLevel(EnapsoLogger.ALL);

// connection data to the running QLever instance
const QLEVER_BASE_URL = encfg.getConfig(
        'enapsoDefaultQlever.baseUrl',
        'http://localhost:8888'
    ),
    QLEVER_REPOSITORY = encfg.getConfig('enapsoDefaultQlever.repository', 'Test'),
    QLEVER_CONTEXT_TEST = encfg.getConfig(
        'enapsoDefaultQlever.ContextTest',
        'http://ont.enapso.com/test'
    ),
    // QLever requires this access token for privileged operations such as
    // SPARQL Update (INSERT DATA / CLEAR); it is sent as an Authorization Bearer header
    QLEVER_ACCESS_TOKEN = encfg.getConfig(
        'enapsoDefaultQlever.accessToken',
        'j7ULHuWV3773'
    ),
    triplestore = 'qlever';

// the default prefixes for all SPARQL queries
const QLEVER_DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS
];

enLogger.info(
    'ENAPSO Graph Database Admin Demo (QLever)\n(C) Copyright 2021-2025 Innotrade GmbH, Herzogenrath, NRW, Germany'
);

const EnapsoQleverAdminDemo = {
    graphDBEndpoint: null,

    createEndpoint() {
        try {
            // instantiate a new Graph Database endpoint pointing at QLever
            return new EnapsoGraphDBClient.Endpoint({
                baseURL: QLEVER_BASE_URL,
                repository: QLEVER_REPOSITORY,
                prefixes: QLEVER_DEFAULT_PREFIXES,
                triplestore: triplestore
            });
        } catch (err) {
            console.log(err);
        }
    },

    // upload N-Triples data straight into a named graph via INSERT DATA
    async demoUploadFromData() {
        try {
            let data =
                '<http://ont.enapso.com/test#TestClass> ' +
                '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ' +
                '<http://www.w3.org/2002/07/owl#Class> .';
            let resp = await this.graphDBEndpoint.uploadFromData({
                data: data,
                context: QLEVER_CONTEXT_TEST,
                format: EnapsoGraphDBClient.FORMAT_N_TRIPLES.type
            });
            enLogger.info(
                '\nUploadFromData:\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    // upload an N-Triples file into a named graph
    async demoUploadFromFile() {
        try {
            let resp = await this.graphDBEndpoint.uploadFromFile({
                filename: 'ontologies/qlever-demo.nt',
                context: QLEVER_CONTEXT_TEST,
                format: EnapsoGraphDBClient.FORMAT_N_TRIPLES.type
            });
            enLogger.info(
                '\nUploadFromFile:\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    // demonstrate the preflight guard: a format QLever cannot inline is rejected
    // with a 415 response instead of a cryptic SPARQL parse error
    async demoRejectUnsupportedFormat() {
        try {
            let resp = await this.graphDBEndpoint.uploadFromData({
                data: '<a> <b> <c> .',
                context: QLEVER_CONTEXT_TEST,
                format: EnapsoGraphDBClient.FORMAT_RDF_XML.type
            });
            enLogger.info(
                '\nReject unsupported format (expected 415):\n' +
                    JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoQuery() {
        try {
            let query = `
        select *
            from <${QLEVER_CONTEXT_TEST}>
        where {
            ?s ?p ?o
        }`;
            let binding = await this.graphDBEndpoint.query(query);
            enLogger.info('\nQuery:\n' + JSON.stringify(binding, null, 2));
            return binding;
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetContexts() {
        try {
            // lists all contexts (named graphs) in the repository
            let resp = await this.graphDBEndpoint.getContexts();
            enLogger.info('\nContexts:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoClearContext() {
        try {
            // clear a single context (named graph) via CLEAR GRAPH
            // CAUTION! This operation cannot be undone!
            let resp =
                await this.graphDBEndpoint.clearContext(QLEVER_CONTEXT_TEST);
            enLogger.info('\nClearContext:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoClearRepository() {
        try {
            // clear the entire repository via CLEAR ALL
            // CAUTION! This operation cannot be undone!
            let resp = await this.graphDBEndpoint.clearRepository();
            enLogger.info(
                '\nClearRepository:\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demo() {
        this.graphDBEndpoint = await this.createEndpoint();

        // QLever's write operations (INSERT DATA / CLEAR) are privileged and
        // require the server access token, supplied as an Authorization Bearer header
        this.graphDBEndpoint.setAccessToken(QLEVER_ACCESS_TOKEN);

        // load data into a named graph, both from an inline string and from a file
        await this.demoUploadFromData();
        await this.demoUploadFromFile();

        // read it back
        await this.demoQuery();

        // list the named graphs
        await this.demoGetContexts();

        // show the format guard in action
        await this.demoRejectUnsupportedFormat();

        // clean up (uncomment to run — these operations cannot be undone!)
        // await this.demoClearContext();
        // await this.demoClearRepository();

        enLogger.info('\nDone');
    }
};

EnapsoQleverAdminDemo.demo();
