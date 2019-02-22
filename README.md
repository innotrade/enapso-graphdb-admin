# enapso-graphdb-admin
Enapso Ontotext GraphDB 8.x Administrator for JavaScript

Admin client for OntoText GraphDB to easily perform administrative operations against your RDF stores, your OWL ontologies or knowledge graphs in nodes.js applications. This client supports an easy import of existing RDF stores and ontologies to Ontotext GraphDB by upload via file, strings or URLs in numerous formats.

Future versions of this client will support the creation and listing of new repositories, the location and cluster management of Ontotext GraphDB as well as an easy export. Any questions and suggestions are welcome.

This project is currently work-in-progress and will be subject to further changes until its version 1.0.
Examples and documentation are pending and will be published soon.

**The following demos require a running GraphDB 8.x instance on localhost at port 7200. The demos as well as the automated tests require a fully working Ontotext GraphDB repository "Test" and a user "Test" with the password "Test" being set up, which has read/write access to the "Test" Repository.**

To discuss questions and suggestions with the GraphDB community, we'll be happy to meet you in our forum at https://www.innotrade.com/forum/.

# Example

## Instantiate an Enapso GraphDB and Admin Client

```javascript
const EnapsoGraphDBClient = require("enapso-graphdb-client");
const EnapsoGraphDBAdmin = require("enapso-graphdb-admin");

// connection data to the running GraphDB instance
const
    GRAPHDB_QUERY_URL = 
        'http://localhost:7200/repositories/Test',
    GRAPHDB_UPDATE_URL = 
        'http://localhost:7200/repositories/Test/statements',
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

    :
    :
}
```

## Upload a file to GraphDB

```javascript
uploadFileDemo: async function () {
    var lRes = await EnapsoGraphDBAdmin.uploadFromFile({
        filename: 'ontologies/test.owl',
        format: "application/rdf+xml",
        baseURI: "http://ont.enapso.com/test#",
        context: "http://ont.enapso.com/test"
    });
    return lRes;
}
```

## Download a graph from GraphDB to a text variable

For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context is optional. If you do not pass a context, the entire repository is exported.

```javascript
downloadToTextDemo: async function () {
    var lRes = await EnapsoGraphDBAdmin.downloadRepositoryToText({
        repository: GRAPHDB_REPOSITORY,
        format: EnapsoGraphDBClient.FORMAT_TURTLE.type,
        context: "http://ont.enapso.com/test"
    });
    return lRes;
}
```

## Download a graph from GraphDB directly to a local file

For the available export formats, please refer to the EnapsoGraphDBClient.FORMAT_xxx constants.
The context is optional. If you do not pass a context, the entire repository is exported.

```javascript
downloadToFileDemo: async function () {
    let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
    var lRes = await EnapsoGraphDBAdmin.downloadRepositoryToFile({
        repository: GRAPHDB_REPOSITORY,
        format: lFormat.type,
        context: "http://ont.enapso.com/test",
        filename: "ontologies/test" + lFormat.extension
    });
    return lRes;
}
```

## List all repositories configured in your GraphDB instance

```javascript
getRepositoriesDemo: async function () {
    var lRes = await EnapsoGraphDBAdmin.getRepositories({
    });
    return lRes;
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

## Clear an entire repository of your GraphDB instance

**Caution! This removes ALL triples of the given repository! This operation cannot be undone!**
The entire repository will be emptied, i.e. all data of this repository will be removed. The repository remains active.

```javascript
clearRepositoryDemo: async function () {
    let lRes = await EnapsoGraphDBAdmin.clearRepository({
        repository: "Test"
    });
    return lRes;
}
```

### Result

```json
{
  "success": true
}
```

## List all users configured in your GraphDB instance

```javascript
getUsersDemo: async function () {
    var lRes = await EnapsoGraphDBAdmin.getUsers({
    });
    return lRes;
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
getContextsDemo: async function () {
    let lRes = await EnapsoGraphDBAdmin.getContexts({
        repository: GRAPHDB_REPOSITORY
    });
    return lRes;
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

## Clear an entire context in a given repository of your GraphDB instance

**Caution! This removes ALL triples of the given context! This operation cannot be undone!**
The entire context will be emptied, i.e. all data from this context will be removed. The repository and other contexts remain active.

```javascript
clearContextDemo: async function () {
    let lRes = await EnapsoGraphDBAdmin.clearContext({
        repository: "Test",
        context: "http://ont.enapso.com/test"
    });
    return lRes;
}
```

### Result

```json
{
  "success": true
}
```

## Listing all locations configured in your GraphDB instance

```javascript
getLocationsDemo: async function () {
    var lRes = await EnapsoGraphDBAdmin.getLocations({
    });
    return lRes;
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
