const fsPromises = require("fs").promises,
	{ EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client"),
	{ EnapsoGraphDBAdmin } = require("../index");

// connection data to the running GraphDB instance
const GRAPHDB_BASE_URL = "http://localhost:7200",
	GRAPHDB_REPOSITORY = "Test",
	GRAPHDB_USERNAME = "Test",
	GRAPHDB_PASSWORD = "Test",
	GRAPHDB_CONTEXT_TEST = "http://ont.enapso.com/repo",
	GRAPHDB_CONTEXT_SHACL = "http://rdf4j.org/schema/rdf4j#SHACLShapeGraph";

// the default prefixes for all SPARQL queries
const GRAPHDB_DEFAULT_PREFIXES = [
	EnapsoGraphDBClient.PREFIX_OWL,
	EnapsoGraphDBClient.PREFIX_RDF,
	EnapsoGraphDBClient.PREFIX_RDFS,
];

let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
	baseURL: GRAPHDB_BASE_URL,
	repository: GRAPHDB_REPOSITORY,
	prefixes: GRAPHDB_DEFAULT_PREFIXES,
});

graphDBEndpoint
	.login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.createRepository({
		id: "AutomatedTest4",
		title: "Enapso Automated Test Repository",
		location: "",
	})
	.then((result) => {
		console.log(result, "here in result");
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.createUser({
		authorities: [
			"WRITE_REPO_Test", // Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
			"READ_REPO_Test", // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
			"READ_REPO_EnapsoDotNetProDemo",
			"ROLE_USER", // Role of the user
		],
		username: "TestUser2", // Username
		password: "TestUser2", // Password for the user
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.updateUser({
		authorities: [
			// Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
			"READ_REPO_Test", // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
			"WRITE_REPO_EnapsoDotNetProDemo",
			"READ_REPO_EnapsoDotNetProDemo",
			"ROLE_USER", // Role of the user
		],
		username: "TestUser2", // Username
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.deleteUser({
		user: "TestUser2", // username which you want to delete
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.deleteRepository({
		id: "AutomatedTest",
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.getRepositories()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.clearRepository()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.getUsers()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.getLocations()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.getContexts()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.clearContext(GRAPHDB_CONTEXT_TEST)
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.getSavedQueries()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.uploadFromFile({
		filename: "../ontologies/EnapsoTest.owl",
		format: "application/rdf+xml",
		baseIRI: "http://ont.enapso.com/test#",
		context: "http://ont.enapso.com/test",
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

fsPromises
	.readFile("../ontologies/EnapsoTest.owl", "utf-8")
	.then((data) => {
		graphDBEndpoint
			.uploadFromData({
				data: data,
				context: "http://ont.enapso.com/test",
				// format: EnapsoGraphDBClient.FORMAT_TURTLE.type
				format: "application/rdf+xml",
			})
			.then((result) => {
				console.log(result);
			})
			.catch((err) => {
				console.log(err, "here in err");
			});
	})
	.catch((err) => {
		console.log(err);
	});

let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
graphDBEndpoint
	.downloadToFile({
		format: lFormat.type,
		filename:
			"../ontologies/" +
			graphDBEndpoint.getRepository() +
			lFormat.extension,
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.downloadToText({
		format: EnapsoGraphDBClient.FORMAT_TURTLE.type,
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.performGarbageCollection()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.getResources()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err, "here in error");
	});

graphDBEndpoint
	.waitForGraphDB({
		timeout: 10000, // wait at most 10 seconds
		interval: 2000, // check resources all 2 seconds
		cpuWatermark: 0.8,
		memoryWatermark: 0.7,
		performGarbageCollection: true,
	})
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});

graphDBEndpoint
	.getQuery()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});
