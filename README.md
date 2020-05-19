# enapso-graphdb-admin
Enapso Ontotext GraphDB 8.x/9.x Administration Toolbox for Node.js

Admin client for OntoText GraphDB to easily perform administrative and monitoring operations against your RDF stores, your OWL ontologies or knowledge graphs in nodes.js applications. This client supports an easy import of existing RDF stores and ontologies to GraphDB by upload via file, strings or URLs as well as an export in numerous formats and also a context management. You can monitor the cpu load and memory usage of GraphDB and run the garbage collector on demand to optimally trigger huge batch operations. Future versions of this client will support a user managememt, the creation and listing of new repositories as well as an location and cluster management of Ontotext GraphDB.

**The following demos require a running GraphDB 8.x/9.x instance on localhost at port 7200. The demos as well as the automated tests require a fully working Ontotext GraphDB repository "Test" and a user "Test" with the password "Test" being set up, which has read/write access to the "Test" Repository and repository ruleset must have OWL Horst(Optimizes) Base URL: http://ont.enapso.com/test#, graph: http://ont.enapso.com/test#**
Get the latest version of GraphDB for free at https://www.ontotext.com/free-graphdb-download-copy/.

**This project is actively developed and maintained.**
To discuss questions and suggestions with the Enapso and GraphDB community, we'll be happy to meet you in our forum at https://www.innotrade.com/forum/.

# Installation 
```
npm i @innotrade/enapso-graphdb-admin --save
```
# Example
## Instantiate an Enapso GraphDB and Admin Client
```javascript
// require the Enapso GraphDB Client and Admin packages
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { EnapsoGraphDBAdmin } = require('@innotrade/enapso-graphdb-admin');

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

console.log("Innotrade Enapso GraphDB Admin Demo");

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

    // here numerous demo methods are located

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

        // continue to work with this.graphDBEndpoint
        // :
    }
}

// execute the demo(s)
EnapsoGraphDBAdminDemo.demo();
```
## Upload a file to GraphDB
```javascript
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
}
```
## Upload From Date to GraphDB
```javascript
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
	}
```
## Download a graph from GraphDB to a text variable
For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context is optional. If you do not pass a context, the entire repository is exported.
```javascript
demoDownloadToText: async function () {
    // download a repository or named graph to memory
    resp = await this.graphDBEndpoint.downloadToText({
        format: EnapsoGraphDBClient.FORMAT_TURTLE.type
    });
    console.log("\nDownload (text):\n" + 
        JSON.stringify(resp, null, 2));
    return resp;
}
```
## Download a graph from GraphDB directly to a local file
For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context is optional. If you do not pass a context, the entire repository is exported.
```javascript
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
}
```
## Perform Garbage Collection in your GraphDB instance
```javascript
demoPerformGarbageCollection: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.performGarbageCollection();
		enLogger.info("\nGarbage Collection:\n" + JSON.stringify(resp, null, 2));
		return resp;
	}
```
## Get Resource of GraphDB instance
```javascript
demoGetResources: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.getResources();
		enLogger.info("\nResources:\n" + JSON.stringify(resp, null, 2));
		return resp;
	}
```

## Lists all contexts (named graph) in the repository
```javascript
demoGetQuery: async function () {
		// lists all contexts (named graph) in the repository
		let resp = await this.graphDBEndpoint.getQuery();
		enLogger.info("\nGet Query:\n" + JSON.stringify(resp, null, 2));
		return resp;
	}
```

## Create new user and assign role
```javascript
demoCreateUser: async function () {
		let lRes = await this.graphDBEndpoint.login(
			"admin",
			"root"
		);
		// todo: interpret lRes here, it does not makes sense to continue if login does not work!
		let resp = await this.graphDBEndpoint.createUser({
			authorities: [
				"WRITE_REPO_Test",	// Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
				"READ_REPO_Test",	// Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
				"READ_REPO_EnapsoDotNetProDemo",
				"ROLE_USER",		// Role of the user
			],
			"username": "TestUser",	// Username 
			"password": "TestUser"	// Password for the user
		});
		enLogger.info("Create New User:" + JSON.stringify(resp, null, 2));
	}
```
## Update user role and authorities
```javascript
	demoUpdateUser: async function () {
		let lRes = await this.graphDBEndpoint.login(
			"admin",
			"root"
		);
		// todo: interpret lRes here, it does not makes sense to continue if login does not work!
		let resp = await this.graphDBEndpoint.updateUser({
			authorities: [
					// Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
				"READ_REPO_Test",	// Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
				"WRITE_REPO_EnapsoDotNetProDemo",
				"READ_REPO_EnapsoDotNetProDemo",
				"ROLE_USER",		// Role of the user
			],
			"username": "TestUser",	// Username 
			
		});
		enLogger.info("Update Inserted User:" + JSON.stringify(resp, null, 2));
	}
```
## Delete user role
```javascript
demoDeleteUser: async function () {
		let lRes = await this.graphDBEndpoint.login(
			"admin",
			"root"
		);
		// todo: interpret lRes here, it does not makes sense to continue if login does not work!
		let resp = await this.graphDBEndpoint.deleteUser({
			"user": "TestUser"		// username which you want to delete
		});
		enLogger.info("Delete Exisiting User:" + JSON.stringify(resp, null, 2));
	}
```
## List all repositories configured in your GraphDB instance
```javascript
demoGetRepositories: async function () {
    // lists all repositories
    resp = await this.graphDBEndpoint.getRepositories();
    console.log("\nRepositories:\n" + JSON.stringify(resp, null, 2));
    return resp;
}
```
### Result
```json
[
  {
    "id": "SYSTEM",
    "title": "System configuration repository",
    "uri": "http://[your ip or hostname]:7200/repositories/SYSTEM",
    "externalUrl": "http://[your ip or hostname]:7200/repositories/SYSTEM",
    "type": "system",
    "sesameType": "openrdf:SystemRepository",
    "location": "",
    "readable": true,
    "writable": true,
    "unsupported": false,
    "local": true
  },
  :
  :
  {
    "id": "Test",
    "title": "Test",
    "uri": "http://[your ip or hostname]:7200/repositories/Test",
    "externalUrl": "http://[your ip or hostname]:7200/repositories/Test",
    "type": "free",
    "sesameType": "graphdb:FreeSailRepository",
    "location": "",
    "readable": true,
    "writable": true,
    "unsupported": false,
    "local": true
  }
]  
```
## Clear entire repository of your GraphDB instance
**Caution! This removes ALL triples of the given repository! This operation cannot be undone!**
The entire repository will be emptied, i.e. all data of this repository will be removed. The repository remains active.
```javascript
demoClearRepository: async function () {
    // clear entire repository
    // CAUTION! This operation empties the entire repository 
    // and cannot be undone!
    let resp = await this.graphDBEndpoint.clearRepository();
    console.log("\ClearRepository :\n" + JSON.stringify(resp, null, 2));
    return resp;
}
```
### Result
```json
{
  "success": true
}
```
## List all users of your GraphDB instance
```javascript
demoGetUsers: async function () {
    // lists all users (requires admin role)
    let resp = await this.graphDBEndpoint.getUsers();
    console.log("\nUsers:\n" + JSON.stringify(resp, null, 2));
    return resp;
}
```
### Result
```json
[
  {
    "username": "Test",
    "password": "",
    "grantedAuthorities": [
      "WRITE_REPO_Test",
      "READ_REPO_Test",
      "ROLE_USER"
    ],
    "appSettings": {
      "DEFAULT_SAMEAS": true,
      "DEFAULT_INFERENCE": true,
      "EXECUTE_COUNT": true
    },
    "dateCreated": 1549545975380
  },
  {
    "username": "admin",
    "password": "",
    "grantedAuthorities": [
      "ROLE_ADMIN"
    ],
    "appSettings": {
      "DEFAULT_INFERENCE": true,
      "DEFAULT_SAMEAS": true,
      "EXECUTE_COUNT": true
    },
    "dateCreated": 1478943858311
  }
]
```
## List all contexts used in a given repository
```javascript
demoGetContexts: async function () {
    // lists all contexts (named graph) in the repository
    let resp = await this.graphDBEndpoint.getContexts();
    console.log("\nContexts:\n" + JSON.stringify(resp, null, 2));
    return resp;
}
```
### Result
```json
{
  "total": 1,
  "success": true,
  "records": [
    {
      "contextID": "http://ont.enapso.com/test"
    }
  ]
}
```
## Clear entire context in a given repository
**Caution! This removes ALL triples of the given context! This operation cannot be undone!**
The entire context will be emptied, i.e. all data from this context will be removed. The repository and other contexts remain active.
```javascript
demoClearContext: async function () {
    // clear context (named graph)
    // CAUTION! This operation empties the named graph 
    // of the repository and cannot be undone!
    let resp = await this.graphDBEndpoint.clearContext(
        GRAPHDB_CONTEXT_TEST);
    console.log("\ClearContext :\n" +
        JSON.stringify(resp, null, 2));
    return;
}
```
### Result
```json
{
  "success": true
}
```
## List all locations configured in your GraphDB instance
```javascript
demoGetLocations: async function () {
    // lists all locations, requires repository manager role!
    let resp = await this.graphDBEndpoint.getLocations();
    console.log("\nLocations:\n" + JSON.stringify(resp, null, 2));
    return resp;
}
```
### Result
```json
[
  {
    "uri": "",
    "label": "Local",
    "username": null,
    "password": null,
    "active": true,
    "local": true,
    "system": true,
    "errorMsg": null,
    "defaultRepository": null
  }
]
```
## List all save queries in your GraphDB instance
```javascript
demoGetSavedQueries: async function () {
    // clear context (named graph)
    // CAUTION! This operation empties the named graph 
    // of the repository and cannot be undone!
    let resp = await this.graphDBEndpoint.getSavedQueries();
    console.log("\nGetSavedQueries :\n" +
        JSON.stringify(resp, null, 2));
    return;
}
```
### Result
```json
{
  "success": true,
  "statusCode": 200,
  "statusMessage": "OK",
  "data": [
    {
      "name": "[Name of your query 1]",
      "body": "[SPARQL query saved with this name]"
    },
    {
      "name": "[Name of your query 2]",
      "body": "[SPARQL query saved with this name]"
    }
  ]
}
```
## Create new reposiotry in your GraphDB instance
```javascript
demoCreateRepository: async function () {
		let resp = await this.graphDBEndpoint.createRepository({
			"id": "AutomatedTest",
			"title": "Enapso Automated Test Repository",
			"location": ""
		});
		enLogger.info("Create Repository:" + JSON.stringify(resp, null, 2));
	}
```
### Result
```json
Create Repository:{
  "success": true,
  "statusCode": 201,
  "statusMessage": "OK"
}
```
## Delete reposiotry in your GraphDB instance
```javascript
demoDeleteRepository: async function () {
		let resp = await this.graphDBEndpoint.deleteRepository({
			"id": "AutomatedTest"
		});
		enLogger.info("Delete Repository:" + JSON.stringify(resp, null, 2));
	}
```
### Result
```json
Delete Repository:{
  "success": true,
  "statusCode": 200,
  "statusMessage": "OK"
}

```
## Upload SHACL in your GraphDB instance
```javascript
demoShacl: async function () {
		let resp;

		// read sparqls
		let validSparql = await fsPromises.readFile('../test/validUpdate.sparql', 'utf-8');
		let invalidSparql = await fsPromises.readFile('../test/invalidUpdate.sparql', 'utf-8');
		let getPersonsSparql = await fsPromises.readFile('../test/selectAllPersons.sparql', 'utf-8');
		// read the shacl turtle
		let shaclTtl = await fsPromises.readFile('../ontologies/EnapsoTestShacl.ttl', 'utf-8');
		// read the shacl json-ld
		let shaclJsonLd = await fsPromises.readFile('../ontologies/EnapsoTestShacl.jsonld', 'utf-8');

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
	}
```
### Result
```json
DropShaclGraph :
{
  "success": true,
  "statusCode": 200,
  "message": "OK"
}

```




## Drop SHACL in your GraphDB instance
```javascript
demoDropShaclGraph: async function () {
		// clear entire repository
		// CAUTION! This operation empties the entire repository 
		// and cannot be undone!
		let resp = await this.graphDBEndpoint.dropShaclGraph();
		enLogger.info("\nDropShaclGraph :\n" + JSON.stringify(resp, null, 2));
		return resp;
	}
```
### Result
```json
DropShaclGraph :
{
  "success": true,
  "statusCode": 200,
  "message": "OK"
}

```