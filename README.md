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
const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");
const { EnapsoGraphDBAdmin } = require("@innotrade/enapso-graphdb-admin");
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
  EnapsoGraphDBClient.PREFIX_RDFS
];
```

## Connection with GraphDB to create an End Point
Create an endpoint client with graphdb to perform operation 
```javascript
let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
  baseURL: GRAPHDB_BASE_URL,
  repository: GRAPHDB_REPOSITORY,
  prefixes: GRAPHDB_DEFAULT_PREFIXES
});
```

## Login to GraphDB
Login to the GraphDB to verify the user and provide them authorities which assign that user
```javascript
graphDBEndpoint
  .login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err, "here in error");
  });
```

## Upload a file to GraphDB
Upload the Ontology and import it automatically when it uploaded successfully
```javascript
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
```

## Upload From Date to GraphDB
Upload the data and import it in GraphDB rather than file
```javascript
fsPromises
  .readFile("../ontologies/EnapsoTest.owl", "utf-8")
  .then((data) => {
    graphDBEndpoint
      .uploadFromData({
        data: data,
        context: "http://ont.enapso.com/test",
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
```

## Download a graph from GraphDB to a text variable

For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context is optional. If you do not pass a context, the entire repository is exported.

```javascript
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
```

## Download a graph from GraphDB directly to a local file

For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context is optional. If you do not pass a context, the entire repository is exported.

```javascript
let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
graphDBEndpoint
  .downloadToFile({
    format: lFormat.type,
    filename:
      "../ontologies/" + graphDBEndpoint.getRepository() + lFormat.extension,
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err, "here in error");
  });
```

## Perform Garbage Collection in your GraphDB instance
Do garbage collection in by default repository using which you create connection with client for better performance
```javascript
graphDBEndpoint
  .performGarbageCollection()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err, "here in error");
  });
```

## Get Resource of GraphDB instance
Get resouces Details of the repository whose connection esatablish when creating an endpoints
```javascript
graphDBEndpoint
  .getResources()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err, "here in error");
  });
```

## Lists all contexts (named graph) in the repository
List down all the graph name which are uploaded in Repository of GraphDB
```javascript
graphDBEndpoint
  .getQuery()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
```

## Create new user and assign role
Create a new user and provide the new user the read write access of repository of GraphDB
```javascript
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
    console.log(err);
  });
```

## Update user role and authorities
Update the user the access of read write of repository and role
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
  graphDBEndpoint.updateUser({
			authorities: [
					// Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
				"READ_REPO_Test",	// Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
				"WRITE_REPO_EnapsoDotNetProDemo",
				"READ_REPO_EnapsoDotNetProDemo",
				"ROLE_USER",		// Role of the user
			],
			"username": "TestUser",	// Username

		}).then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});
```

## Delete user role
Delete the user of GraphDB 
```javascript
graphDBEndpoint
  .deleteUser({
    user: "TestUser2", // username which you want to delete
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
```

## List all repositories configured in your GraphDB instance
Get details of all repsoitory of the GraphDB running on your localHost
```javascript
graphDBEndpoint
  .getRepositories()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
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
graphDBEndpoint
  .clearRepository()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
```

### Result

```json
{
  "success": true
}
```

## List all users of your GraphDB instance
Get all details of user of GraphDN
```javascript
graphDBEndpoint
  .getUsers()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
```

### Result

```json
[
  {
    "username": "Test",
    "password": "",
    "grantedAuthorities": ["WRITE_REPO_Test", "READ_REPO_Test", "ROLE_USER"],
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
    "grantedAuthorities": ["ROLE_ADMIN"],
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
all content detail of repository 
```javascript
graphDBEndpoint
  .getContexts()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err, "here in error");
  });
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
graphDBEndpoint
  .clearContext(GRAPHDB_CONTEXT_TEST)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err, "here in error");
  });
```

### Result

```json
{
  "success": true
}
```

## List all locations configured in your GraphDB instance
Get details of all location which are in GraphDB running on your localhost
```javascript
graphDBEndpoint
  .getLocations()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
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
Get details of all queries which are saved in GraphDB
```javascript
graphDBEndpoint
  .getSavedQueries()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
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
Create a new repository in your GraphDB instance
```javascript
graphDBEndpoint
  .createRepository({
    id: "AutomatedTest4",
    title: "Enapso Automated Test Repository",
    location: "",
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
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
Delete the repsoitry of GraphDB
```javascript
graphDBEndpoint
  .deleteRepository({
    id: "AutomatedTest",
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
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
Upload the shacl for which we perform some operation step by step in async function 
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
drop the shacl from GraphDB to remove the restrication on uploaded dta
```javascript
graphDBEndpoint
  .dropShaclGraph()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
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
