![ENAPSO](https://i.ibb.co/6b3rXrB/enapso-client.png)

<div align="center">
  <h1><span style="font-weight:bold; color: #4299E1;">ENAPSO</span> Graph Database Admin</h1>
  <a href="https://www.npmjs.com/package/@innotrade/enapso-graphdb-admin"><img src="https://img.shields.io/npm/v/@innotrade/enapso-graphdb-admin" /></a>
  <a href="https://github.com/prisma/prisma/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/connect-Community-brightgreen" /></a>
  <a href="https://github.com/innotrade/enapso-graphdb-admin/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202-blue" /></a>
  <a href="https://github.com/innotrade/enapso-graphdb-admin/blob/main/CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/code-Conduct-orange" /></a>
  <br />
  <br />
  <a href="https://www.innotrade.com/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/innotrade/enapso-graphdb-admin/wiki">Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/innotrade/enapso-graphdb-admin/discussions">Discussion</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#">Facebook</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#">Twitter</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#">LinkedIn</a>
  <br />
  <hr />
</div>

ENAPSO Graph Database Admin client to easily perform administrative and monitoring operations against your RDF stores, your OWL ontologies or knowledge graphs in nodes.js applications. This client supports an easy import of existing RDF stores and ontologies to Graph Database by upload via file, strings or URLs as well as an export in numerous formats and also a context management. You can monitor the cpu load and memory usage of Graph Database and run the garbage collector on demand to optimally trigger huge batch operations also provide the user managememt, the creation and listing of new repositories as well as an location and cluster management of Graph Database.

As of now we support the connection with three major graph databases

-   [Ontotext GraphDB](https://www.ontotext.com/products/graphdb/)
-   [Apache Jena fuseki](https://jena.apache.org/)
-   [Stardog](https://www.stardog.com/)

There will be more graph databases added to this list in the future.

You may also find these tools useful

-   [**ENAPSO Graph Database Client**](https://github.com/innotrade/enapso-graphdb-admin): To perform SPARQL queries and update statements against your knowledge graphs or ontologies stored in your graph database.
-   [**ENAPSO Command Line Interface for Graph Databases**](https://github.com/innotrade/enapso-graphdb-admin): To easily perform numeropus scriptable convenience operations on graph databases.

[**Tutorial for Test Suite**](https://github.com/innotrade/enapso-graphdb-client/wiki/Tutorial-for-Graph-Databases-Test-Suite): To run the Test suites against the graph database.

Any questions and suggestions are welcome.

# Installation

```javascript

npm i @innotrade/enapso-graphdb-admin --save

```

## Create connection with Graph Database

```javascript
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { EnapsoGraphDBAdmin } = require('@innotrade/enapso-graphdb-admin');

let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: 'http://localhost:7200',
    repository: 'Test',
    prefixes: [
        {
            prefix: 'entest',
            iri: 'http://ont.enapso.com/test#'
        }
    ],
    triplestore: 'ontotext-graphDB',
    version: 9,
    apiType: 'RDF4J'
});
```

| Parameter             | Type             | Description                                                                                                                                     | Values                                      |
| --------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| baseURL(required)     | String           | Pass the URL in which graph databases is running.                                                                                               |                                             |
| repository(required)  | String           | Pass the name of repository or database of the graph databases with which you want to create connection.                                        |                                             |
| prefixes(required)    | Array of objects | Pass the prefix and its iri as object which will be used in the SPARQL query to perform crud operations.                                        |                                             |
| triplestore(optional) | String           | Pass the name of graph database with which you want to create connection by default it create connection with Ontotext GraphDB.                 | ('ontotext-graphDB' , 'stardog' , 'fuseki') |
| transform(optional)   | String           | Pass the type in which you want to show result of SPARQL query by default it show result in json format.                                        | ('toJSON', 'toCSV' , 'toTSV')               |
| version(optional)     | Number           | Pass the version of ontotext graphDB to make the tool compatible with older version by default it work with latest version of ontotext graphDB. |                                             |
| apiType(optional)     | String           | Pass the type of api which will use for importing ontology in ontotext graphDB by default it use ontotext graphDB workbench apis.               | ('workbench', 'RDF4J' )                     |

# Feature List of triplestores

| Feature                                                                                    | Ontotext GraphDB | Apache Jena Fuseki | Stardog |
| ------------------------------------------------------------------------------------------ | ---------------- | ------------------ | ------- |
| [Login](#login-to-graph-database)                                                          | ✔                | ✘                  | ✔       |
| [Query](#querying-against-the-graph-database)                                              | ✔                | ✔                  | ✔       |
| [Update](#updating-triples-in-graph-database)                                              | ✔                | ✔                  | ✔       |
| [Create Repository](#create-new-repository-in-your-graph-database-instance)                | ✔                | ✔                  | ✔       |
| [Delete Repository](#delete-repository-in-a-graph-database-instance)                       | ✔                | ✔                  | ✔       |
| [Clear Repository](#clear-entire-repository-of-your-graph-database-instance)               | ✔                | ✔                  | ✔       |
| [Get Repositories](#list-all-repositories-operated-in-the-graph-database-instance)         | ✔                | ✔                  | ✔       |
| [Create User](#create-new-user-and-assign-role)                                            | ✔                | ✘                  | ✔       |
| [Get Users](#list-all-users-of-a-graph-database-instance)                                  | ✔                | ✘                  | ✔       |
| [Update User](#update-user)                                                                | ✔                | ✘                  | ✘       |
| [Assign Role](#assign-role)                                                                | ✘                | ✘                  | ✔       |
| [Remove Role](#remove-role)                                                                | ✘                | ✘                  | ✔       |
| [Delete User](#delete-user)                                                                | ✔                | ✘                  | ✔       |
| [Drop SHACL Graph](#drop-shacl-shape-in-a-graph-database-instance)                         | ✔                | ✘                  | ✘       |
| [Get Contexts](#list-all-contexts-name-graphs-used-in-a-given-repository)                  | ✔                | ✔                  | ✔       |
| [Upload From File](#upload-a-file-to-graph-database)                                       | ✔                | ✔                  | ✔       |
| [Upload From Data](#upload-from-data-to-graph-database)                                    | ✔                | ✘                  | ✔       |
| [Download To File](#download-a-graph-from-graph-database-directly-to-a-local-file)         | ✔                | ✔                  | ✔       |
| [Download To Text](#download-a-graph-from-graph-database-to-a-text-variable)               | ✔                | ✔                  | ✔       |
| [Clear Context](#clear-entire-context-named-graph-of-a-given-repository)                   | ✔                | ✔                  | ✔       |
| [Get Query](#get-query-from-graph-database)                                                | ✔                | ✘                  | ✔       |
| [Get Locations](#list-all-graph-database-locations)                                        | ✔                | ✘                  | ✘       |
| [Perform Garbage Collections](#perform-garbage-collection-in-your-graph-database-instance) | ✔                | ✘                  | ✘       |
| [Get Saved Queries](#list-all-saved-queries-in-a-graph-database-instance)                  | ✔                | ✘                  | ✘       |

## Login to Graph Database

Login to authenticate the user against Graph Database and authorize the user according to his roles:

```javascript
graphDBEndpoint
    .login('admin', 'root')
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## Querying against the Graph Database

```
graphDBEndpoint
    .query(
        'select *
where {
    ?class rdf:type owl:Class
    filter(regex(str(?class), "http://ont.enapso.com/test#TestClass", "i")) .
}',
        { transform: 'toJSON' }
    )
    .then((result) => {
        console.log(
            'Read the classes name:\n' + JSON.stringify(result, null, 2)
        );
    })
    .catch((err) => {
        console.log(err);
    });
```

## Updating Triples in Graph Database

```
graphDBEndpoint
    .update(
        `insert data {
	   graph <http://ont.enapso.com/test> {
             entest:TestClass rdf:type owl:Class}
           }`
    )
    .then((result) => {
        console.log('inserted a class :\n' + JSON.stringify(result, null, 2));
    })
    .catch((err) => {
        `console.log(err);
    });
```

## Upload a File to Graph Database

Upload an ontology and import it into Graph Database repository automatically if upload was successful. context (graph) and baseIRI paramters are optional :

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

## Upload from Data to Graph Database

Upload data (rather than a file) and automatically import the data into a Graph Database repository and context (graph) is optional paramters:

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

## Download a Graph from Graph Database to a Text Variable

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

## Download a graph from Graph Database directly to a Local File

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

## Perform Garbage Collection in your Graph Database Instance

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

## Get Resource of Graph Database Instance

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

Create a new user and provide user with read/write access to certain repositories in a Graph Database instance:
if security is on then for Creating new User, user role need to be Adminstrator else operation not performed

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
if security is on then for Updating Existing User, user role need to be Adminstrator else operation not performed

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

## Update User

Update a user roles in Graph Database instance:

```javascript
graphDBEndpoint
    .deleteUser({
        username: 'TestUser',
        authorities: [
            // Writing excess wrote WRITE_ and in last name of Repository which excess provided
            'READ_REPO_Test', // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
            'WRITE_REPO_Vaccine',
            'READ_REPO_Vaccine',
            'ROLE_USER' // Role of the user
        ]
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
```

## Assign Role

Assign new roles to the user of Graph Database instance:

```javascript
graphDBEndpoint
    .assignRoles({
        userName: 'ashesh',
        authorities: [
            {
                action: 'READ',
                resource_type: 'db',
                resource: ['Test']
            },
            {
                action: 'WRITE',
                resource_type: 'db',
                resource: ['Test']
            }
        ]
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
```

## Remove Role

Remove existing roles of user in Graph Database instance:

```javascript
graphDBEndpoint
    .removeRoles({
        username: 'TestUser',
        authorities: [
            {
                action: 'READ',
                resource_type: 'db',
                resource: ['Test']
            },
            {
                action: 'WRITE',
                resource_type: 'db',
                resource: ['Test']
            }
        ]
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
Deletes a user from the Graph Database instance:
if security is on then for Deleting User, user role need to be Adminstrator else operation not performed

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

## List all Repositories operated in the Graph Database Instance

Get details of all repositories of the Graph Database repositories operated on the connected host:

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

## Clear entire Repository of your Graph Database Instance

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

## List all Users of a Graph Database Instance

Get all details of all users of a certain Graph Database instance:

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

## Get Query from Graph Database

Get Query from Graph Database:

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

## Clear entire Context (Named Graph) of a given Repository

**Caution! This removes ALL triples of the given context! This operation cannot be undone!**
The entire context will be emptied, i.e. all data from this context will be removed. The repository and other contexts remain active.

```javascript
graphDBEndpoint
    .clearContext('http://ont.enapso.com/test')
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err, 'process error here...');
    });
```

## List all Graph Database Locations

Get details of all location which are assosciated with the connected Graph Database instance:

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

## List all saved Queries in a Graph Database Instance

Get details of all queries which are saved in a Graph Database instance:

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

## Create new Repository in your Graph Database Instance

Create a new repository in your Graph Database instance, isShacl paramter is optional by defult it is false.
if security is on then for creating repository, user role need to be Repository Manager else operation not performed

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

## Delete Repository in a Graph Database Instance

Delete a repository in the connected Graph Database instance:
if security is on then for deleting repository, user role need to be Repository Manager else operation not performed

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

## Drop SHACL Shape in a Graph Database instance

Drop a shacl Shape from Graph Database to remove all validations:

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

## Contribution

If you have a bug to report, do not hesitate to contact us or to file an issue.

If you are willing to fix an issue or propose a [feature](https://www.innotrade.com/forum/); all PRs with clear explanations are welcome and encouraged.

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Documentation & Examples

For more use cases and detailed documentation follow the [wiki](https://github.com/innotrade/enapso-graphdb-admin/wiki)
