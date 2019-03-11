# enapso-graphdb-admin
Enapso Ontotext GraphDB 8.x Administration Toolbox for Node.js

Admin client for OntoText GraphDB to easily perform administrative and monitoring operations against your RDF stores, your OWL ontologies or knowledge graphs in nodes.js applications. This client supports an easy import of existing RDF stores and ontologies to GraphDB by upload via file, strings or URLs as well as an export in numerous formats and also a context management. You can monitor the cpu load and memory usage of GraphDB and run the garbage collector on demand to optimally trigger huge batch operations. Future versions of this client will support a user managememt, the creation and listing of new repositories as well as an location and cluster management of Ontotext GraphDB.

This project is currently work-in-progress and will be subject to further changes until its version 1.0. Examples and documentation are pending and will be published soon.

**The following demos require a running GraphDB 8.x instance on localhost at port 7200. The demos as well as the automated tests require a fully working Ontotext GraphDB repository "Test" and a user "Test" with the password "Test" being set up, which has read/write access to the "Test" Repository.**
Get the latest version of GraphDB for free at https://www.ontotext.com/free-graphdb-download-copy/.

**This project is actively developed and maintained.**
To discuss questions and suggestions with the Enapso and GraphDB community, we'll be happy to meet you in our forum at https://www.innotrade.com/forum/.

# Installation 
```
npm i enapso-graphdb-admin --save
```
# Example
## Instantiate an Enapso GraphDB and Admin Client
```javascript
// require the Enapso GraphDB Client and Admin packages
const { EnapsoGraphDBClient } = require('enapso-graphdb-client');
const { EnapsoGraphDBAdmin } = require('enapso-graphdb-admin');

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