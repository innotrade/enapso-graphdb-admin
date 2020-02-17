// Innotrade Enapso GraphDB Admin Example
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// require the Enapso GraphDB Admin Demo module
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { EnapsoGraphDBAdmin } = require('../index');

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

console.log("Innotrade Enapso GraphDB Admin Demo, (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany");

const EnapsoGraphDBAdminDemo = {

	graphDBEndpoint: null,
	authentication: null,
	createRepository: async function (reponame,uri) {
		let resp = await EnapsoGraphDBAdmin.createRepository({
			id: reponame,
			uri:uri});
		console.log("Create Repo:" + JSON.stringify(resp, null, 2));
	},
	deleteRepository: async function (reponame,uri) {
		let resp = await EnapsoGraphDBAdmin.deleterepo({
			repo: reponame,
		uri:uri});
		console.log("Delete Repo:" + JSON.stringify(resp, null, 2));
	},

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
		// CAUTION! This operation empties the entire repository 
		// and cannot be undone!
		let resp = await this.graphDBEndpoint.clearRepository();
		console.log("\nClearRepository :\n" + JSON.stringify(resp, null, 2));
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
		// CAUTION! This operation empties the named graph 
		// of the repository and cannot be undone!
		let resp = await this.graphDBEndpoint.clearContext(
			GRAPHDB_CONTEXT_TEST);
		console.log("\nClearContext :\n" +
			JSON.stringify(resp, null, 2));
		return;
	},

	demoGetSavedQueries: async function () {
		// clear context (named graph)
		// CAUTION! This operation empties the named graph 
		// of the repository and cannot be undone!
		let resp = await this.graphDBEndpoint.getSavedQueries();
		console.log("\nGetSavedQueries :\n" +
			JSON.stringify(resp, null, 2));
		return;
	},

	demoUploadFromFile: async function () {
		// upload a file
		let resp = await this.graphDBEndpoint.uploadFromFile({
			filename: "ontologies/Test.owl",
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

	demoInsert: async function () {
		// perform an update (insert operation)
		let update = `
            prefix et: <http://ont.enapso.com/test#>
            insert data {
                graph <${GRAPHDB_CONTEXT_TEST}> {
                    et:TestClass rdf:type owl:Class
                }
            }
        `;
		let resp = await this.graphDBEndpoint.update(update);
		// if a result was successfully returned
		if (resp.success) {
			console.log("Update succeeded:\n" + JSON.stringify(resp, null, 2));
		} else {
			console.log("Update failed:\n" + JSON.stringify(resp, null, 2));
		}
	},

	demoUpdate: async function () {
		// perform an update (update operation)
		let update = `
            prefix et: <http://ont.enapso.com/test#>
            with <${GRAPHDB_CONTEXT_TEST}>
            delete {
                et:TestClass rdf:type owl:Class
            }
            insert {
                et:TestClassUpdated rdf:type owl:Class
            }
            where {
                et:TestClass rdf:type owl:Class
            }
        `;
		let resp = await this.graphDBEndpoint.update(update);
		// if a result was successfully returned
		if (resp.success) {
			console.log("Update succeeded:\n" + JSON.stringify(resp, null, 2));
		} else {
			console.log("Update failed:\n" + JSON.stringify(resp, null, 2));
		}
	},

	demoDelete: async function () {
		// perform an update (delete operation)
		let update = `
            prefix et: <http://ont.enapso.com/test#>
            with <http://ont.enapso.com/test>
            delete {
                et:TestClassUpdated rdf:type owl:Class
            }
            where {
                et:TestClassUpdated rdf:type owl:Class
            }
        `;
		let resp = await this.graphDBEndpoint.update(update);
		// if a result was successfully returned
		if (resp.success) {
			console.log("Update succeeded:\n" + JSON.stringify(resp, null, 2));
		} else {
			console.log("Update failed:\n" + JSON.stringify(resp, null, 2));
		}
	},

	demoPerformGarbageCollection: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.performGarbageCollection();
		console.log("\nGarbage Collection:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoGetResources: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.getResources();
		console.log("\nResources:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoWaitForGraphDB: async function () {
		// lists all contexts (named graph) in the repository
		console.log("\nWaiting for GraphDB...");
		let resp = await this.graphDBEndpoint.waitForGraphDB({
			timeout: 10000,			// wait at most 10 seconds
			interval: 2000,			// check resources all 2 seconds
			cpuWatermark: 0.8,
			memoryWatermark: 0.7,
			performGarbageCollection: true,
			callback: function (aEvent) {
				console.log(JSON.stringify(aEvent));
			}
		});
		console.log("Wait for GraphDB:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoGetQuery: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.getQuery();
		console.log("\nGet Query:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demo: async function () {
	/*	this.graphDBEndpoint = await this.createEndpoint();
		this.authentication = await this.login();
		// verify authentication
		if (!this.authentication.success) {
			console.log("\nLogin failed:\n" +
				JSON.stringify(this.authentication, null, 2));
			return;
		}
		console.log("\nLogin successful");
*/

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
		// this.demoGetSavedQueries();

		// this.demoUploadFromFile();
		// this.demoDownloadToFile();
		// this.demoDownloadToText();

        /*
        console.log("--- Inserting new triple --- ")
		await this.demoInsert();
		*/
		//console.log("--- Graph should contain TestClass now --- ")
		//await this.demoQuery();
		/*
        // await this.demoDownloadToFile();
        console.log("--- Updating existing triple --- ")
        await this.demoUpdate();
        console.log("--- Graph should contain TestClassUpdated now --- ")
        await this.demoQuery();
        console.log("--- Deleting existing triple --- ")
        await this.demoDelete();
        console.log("--- Graph should not contain TestClassUpdated anymore --- ")
        await this.demoQuery();
        */

		/*
	   await this.demoGetResources();
	   await this.demoPerformGarbageCollection();
	   await this.demoGetResources();
	   */
	// await this.createRepository("Test1",'http://localhost:7200');
		
	 await this.deleteRepository("Test1",'http://localhost:7200'); 
	  /*
		console.log("Start: " + new Date().toISOString());
		await this.demoWaitForGraphDB();
		console.log("Finish: " + new Date().toISOString());
		*/

		// await this.demoGetQuery();
	}
}

EnapsoGraphDBAdminDemo.demo();