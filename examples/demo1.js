// Innotrade Enapso GraphDB Admin Demo
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

const EnapsoGraphDBClient = require("enapso-graphdb-client");
const EnapsoGraphDBAdmin = require("../enapso-graphdb-admin");

// connection data to the running GraphDB instance
const
    GRAPHDB_BASE_URL = 'http://localhost:7200',
    GRAPHDB_REPOSITORY = 'Test',
    GRAPHDB_USERNAME = 'Test',
    GRAPHDB_PASSWORD = 'Test',
    GRAPHDB_TEST_CONTEXT = 'http://ont.enapso.com/test'
    ;

// the default prefixes for all SPARQL queries
const GRAPHDB_DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS
];

const EnapsoGraphDBAdminDemo = {

    GRAPHDB_BASE_URL: GRAPHDB_BASE_URL,
    GRAPHDB_REPOSITORY: GRAPHDB_REPOSITORY,
    GRAPHDB_USERNAME: GRAPHDB_USERNAME,
    GRAPHDB_PASSWORD: GRAPHDB_PASSWORD,
    GRAPHDB_TEST_CONTEXT: GRAPHDB_TEST_CONTEXT,
    GRAPHDB_DEFAULT_PREFIXES: GRAPHDB_DEFAULT_PREFIXES,

    // instantiate the GraphDB endpoint
    graphDBEndpoint: new EnapsoGraphDBClient.Endpoint({
        baseURL: GRAPHDB_BASE_URL,
        repository: GRAPHDB_REPOSITORY,
        prefixes: GRAPHDB_DEFAULT_PREFIXES
    }),

    getEndpoint: function() {
        return this.graphDBEndpoint;
    },

    uploadFileDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.uploadFromFile({
            filename: "ontologies/test.owl",
            format: "application/rdf+xml",
            baseURI: "http://ont.enapso.com/test#",
            context: "http://ont.enapso.com/test"
        });
        return {
            message: lRes
        };
    },

    downloadToTextDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.downloadRepositoryToText({
            repository: GRAPHDB_REPOSITORY,
            format: EnapsoGraphDBClient.FORMAT_TURTLE.type,
            context: "http://ont.enapso.com/test"
        });
        return lRes;
    },

    downloadToFileDemo: async function () {
        let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
        var lRes = await EnapsoGraphDBAdmin.downloadRepositoryToFile({
            repository: GRAPHDB_REPOSITORY,
            format: lFormat.type,
            context: "http://ont.enapso.com/test",
            filename: "ontologies/test" + lFormat.extension
        });
        return lRes;
    },

    getRepositoriesDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.getRepositories({
        });
        return lRes;
    },

    clearRepositoryDemo: async function () {
        let lRes = await EnapsoGraphDBAdmin.clearRepository({
            repository: GRAPHDB_REPOSITORY
        });
        return lRes;
    },

    getLocationsDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.getLocations({
        });
        return lRes;
    },

    getUsersDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.getUsers({
        });
        return lRes;
    },

    getContextsDemo: async function () {
        let lRes = await EnapsoGraphDBAdmin.getContexts({
            repository: GRAPHDB_REPOSITORY
        });
        return lRes;
    },

    clearContextDemo: async function () {
        let lRes = await EnapsoGraphDBAdmin.clearContext({
            repository: GRAPHDB_REPOSITORY,
            context: GRAPHDB_TEST_CONTEXT
        });
        return lRes;
    },

    queryDemo: async function() {
        let query = `
            select * 
                FROM <${GRAPHDB_TEST_CONTEXT}>
            where {
                ?s ?p ?o
            }
        `;
        let resultset, binding = await this.graphDBEndpoint.query(query);
        // if a result was successfully returned
        if (binding.success) {
            // transform the bindings into a more convenient result format (optional)
            resultset = EnapsoGraphDBClient.transformBindingsToResultSet(binding, {
                // drop the prefixes for easier resultset readability (optional)
                dropPrefixes: false
            });
        }
        return resultset;
    }

};

module.exports = EnapsoGraphDBAdminDemo;