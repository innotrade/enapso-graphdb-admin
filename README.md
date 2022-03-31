# enapso-graphdb-admin

enapso Ontotext GraphDB 8.x/9.x Administration Toolbox for Node.js

Admin client for OntoText GraphDB to easily perform administrative and monitoring operations against your RDF stores, your OWL ontologies or knowledge graphs in nodes.js applications. This client supports an easy import of existing RDF stores and ontologies to GraphDB by upload via file, strings or URLs as well as an export in numerous formats and also a context management. You can monitor the cpu load and memory usage of GraphDB and run the garbage collector on demand to optimally trigger huge batch operations also provide the user managememt, the creation and listing of new repositories as well as an location and cluster management of Ontotext GraphDB.

**The following demos require a running GraphDB 8.x/9.x instance on localhost at port 7200. The demos as well as the automated tests require a fully working Ontotext GraphDB repository "Test" and a user "admin" with the password "root" being set up as an administrator and repository ruleset must have OWL Horst(Optimizes) Base URL: http://ont.enapso.com/test#, graph: http://ont.enapso.com/test#**
Get the latest version of GraphDB for free at https://www.ontotext.com/free-graphdb-download-copy/.

**This project is actively developed and maintained.**
To discuss questions and suggestions with the enapso and GraphDB community, we'll be happy to meet you in our forum at https://www.innotrade.com/forum/.

# Installation

```
npm i @innotrade/enapso-graphdb-admin --save
```

# Example

## Instantiate an enapso GraphDB and Admin Client

```javascript
// require the enapso GraphDB Client and Admin packages
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { EnapsoGraphDBAdmin } = require('@innotrade/enapso-graphdb-admin');
// connection data to the running GraphDB instance
const GRAPHDB_BASE_URL = 'http://localhost:7200',
    GRAPHDB_REPOSITORY = 'Test',
    GRAPHDB_USERNAME = 'Test',
    GRAPHDB_PASSWORD = 'Test',
    GRAPHDB_CONTEXT_TEST = 'http://ont.enapso.com/repo',
    GRAPHDB_CONTEXT_SHACL = 'http://rdf4j.org/schema/rdf4j#SHACLShapeGraph';

// the default prefixes for all SPARQL queries
const GRAPHDB_DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS
];
```

## Connection with GraphDB to create an Endpoint

Create an endpoint client with graphdb to perform operation:

```javascript
let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: GRAPHDB_BASE_URL,
    repository: GRAPHDB_REPOSITORY,
    prefixes: GRAPHDB_DEFAULT_PREFIXES
});
```

## Login to GraphDB

Login to authenticate the user against GraphDB and authorize the user according to his roles:

```javascript
graphDBEndpoint
    .login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## Upload a File to GraphDB

Upload an ontology and import it into a GraphDB repository and optional context (graph) automatically if upload was successful:

```javascript
graphDBEndpoint
    .uploadFromFile({
        filename: '../ontologies/EnapsoTest.owl',
        format: 'application/rdf+xml',
        baseIRI: 'http://ont.enapso.com/test#',
        context: 'http://ont.enapso.com/test'
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## Upload from Data to GraphDB

Upload data (rather than a file) and automatically import the data into a GraphDB repository and optional context (graph):

```javascript
fsPromises
    .readFile('../ontologies/EnapsoTest.owl', 'utf-8')
    .then((data) => {
        graphDBEndpoint
            .uploadFromData({
                data: data,
                context: 'http://ont.enapso.com/test',
                format: 'application/rdf+xml'
            })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err, 'process error here...');
            });
    })
    .catch((err) => {
        console.log(err);
    });
```

## Download a Graph from GraphDB to a Text Variable

For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context (graph) is optional. If you do not pass a context (graph), the entire repository is exported.

```javascript
graphDBEndpoint
    .downloadToText({
        format: EnapsoGraphDBClient.FORMAT_TURTLE.type
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## Download a graph from GraphDB directly to a Local File

For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context is optional. If you do not pass a context, the entire repository is exported.

```javascript
let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
graphDBEndpoint
    .downloadToFile({
        format: lFormat.type,
        filename:
            '../ontologies/' +
            graphDBEndpoint.getRepository() +
            lFormat.extension
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## Perform Garbage Collection in your GraphDB Instance

Perform the garbage collection on the server side to release allocated resources:
if security is on then for Garbage Collection user role need to be Adminstrator else operation not performed

```javascript
graphDBEndpoint
    .performGarbageCollection()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## Get Resource of GraphDB Instance

Get resource details of the repository current connected to the endpoint:

```javascript
graphDBEndpoint
    .getResources()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## Create New User and Assign Role

Create a new user and provide him/her with read/write access to certain repositories in a GraphDB instance:
if security is on then for Creating new User user role need to be Adminstrator else operation not performed

```javascript
graphDBEndpoint
    .createUser({
        authorities: [
            'WRITE_REPO_Test', // Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
            'READ_REPO_Test', // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
            'READ_REPO_EnapsoDotNetProDemo',
            'ROLE_USER' // Role of the user
        ],
        username: 'TestUser2', // Username
        password: 'TestUser2' // Password for the user
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
```

## Update User Role and Authorities

Update the user's roles (read/write rights) for certain repositories:
if security is on then for Updating Exisiting User user role need to be Adminstrator else operation not performed

```javascript
graphDBEndpoint
    .updateUser({
        authorities: [
            // Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
            'READ_REPO_Test', // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
            'WRITE_REPO_EnapsoDotNetProDemo',
            'READ_REPO_EnapsoDotNetProDemo',
            'ROLE_USER' // Role of the user
        ],
        username: 'TestUser' // Username
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
```

## Delete User

**Caution! This deletes the user including all assigend authorities (roles)! This operation cannot be undone!**
Deletes a user from the GraphDB instance:
if security is on then for Deleting User user role need to be Adminstrator else operation not performed

```javascript
graphDBEndpoint
    .deleteUser({
        user: 'TestUser2' // username which you want to delete
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
```

## List all Repositories operated in a GraphDB Instance

Get details of all repositories of the GraphDB repositories operated on the connected host:

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

## Clear entire Repository of your GraphDB Instance

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

## List all Users of a GraphDB Instance

Get all details of all users of a certain GraphDB instance:

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

## Get Query from GraphDB

Get Query from GraphDB:

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

## List all Contexts (Name Graphs) used in a given Repository

List all named graphs inside a given repository:

```javascript
graphDBEndpoint
    .getContexts()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
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

## Clear entire Context (Named Graph) of a given Repository

**Caution! This removes ALL triples of the given context! This operation cannot be undone!**
The entire context will be emptied, i.e. all data from this context will be removed. The repository and other contexts remain active.

```javascript
graphDBEndpoint
    .clearContext(GRAPHDB_CONTEXT_TEST)
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

### Result

```json
{
    "success": true
}
```

## List all GraphDB Locations

Get details of all location which are assosciated with the connected GraphDB instance:

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

## List all saved Queries in a GraphDB Instance

Get details of all queries which are saved in a GraphDB instance:

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
    "": 200,
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

## Create new Repository in your GraphDB Instance

Create a new repository in your GraphDB instance isShacl option is optional if want to enable then set it as true and by default it is false:
if security is on then for creating repository user role need to be Repository Manager else operation not performed

```javascript
graphDBEndpoint
    .createRepository({
        id: 'AutomatedTest4',
        title: 'enapso Automated Test Repository',
        location: '',
        isShacl: true
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
{
    "success": true,
    "": 201,
    "statusMessage": "OK"
}
```

## Delete Repository in a GraphDB Instance

Delete a repository in the connected GraphDB instance:
if security is on then for deleting repository user role need to be Repository Manager else operation not performed

```javascript
graphDBEndpoint
    .deleteRepository({
        id: 'AutomatedTest'
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
{
    "success": true,
    "": 200,
    "statusMessage": "OK"
}
```

## Upload SHACL Shape to a GraphDB Instance

The following code demonstrate how to upload and manage a shacl shape in a GraphDB instance:
Here we are using different method of GraphDB first we get read some sparql queries and shacl from files save them in variables after this we drop the existing shacl using dropShaclGraph method of admin, clear our repository, upload ontology to GraphDB insert some valid and invalid data successfully in ontology then read it again clear the repository upload the ontology again and also upload the shacl using uploadFromData method of our pacakge now again insert valid and invalid data now after uploading shacl you can see it show errors when you insert invalid data which violated restriction which applied through shacl so thats the benefit of shacl to not deal with data which didn't follow restriction rules.

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
  "": 200,
  "message": "OK"
}

```

## Drop SHACL Shape in a GraphDB instance

Drop a shacl Shape from GraphDB to remove all validations:

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
  "": 200,
  "message": "OK"
}

```
