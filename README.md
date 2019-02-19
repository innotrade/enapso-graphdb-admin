# enapso-graphdb-admin
Enapso Ontotext GraphDB 8.x Administrator for JavaScript

Admin client for OntoText GraphDB to easily perform administrative operations against your RDF stores, your OWL ontologies or knowledge graphs in nodes.js applications.
This client supports an easy import of existing RDF stores and ontologies to Ontotext GraphDB by upload via file, strings or URLs in numerous formats.

Future versions of this client will support the creation and listing of new repositories, the location and cluster management of Ontotext GraphDB as well as an easy export.
Any questions and suggestions are welcome.

This project is currently work-in-progress and will be subject to further changes until its version 1.0.
Examples and documentation are pending and will be published soon.

# Example

## Instantiating an Enapso GraphDB Client and Admin Client

The following demos require a running GraphDB 8.x instance on localhost at port 7200. The demo as well as the automated tests require a fully working Ontotext GraphDB repository "Test" and user "Test" with the password "Test", which has read/write access to the "Test" Repository.

```javascript
const EnapsoGraphDBClient = require("enapso-graphdb-client");
const EnapsoGraphDBAdmin = require("enapso-graphdb-admin");

// connection data to the running GraphDB instance
const
    GRAPHDB_QUERY_URL = 'http://localhost:7200/repositories/Test',
    GRAPHDB_UPDATE_URL = 'http://localhost:7200/repositories/Test/statements',
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
    var lRes = await EnapsoGraphDBAdmin.uploadFile({
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
listRepositoriesDemo: async function () {
    var lRes = await EnapsoGraphDBAdmin.listRepositories({
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
    "externalUrl": "http://[your-ip or hostname]:7200/repositories/SYSTEM",
    "type": "system",
    "sesameType": "openrdf:SystemRepository",
    "location": "",
    "readable": true,
    "writable": true,
    "unsupported": false,
    "local": true
  },
  :
  {
    "id": "Test",
    "title": "Test",
    "uri": "http://localhost:7200/repositories/Test",
    "externalUrl": "http://[your-ip or hostname]:7200/repositories/Test",
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

## Listing all locations configured in your GraphDB instance

```javascript
listLocationsDemo: async function () {
    var lRes = await EnapsoGraphDBAdmin.listLocations({
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
