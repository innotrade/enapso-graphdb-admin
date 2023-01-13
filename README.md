![ENAPSO](https://i.ibb.co/yf9fm5g/enapso-graphdb.png)

<div align="center">
  <h1><span style="font-weight:bold; color: #4299E1;">ENAPSO</span> Graph Database Admin</h1>
  <a href="https://www.npmjs.com/package/@innotrade/enapso-graphdb-admin"><img src="https://img.shields.io/npm/v/@innotrade/enapso-graphdb-admin" /></a>
  <a href="https://github.com/innotrade/enapso-graphdb-client/blob/main/CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/connect-Community-brightgreen" /></a>
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

ENAPSO Graph Database Admin client to easily perform administrative and monitoring operations against your RDF stores, your OWL ontologies, or knowledge graphs in nodes.js applications. This client supports an easy import of existing RDF stores and ontologies to Graph Database by uploading via file, strings, or URLs as well as an export in numerous formats and also context management. You can monitor the CPU load and memory usage of Graph Database and run the garbage collector on demand to optimally trigger huge batch operations also provide user management, the creation, and listing of new repositories as well as location and cluster management of graph database.

As of now, we support the connection with three major graph databases

-   [Ontotext GraphDB](https://www.ontotext.com/products/graphdb/)
-   [Apache Jena fuseki](https://jena.apache.org/)
-   [Stardog](https://www.stardog.com/)

There will be more graph databases added to this list in the future.

You may also find these tools useful

-   [**ENAPSO Graph Database Client**](https://github.com/innotrade/enapso-graphdb-admin): To perform SPARQL queries and update statements against your knowledge graphs or ontologies stored in your graph database.
-   [**ENAPSO Command Line Interface for Graph Databases**](https://github.com/innotrade/enapso-graphdb-admin): To easily perform numerous scriptable convenience operations on graph databases.

# 🛠️&nbsp;Installation

```javascript

npm i @innotrade/enapso-graphdb-admin --save

```

## Create a connection with graph database

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
    triplestore: 'graphdb',
    version: 9,
    apiType: 'RDF4J'
});
```

### Parameters

| Parameter             | Type             | Description                                                                                                                                             | Values                             |
| --------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| baseURL(required)     | String           | Pass the URL in which graph database is running.                                                                                                        |                                    |
| repository(required)  | String           | Pass the name of the repository or database of the graph databases with which you want to create a connection.                                          |                                    |
| prefixes(required)    | Array of objects | Pass the prefix and its IRI as an object which will be used in the SPARQL query to perform crud operations.                                             |                                    |
| triplestore(optional) | String           | Pass the name of the graph database with which you want to create a connection by default it creates a connection with Ontotext GraphDB.                | ('graphdb' , 'stardog' , 'fuseki') |
| transform(optional)   | String           | Pass the type in which you want to show the result of the SPARQL query by default it shows the result in JSON format.                                   | ('toJSON', 'toCSV' , 'toTSV')      |
| version(optional)     | Number           | Pass the version of ontotext graphDB to make the tool compatible with an older version by default it works with the latest version of ontotext graphDB. |                                    |
| apiType(optional)     | String           | Pass the type of API which will use for importing ontology in ontotext graphDB by default it uses ontotext graphDB workbench APIs.                      | ('workbench', 'RDF4J' )            |

# 📋&nbsp;Features

| Feature                                                   | Description                                                        | Ontotext GraphDB | Apache Jena Fuseki | Stardog |
| --------------------------------------------------------- | ------------------------------------------------------------------ | ---------------- | ------------------ | ------- |
| [Login](#login)                                           | Authenticate against the graph database                            | ✔                | ✘                  | ✔       |
| [Query](#query)                                           | To retrieve the information from graph database using SPARQL query | ✔                | ✔                  | ✔       |
| [Update](#update)                                         | To update the triples in the graph database.                       | ✔                | ✔                  | ✔       |
| [Create Repository](#create-repository)                   | Create new repository/database in the graph database.              | ✔                | ✔                  | ✔       |
| [Delete Repository](#delete-repository)                   | Delete existing repository/database from graph database.           | ✔                | ✔                  | ✔       |
| [Clear Repository](#clear-repository)                     | Remove all triples from graph database repository/database.        | ✔                | ✔                  | ✔       |
| [Get Repositories](#get-repositories)                     | Get list of all repsoitory from graph database.                    | ✔                | ✔                  | ✔       |
| [Create User](#create-user)                               | Create new user and asign the roles in the graph database.         | ✔                | ✘                  | ✔       |
| [Get Users](#get-users)                                   | Get list of users from graph database.                             | ✔                | ✘                  | ✔       |
| [Get Resources](#get-resources)                           | Get list of resources from graph database.                         | ✔                | ✘                  | ✘       |
| [Update User](#update-user)                               | Update existing user roles from graph database.                    | ✔                | ✘                  | ✘       |
| [Assign Role](#assign-role)                               | Assign new roles to the existing user of the graph database.       | ✘                | ✘                  | ✔       |
| [Remove Role](#remove-role)                               | Remove roles of the existing user of the graph database.           | ✘                | ✘                  | ✔       |
| [Delete User](#delete-user)                               | Delete existing user of graph database.                            | ✔                | ✘                  | ✔       |
| [Drop SHACL Graph](#drop-shacl-graph)                     | Drop SHACL graph from graph database.                              | ✔                | ✘                  | ✘       |
| [Get Contexts](#get-contexts)                             | Get all context from graph database repository.                    | ✔                | ✔                  | ✔       |
| [Upload From File](#upload-from-file)                     | Upload ontology from file in the graph database.                   | ✔                | ✔                  | ✔       |
| [Upload From Data](#upload-from-data)                     | Upoad ontology from data in the graph database.                    | ✔                | ✘                  | ✔       |
| [Download To File](#download-to-file)                     | Download ontology to file from graph database.                     | ✔                | ✔                  | ✔       |
| [Download To Text](#download-to-text)                     | Download ontology to text from graph database.                     | ✔                | ✔                  | ✔       |
| [Clear Context](#clear-context)                           | Clear specific named graph from graph database repository.         | ✔                | ✔                  | ✔       |
| [Get Query](#get-query)                                   | Get query from graph database repository.                          | ✔                | ✘                  | ✔       |
| [Get Locations](#get-locations)                           | Get locations from graph database repository.                      | ✔                | ✘                  | ✘       |
| [Perform Garbage Collection](#perform-garbage-collection) | Perform garbage collection in the graph database repository.       | ✔                | ✘                  | ✘       |
| [Get Saved Queries](#get-saved-queries)                   | Get saved queries from graph database.                             | ✔                | ✘                  | ✘       |

<details open>
<summary>
  
## Login
</summary>

Login to authenticate the user against graph database and authorize the user according to his roles:

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

</details>

<details open>
<summary>
  
## Query
</summary>

Querying against the graph database

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

</details>

<details open>
<summary>
  
## Update
</summary>

Updating Triples in graph database

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

</details>

<details>
<summary>
  
## Upload From File
</summary>

Upload an ontology and import it into the graph database repository automatically if the upload was successful. context (graph) and baseIRI parameters are optional :

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

</details>

<details>
<summary>
  
## Upload From Data
</summary>

Upload data (rather than a file) and automatically import the data into a graph database repository and context (graph) is an optional parameter:

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

</details>

<details>
<summary>
  
## Download To Text
</summary>

Download a Graph from graph database to a Text Variable.
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

</details>

<details>
<summary>
  
## Download To File
</summary>

Download a graph from graph database directly to a Local File.
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

</details>

<details>
<summary>
  
## Perform Garbage Collection
</summary>

Perform the garbage collection on the server side to release allocated resources:
if security is on then the Garbage Collection user role needs to be Administrator else operation is not performed

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

</details>

<details>
<summary>
  
## Get Resources
</summary>

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

</details>

<details>
<summary>
  
## Create User
</summary>

Create a new user and provide a user with read/write access to certain repositories in a graph database instance:
if security is on then for Creating a new User, the user role needs to be Administrator else operation is not performed

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

</details>

<details>
<summary>
  
## Update User
</summary>

Update the user's roles (read/write rights) for certain repositories:
if security is on then for Updating Existing User, the user role needs to be Administrator else operation is not performed

```javascript
graphDBEndpoint
    .updateUser({
        authorities: [
            // Writing excess wrote WRITE_ and in the last name of Repository which excess provided like REPO_Test
            'READ_REPO_Test', // Reading excess wrote READ_ and in the last name of Repository which excess provided like REPO_Test
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

</details>

<details>
<summary>
  
## Assign Role
</summary>

Assign new roles to the user of the graph database instance

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

</details>

<details>
<summary>
  
## Remove Role
</summary>

Remove existing roles of a user in the graph database instance

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

</details>

<details>
<summary>
  
## Delete User
</summary>

**Caution! This deletes the user including all assigned authorities (roles)! This operation cannot be undone!**
Deletes a user from the graph database instance:
if security is on then for Deleting User, the user role needs to be Administrator else operation is not performed

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

</details>

<details>
<summary>
  
## Get Repositories
</summary>

Get details of all repositories of the graph database repositories operated on the connected host:

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

</details>

<details>
<summary>
  
## Clear Repository
</summary>

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

</details>

<details>
<summary>
  
## Get Users
</summary>

Get all details of all users of a certain graph database instance:

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

</details>

<details>
<summary>
  
## Get Query
</summary>

Get Query from graph database:

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

</details>

<details>
<summary>
  
## Get Contexts
</summary>

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

</details>

<details>
<summary>
  
## Clear Context
</summary>

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

</details>

<details>
<summary>
  
## Get Locations
</summary>

Get details of all locations which are associated with the connected graph database instance:

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

</details>

<details>
<summary>
  
## Get Saved Queries
</summary>
Get details of all queries which are saved in a graph database instance:

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

</details>

<details>
<summary>
  
## Create Repository
</summary>

Create a new repository in the graph database instance, isShacl parameter is optional by default it is false.
if security is on then for creating a repository, the user role needs to be Repository Manager else operation is not performed

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

</details>

<details>
<summary>
  
## Delete Repository
</summary>

Delete a repository in the connected graph database instance:
if security is on then for deleting the repository, the user role needs to be Repository Manager else operation is not performed

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

</details>

<details>
<summary>
  
## Drop SHACL Graph
</summary>

Drop a shacl Shape from graph database to remove all validations:

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

</details>

<div>  
  &nbsp; 
</div>

# 📖&nbsp;Documentation

[View the documentation](https://github.com/innotrade/enapso-graphdb-admin/wiki) for further usage examples.

<div>  
  &nbsp; 
</div>

# 🧪&nbsp;Testing

[Tutorial](https://github.com/innotrade/enapso-graphdb-client/wiki/Tutorial-for-Graph-Databases-Test-Suite) to run the Test suite against the graph database.

<div>  
  &nbsp; 
</div>

# 😎&nbsp;Contributing

Contributing is more than just coding. You can help the project in many ways, and we will be very
happy to accept your contribution to our project.

Details of how you can help the project are described in the [CONTRIBUTING.md](./CONTRIBUTING.md)
document.

## 🧑‍🏫&nbsp;Contributors

<a href = "https://github.com/Tanu-N-Prabhu/Python/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=innotrade/enapso-graphdb-admin" width="120" />
</a>

<div>  
  &nbsp; 
</div>

# 💬&nbsp;Bugs and Feature Requests

Do you have a bug report or a feature request?

Please feel free to add a [new
issue](https://github.com/innotrade/enapso-graphdb-admin/issues/new) or write to us in [discussion](https://github.com/innotrade/enapso-graphdb-admin/discussions): Any questions and suggestions are welcome.

<div>  
  &nbsp; 
</div>

# 🧾&nbsp;License

This project is licensed under the Apache 2.0 License. See the [LICENSE](./LICENSE) file for more
details.
