// Innotrade Enapso GraphDB Admin Example
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// require the Enapso GraphDB Admin Demo module
const EnapsoGraphDBClient = require("enapso-graphdb-client");
const EnapsoGraphDBAdmin = require("../enapso-graphdb-admin");

// connection data to the running GraphDB instance
const
    GRAPHDB_BASE_URL = 'http://localhost:7200',
    GRAPHDB_REPOSITORY = 'Test',
    GRAPHDB_USERNAME = 'Test',
    GRAPHDB_PASSWORD = 'Test',
    GRAPHDB_CONTEXT_TEST = 'http://ont.enapso.com/test'

// the default prefixes for all SPARQL queries
const GRAPHDB_DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS
];

console.log("Enapso GraphDB Admin Demo");

const EnapsoGraphDBAdminDemo = {

    graphDBEndpoint: null,
    authentication: null,

    createEndpoint: async function () {
        // instantiate a new GraphDB endpoint
        return new EnapsoGraphDBClient.Endpoint({
            baseURL: GRAPHDB_BASE_URL,
            repository: GRAPHDB_REPOSITORY,
            prefixes: GRAPHDB_DEFAULT_PREFIXES
        });
    },

    login: async function () {
        // login into GraphDB using JWT
        let lRes = await this.graphDBEndpoint.login(
            GRAPHDB_USERNAME,
            GRAPHDB_PASSWORD
        );
        return lRes;
    },

    demoGetRepositories: async function () {
        // lists all repositories
        resp = await this.graphDBEndpoint.getRepositories();
        console.log("\nRepositories:\n" + JSON.stringify(resp, null, 2));
        return resp;
    },

    demoClearRepository: async function () {
        // clear entire repository
        // CAUTION! This operation empties the entire repository and cannot be undone!
        let resp = await this.graphDBEndpoint.clearRepository();
        console.log("\ClearRepository :\n" + JSON.stringify(resp, null, 2));
        return resp;
    },

    demoGetUsers: async function () {
        // lists all users (requires admin role)
        let resp = await this.graphDBEndpoint.getUsers();
        console.log("\nUsers:\n" + JSON.stringify(resp, null, 2));
        return resp;
    },

    demoGetLocations: async function () {
        // lists all locations, requires repository manager role!
        let resp = await this.graphDBEndpoint.getLocations();
        console.log("\nLocations:\n" + JSON.stringify(resp, null, 2));
        return resp;
    },

    demoGetContexts: async function () {
        // lists all contexts (named graph) in the repository
        let resp = await this.graphDBEndpoint.getContexts();
        console.log("\nContexts:\n" + JSON.stringify(resp, null, 2));
        return resp;
    },

    demoClearContext: async function () {
        // clear context (named graph)
        // CAUTION! This operation empties the named graph of the repository and cannot be undone!
        let resp = await this.graphDBEndpoint.clearContext(GRAPHDB_CONTEXT_TEST);
        console.log("\ClearContext :\n" + JSON.stringify(resp, null, 2));
        return;
    },

    demoUploadFromFile: async function () {
        // upload a file
        let resp = await this.graphDBEndpoint.uploadFromFile({
            filename: "ontologies/test.owl",
            format: "application/rdf+xml",
            baseIRI: "http://ont.enapso.com/test#",
            context: "http://ont.enapso.com/test"
        });
        console.log("\nUploadFromFile:\n" + JSON.stringify(resp, null, 2));
        return resp;
    },

    demoDownloadToFile: async function () {
        // download a repository or named graph to file
        let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
        let resp = await this.graphDBEndpoint.downloadToFile({
            format: lFormat.type,
            filename: "ontologies/" +
                this.graphDBEndpoint.getRepository() +
                lFormat.extension
        });
        console.log("\nDownload (file):\n" +
            JSON.stringify(resp, null, 2));
        return resp;
    },

    demoDownloadToText: async function () {
        // download a repository or named graph to memory
        resp = await this.graphDBEndpoint.downloadToText({
            format: EnapsoGraphDBClient.FORMAT_TURTLE.type
        });
        console.log("\nDownload (text):\n" + 
            JSON.stringify(resp, null, 2));
        return resp;
    },

    demoQuery: async function () {
        // perform a query
        let query = `
        select * 
            from <${GRAPHDB_CONTEXT_TEST}>
        where {
            ?s ?p ?o
        } `;
        let binding = await this.graphDBEndpoint.query(query);
        // if a result was successfully returned
        if (binding.success) {
            // transform the bindings into a more convenient result format (optional)
            let resp = EnapsoGraphDBClient.transformBindingsToResultSet(binding, {
                // drop the prefixes for easier resultset readability (optional)
                dropPrefixes: false
            });
            console.log("Query succeeded:\n" + JSON.stringify(resp, null, 2));
        } else {
            console.log("Query failed:\n" + JSON.stringify(binding, null, 2));
        }
    },

    demo: async function () {
        this.graphDBEndpoint = await this.createEndpoint();
        this.authentication = await this.login();
        // verify authentication
        if (!this.authentication.success) {
            console.log("\nLogin failed:\n" +
                JSON.stringify(this.authentication, null, 2));
            return;
        }
        console.log("\nLogin successful");

        // clear entire repository
        // CAUTION! This operation empties the entire repository and cannot be undone!
        // this.demoClearRepository();

        // clear entire context (named graph)
        // CAUTION! This operation empties the entire context (named graph) and cannot be undone!
        // this.demoClearContext();

        // this.demoGetRepositories();

        // getLocations requires repository manager role!
        // this.demoGetLocations();

        // getUsers requires admin role!
        // this.demoGetUsers();

        // this.demoGetContexts();

        this.demoUploadFromFile();

        // this.demoDownloadToFile();

        // this.demoDownloadToText();

        // this.demoQuery();
    }
}

EnapsoGraphDBAdminDemo.demo();