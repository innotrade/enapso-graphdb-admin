# enapso-graphdb-admin
Enapso Ontotext GraphDB 8.x Administrator for JavaScript

Admin client for OntoText GraphDB to easily perform administrative operations against your RDF stores, your OWL ontologies or knowledge graphs in nodes.js applications. This client supports an easy import of existing RDF stores and ontologies to Ontotext GraphDB by upload via file, strings or URLs in numerous formats.

Future versions of this client will support the creation and listing of new repositories, the location and cluster management of Ontotext GraphDB as well as an easy export. Any questions and suggestions are welcome.

This project is currently work-in-progress and will be subject to further changes until its version 1.0.
Examples and documentation are pending and will be published soon.

**The following demos require a running GraphDB 8.x instance on localhost at port 7200. The demos as well as the automated tests require a fully working Ontotext GraphDB repository "Test" and a user "Test" with the password "Test" being set up, which has read/write access to the "Test" Repository.**

# Example

## Instantiating an Enapso GraphDB Client and Admin Client

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

## Listing all repositories configured in your GraphDB instance

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
    "uri": "http://localhost:7200/repositories/SYSTEM",
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
    "uri": "http://localhost:7200/repositories/Test",
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

## Listing all users configured in your GraphDB instance

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

## Listing all contexts used in a given repository

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
