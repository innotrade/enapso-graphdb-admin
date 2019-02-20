// Innotrade Enapso GraphDB Admin Automated Test Suite
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

const EnapsoGraphDBClient = require("enapso-graphdb-client");
const EnapsoGraphDBAdmin = require("../enapso-graphdb-admin");

// connection data to the running GraphDB instance
const
    GRAPHDB_QUERY_URL = 'http://localhost:7200/repositories/Test',
    GRAPHDB_UPDATE_URL = 'http://localhost:7200/repositories/Test/statements',
    GRAPHDB_REPOSITORY = 'Test',
    GRAPHDB_USERNAME = 'Test',
    GRAPHDB_PASSWORD = 'Test';

// the default prefixes for all SPARQL queries
const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS
];

const EnapsoGraphDBAdminDemo = {

    // instantiate the GraphDB endpoint
    graphDBEndpoint: new EnapsoGraphDBClient.Endpoint({
        queryURL: GRAPHDB_QUERY_URL,
        updateURL: GRAPHDB_UPDATE_URL,
        username: GRAPHDB_USERNAME,
        password: GRAPHDB_PASSWORD,
        prefixes: DEFAULT_PREFIXES
    }),

    uploadFileDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.uploadFromFile({
            filename: 'ontologies/test.owl',
            format: "application/rdf+xml",
            baseURI: "http://ont.enapso.com/test#",
            context: "http://ont.enapso.com/test"
        });
        return { 
            message: lRes
        };
    },

    getRepositoriesDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.getRepositories({
        });
        return lRes;
    },

    getLocationsDemo: async function () {
        var lRes = await EnapsoGraphDBAdmin.getLocations({
        });
        return lRes;
    },

    getContextsDemo: async function () {
        let lRes = await EnapsoGraphDBAdmin.getContexts({
            repository: GRAPHDB_REPOSITORY
        });
        return lRes;
    },

    queryDemo: async function() {
        let query = `
            select * 
                FROM <http://ont.enapso.com/test>
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