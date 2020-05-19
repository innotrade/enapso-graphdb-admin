// Innotrade Enapso GraphDB Admin Example
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany

// require the Enapso GraphDB Admin Demo module
const
	fsPromises = require('fs').promises,
	{ EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client'),
	{ EnapsoGraphDBAdmin } = require('../index'),
	{ EnapsoLogger, EnapsoLoggerFactory } = require('@innotrade/enapso-logger')
	;

EnapsoLoggerFactory.createGlobalLogger('enLogger');
enLogger.setLevel(EnapsoLogger.ALL);


// connection data to the running GraphDB instance
const
	GRAPHDB_BASE_URL = 'http://localhost:7200',
	GRAPHDB_REPOSITORY = 'Test',
	GRAPHDB_USERNAME = 'Test',
	GRAPHDB_PASSWORD = 'Test',
	GRAPHDB_CONTEXT_TEST = 'http://ont.enapso.com/test',
	GRAPHDB_CONTEXT_SHACL = 'http://rdf4j.org/schema/rdf4j#SHACLShapeGraph'

// the default prefixes for all SPARQL queries
const GRAPHDB_DEFAULT_PREFIXES = [
	EnapsoGraphDBClient.PREFIX_OWL,
	EnapsoGraphDBClient.PREFIX_RDF,
	EnapsoGraphDBClient.PREFIX_RDFS
];

enLogger.info("Innotrade Enapso GraphDB Admin Demo\n(C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany");

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

	demoCreateRepository: async function () {
		let resp = await this.graphDBEndpoint.createRepository({
			"id": "AutomatedTest",
			"title": "Enapso Automated Test Repository",
			"location": ""
		});
		enLogger.info("Create Repository:" + JSON.stringify(resp, null, 2));
	},

	demoDeleteRepository: async function () {
		let resp = await this.graphDBEndpoint.deleteRepository({
			"id": "AutomatedTest"
		});
		enLogger.info("Delete Repository:" + JSON.stringify(resp, null, 2));
	},

	demoGetRepositories: async function () {
		// lists all repositories
		resp = await this.graphDBEndpoint.getRepositories();
		enLogger.info("\nRepositories:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoClearRepository: async function () {
		// clear entire repository
		// CAUTION! This operation empties the entire repository 
		// and cannot be undone!
		let resp = await this.graphDBEndpoint.clearRepository();
		enLogger.info("\nClearRepository :\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoDropShaclGraph: async function () {
		// clear entire repository
		// CAUTION! This operation empties the entire repository 
		// and cannot be undone!
		let resp = await this.graphDBEndpoint.dropShaclGraph();
		enLogger.info("\nDropShaclGraph :\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoGetUsers: async function () {
		// lists all users (requires admin role)
		let resp = await this.graphDBEndpoint.getUsers();
		enLogger.info("\nUsers:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoGetLocations: async function () {
		// lists all locations, requires repository manager role!
		let resp = await this.graphDBEndpoint.getLocations();
		enLogger.info("\nLocations:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoGetContexts: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.getContexts();
		enLogger.info("\nContexts:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoClearContext: async function () {
		// clear context (named graph)
		// CAUTION! This operation empties the named graph 
		// of the repository and cannot be undone!
		let resp = await this.graphDBEndpoint.clearContext(
			GRAPHDB_CONTEXT_TEST);
		enLogger.info("\nClearContext :\n" +
			JSON.stringify(resp, null, 2));
		return;
	},

	demoGetSavedQueries: async function () {
		// clear context (named graph)
		// CAUTION! This operation empties the named graph 
		// of the repository and cannot be undone!
		let resp = await this.graphDBEndpoint.getSavedQueries();
		enLogger.info("\nGetSavedQueries :\n" +
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
		enLogger.info("\nUploadFromFile:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoUploadFromData: async function () {
		// upload a file
		let resp = await this.graphDBEndpoint.uploadFromData({
			filename: "ontologies/Test.owl",
			format: "application/rdf+xml",
			baseIRI: "http://ont.enapso.com/test#",
			context: "http://ont.enapso.com/test"
		});
		enLogger.info("\nUploadFromData:\n" + JSON.stringify(resp, null, 2));
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
		enLogger.info("\nDownload (file):\n" +
			JSON.stringify(resp, null, 2));
		return resp;
	},

	demoDownloadToText: async function () {
		// download a repository or named graph to memory
		resp = await this.graphDBEndpoint.downloadToText({
			format: EnapsoGraphDBClient.FORMAT_TURTLE.type
		});
		enLogger.info("\nDownload (text):\n" +
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
			enLogger.info("Query succeeded:\n" + JSON.stringify(resp, null, 2));
		} else {
			enLogger.info("Query failed:\n" + JSON.stringify(binding, null, 2));
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
			enLogger.info("Update succeeded:\n" + JSON.stringify(resp, null, 2));
		} else {
			enLogger.info("Update failed:\n" + JSON.stringify(resp, null, 2));
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
			enLogger.info("Update succeeded:\n" + JSON.stringify(resp, null, 2));
		} else {
			enLogger.info("Update failed:\n" + JSON.stringify(resp, null, 2));
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
			enLogger.info("Update succeeded:\n" + JSON.stringify(resp, null, 2));
		} else {
			enLogger.info("Update failed:\n" + JSON.stringify(resp, null, 2));
		}
	},

	demoPerformGarbageCollection: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.performGarbageCollection();
		enLogger.info("\nGarbage Collection:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoGetResources: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.getResources();
		enLogger.info("\nResources:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoWaitForGraphDB: async function () {
		// lists all contexts (named graph) in the repository
		enLogger.info("\nWaiting for GraphDB...");
		let resp = await this.graphDBEndpoint.waitForGraphDB({
			timeout: 10000,			// wait at most 10 seconds
			interval: 2000,			// check resources all 2 seconds
			cpuWatermark: 0.8,
			memoryWatermark: 0.7,
			performGarbageCollection: true,
			callback: function (aEvent) {
				enLogger.info(JSON.stringify(aEvent));
			}
		});
		enLogger.info("Wait for GraphDB:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoGetQuery: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.getQuery();
		enLogger.info("\nGet Query:\n" + JSON.stringify(resp, null, 2));
		return resp;
	},

	demoShacl: async function () {
		let resp;

		// read sparqls
		let validSparql = await fsPromises.readFile('./test/validUpdate.sparql', 'utf-8');
		let invalidSparql = await fsPromises.readFile('./test/invalidUpdate.sparql', 'utf-8');
		let getPersonsSparql = await fsPromises.readFile('./test/selectAllPersons.sparql', 'utf-8');
		// read the shacl turtle
		let shaclTtl = await fsPromises.readFile('./ontologies/EnapsoTestShacl.ttl', 'utf-8');
		// read the shacl json-ld
		let shaclJsonLd = await fsPromises.readFile('./ontologies/EnapsoTestShacl.jsonld', 'utf-8');

		// first drop the shacl graph if exists, if it does not exist, this will not be a problem
		enLogger.info("\nDropping SHACL Graph...");
		resp = await this.graphDBEndpoint.dropShaclGraph();
		enLogger.info("\nDrop SHACL Graph:\n" + JSON.stringify(resp, null, 2));

		// now clear the current repository to ensure that there is no old data inside that could disturb the tests
		enLogger.info("\nClearing repository...");
		resp = await this.graphDBEndpoint.clearRepository();
		enLogger.info("\nCleared repository:\n" + JSON.stringify(resp, null, 2));

		// now upload ontology directly from test ontology file into test graph into the test repository
		enLogger.info("\nUploading ontology from file...");
		resp = await this.graphDBEndpoint.uploadFromFile({
			filename: "./ontologies/EnapsoTest.owl",
			context: GRAPHDB_CONTEXT_TEST,
			format: EnapsoGraphDBClient.FORMAT_RDF_XML.type
		});
		enLogger.info("\nUploaded ontology from file:\n" + JSON.stringify(resp, null, 2));

		resp = await this.graphDBEndpoint.query(getPersonsSparql);
		enLogger.info("\nGet Persons after upload (supposed to work):\n" + JSON.stringify(resp, null, 2));

		// first try all actions w/o a shacl being applied
		resp = await this.graphDBEndpoint.update(validSparql);
		enLogger.info("\nValid SPARQL w/o SHACL (supposed to work):\n" + JSON.stringify(resp, null, 2));

		resp = await this.graphDBEndpoint.update(invalidSparql);
		enLogger.info("\Invalid SPARQL w/o SHACL (supposed to work):\n" + JSON.stringify(resp, null, 2));

		resp = await this.graphDBEndpoint.query(getPersonsSparql);
		enLogger.info("\nGet Persons w/o SHACL (supposed to work):\n" + JSON.stringify(resp, null, 2));

		// now clear the repository again, it contains invalid data from the tests w/o shacl support
		enLogger.info("\nClearing repository...");
		resp = await this.graphDBEndpoint.clearRepository();
		enLogger.info("\nCleared repository:\n" + JSON.stringify(resp, null, 2));

		// and upload ontology again to have the same initital status for shacl tests as w/o the shacl tests
		enLogger.info("\nUploading ontology from file...");
		resp = await this.graphDBEndpoint.uploadFromFile({
			filename: "./ontologies/EnapsoTest.owl",
			context: GRAPHDB_CONTEXT_TEST,
			format: EnapsoGraphDBClient.FORMAT_RDF_XML.type
		});
		enLogger.info("\nUploaded ontology from file:\n" + JSON.stringify(resp, null, 2));

		// now load the shacl on top of the correct ontology
		enLogger.info("\nUploading SHACL from Data...");
		// now upload the shacl file, using correct context (graph name) and format!
		resp = await this.graphDBEndpoint.uploadFromData({
			// data: shaclTtl,
			data: shaclJsonLd,
			context: GRAPHDB_CONTEXT_SHACL,
			// format: EnapsoGraphDBClient.FORMAT_TURTLE.type
			format: EnapsoGraphDBClient.FORMAT_JSON_LD.type
		});
		enLogger.info("\nUploaded SHACL from Data:\n" + JSON.stringify(resp, null, 2));

		// next try all actions w/o a shacl being applied
		resp = await this.graphDBEndpoint.update(validSparql);
		enLogger.info("\nValid SPARQL with SHACL support (supposed to work):\n" + JSON.stringify(resp, null, 2));

		resp = await this.graphDBEndpoint.update(invalidSparql);
		enLogger.info("\nInvalid SPARQL with SHACL support (NOT supposed to work):\n" + JSON.stringify(resp, null, 2));

		resp = await this.graphDBEndpoint.query(getPersonsSparql);
		enLogger.info("\nGet Persons with SHACL support (supposed to work):\n" + JSON.stringify(resp, null, 2));

		enLogger.info("\nDone");
	},

	demo: async function () {
		this.graphDBEndpoint = await this.createEndpoint();
		this.authentication = await this.login();

		// verify authentication
		if (!this.authentication.success) {
			enLogger.info("\nLogin failed:\n" +
				JSON.stringify(this.authentication, null, 2));
			return;
		}
		enLogger.info("\nLogin successful");

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

		//this.demoShacl();
    await  this.demoDropShaclGraph();
        /*
        enLogger.info("--- Inserting new triple --- ")
		await this.demoInsert();
		*/
		//enLogger.info("--- Graph should contain TestClass now --- ")
		//await this.demoQuery();
		/*
        // await this.demoDownloadToFile();
        enLogger.info("--- Updating existing triple --- ")
        await this.demoUpdate();
        enLogger.info("--- Graph should contain TestClassUpdated now --- ")
        await this.demoQuery();
        enLogger.info("--- Deleting existing triple --- ")
        await this.demoDelete();
        enLogger.info("--- Graph should not contain TestClassUpdated anymore --- ")
        await this.demoQuery();
        */

		/*
	   await this.demoGetResources();
	   await this.demoPerformGarbageCollection();
	   await this.demoGetResources();
	   */

		await this.demoCreateRepository();
		await this.demoDeleteRepository();

		// await this.demoClearRepository();

		/*
		  enLogger.info("Start: " + new Date().toISOString());
		  await this.demoWaitForGraphDB();
		  enLogger.info("Finish: " + new Date().toISOString());
		  */

		// await this.demoGetQuery();
	}
}

EnapsoGraphDBAdminDemo.demo();