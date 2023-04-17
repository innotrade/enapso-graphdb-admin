// Innotrade ENAPSO - Graph Database Admin Example
// (C) Copyright 2021-2022 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s): Alexander Schulze and Muhammad Yasir
// require the ENAPSO Graph Database Admin Demo module
require('@innotrade/enapso-config');
const fsPromises = require('fs').promises,
    { EnapsoGraphDBClient } = requireEx('@innotrade/enapso-graphdb-client'),
    { EnapsoGraphDBAdmin } = require('../index'),
    { EnapsoLogger, EnapsoLoggerFactory } = require('@innotrade/enapso-logger');
EnapsoLoggerFactory.createGlobalLogger('enLogger');
enLogger.setLevel(EnapsoLogger.ALL);

// // connection data to the running Graph Database instance

const GRAPHDB_BASE_URL = encfg.getConfig(
        'enapsoDefaultGraphDB.baseUrl',
        'http://localhost:7200'
    ),
    GRAPHDB_REPOSITORY = encfg.getConfig(
        'enapsoDefaultGraphDB.repository',
        'Test'
    ),
    GRAPHDB_USERNAME = encfg.getConfig(
        'enapsoDefaultGraphDB.userName',
        'admin'
    ),
    GRAPHDB_PASSWORD = encfg.getConfig('enapsoDefaultGraphDB.password', 'root'),
    GRAPHDB_CONTEXT_TEST = encfg.getConfig(
        'enapsoDefaultGraphDB.ContextTest',
        'http://ont.enapso.com/test'
    ),
    GRAPHDB_CONTEXT_SHACL = encfg.getConfig(
        'enapsoDefaultGraphDB.ContextShacl',
        'http://rdf4j.org/schema/rdf4j#SHACLShapeGraph'
    ),
    GRAPHDB_API_TYPE = 'RDF4J',
    GRAPHDB_VERSION = 10,
    triplestore = 'graphdb';
// triplestore = 'graphdb';

// // the default prefixes for all SPARQL queries
const GRAPHDB_DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS
];

enLogger.info(
    'ENAPSO Graph Database Admin Demo\n(C) Copyright 2021-2022 Innotrade GmbH, Herzogenrath, NRW, Germany'
);

const EnapsoGraphDBAdminDemo = {
    graphDBEndpoint: null,
    authentication: null,

    createEndpoint() {
        try {
            // instantiate a new Graph Database endpoint
            return new EnapsoGraphDBClient.Endpoint({
                baseURL: GRAPHDB_BASE_URL,
                repository: GRAPHDB_REPOSITORY,
                prefixes: GRAPHDB_DEFAULT_PREFIXES,
                apiType: GRAPHDB_API_TYPE,
                triplestore: triplestore
                // version: GRAPHDB_VERSION
            });
        } catch (err) {
            console.log(err);
        }
    },

    // login: async function () {
    async login() {
        try {
            // login into Graph Database using JWT
            let lRes = await this.graphDBEndpoint.login(
                GRAPHDB_USERNAME,
                GRAPHDB_PASSWORD
            );
            return lRes;
        } catch (err) {
            console.log(err);
        }
    },

    async demoCreateRepository() {
        try {
            let resp = await this.graphDBEndpoint.createRepository({
                id: 'AutomatedTest',
                title: 'enapso Automated Test Repository',
                location: '',
                isShacl: true
            });
            enLogger.info('Create Repository:' + JSON.stringify(resp, null, 2));
        } catch (err) {
            console.log(err);
        }
    },

    async demoCreateUser() {
        try {
            let lRes = await this.graphDBEndpoint.login(
                GRAPHDB_USERNAME,
                GRAPHDB_PASSWORD
            );
            // todo: interpret lRes here, it does not makes sense to continue if login does not work!
            let resp = await this.graphDBEndpoint.createUser({
                // authorities: [
                //     'WRITE_REPO_Test', // Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
                //     'READ_REPO_Test', // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
                //     'READ_REPO_Vaccine',
                //     'ROLE_USER' // Role of the user
                // ],
                authorities: [
                    {
                        action: 'CREATE',
                        resource_type: 'db',
                        resource: ['Test']
                    }
                ],
                username: 'TestUser', // Username
                password: 'TestUser' // Password for the user
            });
            enLogger.info('Create New User:' + JSON.stringify(resp, null, 2));
        } catch (err) {
            console.log(err);
        }
    },

    async demoUpdateUser() {
        try {
            let lRes = await this.graphDBEndpoint.login('admin', 'root');
            // todo: interpret lRes here, it does not makes sense to continue if login does not work!
            let resp = await this.graphDBEndpoint.updateUser({
                authorities: [
                    // Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
                    'READ_REPO_Test', // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
                    'WRITE_REPO_Vaccine',
                    'READ_REPO_Vaccine',
                    'ROLE_USER' // Role of the user
                ],
                username: 'TestUser' // Username
            });
            enLogger.info(
                'Update Inserted User:' + JSON.stringify(resp, null, 2)
            );
        } catch (err) {
            console.log(err);
        }
    },
    async demoAssignRoles(args) {
        try {
            let resp = await this.graphDBEndpoint.assignRoles(args);
            enLogger.log(
                'Assign Role to User:' + JSON.stringify(resp, null, 2)
            );
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    async demoRemoveRoles(args) {
        try {
            let resp = await this.graphDBEndpoint.removeRoles(args);
            enLogger.log(
                'Remove Role from User:' + JSON.stringify(resp, null, 2)
            );
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    async demoDeleteUser() {
        try {
            let lRes = await this.graphDBEndpoint.login(
                GRAPHDB_USERNAME,
                GRAPHDB_PASSWORD
            );
            // todo: interpret lRes here, it does not makes sense to continue if login does not work!
            let resp = await this.graphDBEndpoint.deleteUser({
                user: 'TestUser' // username which you want to delete
            });
            enLogger.info(
                'Delete Exisiting User:' + JSON.stringify(resp, null, 2)
            );
        } catch (err) {
            console.log(err);
        }
    },

    async demoDeleteRepository() {
        try {
            let resp = await this.graphDBEndpoint.deleteRepository({
                id: 'AutomatedTest'
            });
            enLogger.info('Delete Repository:' + JSON.stringify(resp, null, 2));
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetRepositories() {
        try {
            // lists all repositories
            resp = await this.graphDBEndpoint.getRepositories();
            enLogger.info('\nRepositories:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoClearRepository() {
        try {
            // clear entire repository
            // CAUTION! This operation empties the entire repository
            // and cannot be undone!
            let resp = await this.graphDBEndpoint.clearRepository();
            enLogger.info(
                '\nClearRepository :\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoDropShaclGraph() {
        try {
            // clear entire repository
            // CAUTION! This operation empties the entire repository
            // and cannot be undone!
            let resp = await this.graphDBEndpoint.dropShaclGraph();
            enLogger.info(
                '\nDropShaclGraph :\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetUsers() {
        try {
            // lists all users (requires admin role)
            let resp = await this.graphDBEndpoint.getUsers();
            enLogger.info('\nUsers:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetLocations() {
        try {
            // lists all locations, requires repository manager role!
            let resp = await this.graphDBEndpoint.getLocations();
            enLogger.info('\nLocations:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetContexts() {
        try {
            // lists all contexts (named graph) in the repository
            let resp = await this.graphDBEndpoint.getContexts();
            enLogger.info('\nContexts:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoClearContext() {
        try {
            // clear context (named graph)
            // CAUTION! This operation empties the named graph
            // of the repository and cannot be undone!
            let resp = await this.graphDBEndpoint.clearContext(
                GRAPHDB_CONTEXT_TEST
            );
            enLogger.info('\nClearContext :\n' + JSON.stringify(resp, null, 2));
            return;
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetSavedQueries() {
        // clear context (named graph)
        // CAUTION! This operation empties the named graph
        // of the repository and cannot be undone!
        try {
            let resp = await this.graphDBEndpoint.getSavedQueries();
            enLogger.info(
                '\nGetSavedQueries :\n' + JSON.stringify(resp, null, 2)
            );
            return;
        } catch (err) {
            console.log(err);
        }
    },

    async demoUploadFromFile() {
        // upload a file
        try {
            let resp = await this.graphDBEndpoint.uploadFromFile({
                filename: './ontologies/Test.ttl',
                format: 'text/turtle'
            });
            enLogger.info(
                '\nUploadFromFile:\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },
    async demoImportServerFile() {
        // upload a file
        try {
            let resp = await this.graphDBEndpoint.importServerFile({
                filename: 'Test.ttl'
            });
            enLogger.info(
                '\nUploadFromFile:\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoUploadFromData() {
        try {
            // upload a file
            // todo: we upload from data here but pass a file name???
            let data = await fsPromises.readFile(
                '../ontologies/EnapsoTest.owl',
                'utf-8'
            );
            let resp = await this.graphDBEndpoint.uploadFromData({
                data: data,
                context: 'http://ont.enapso.com/test',
                // format: EnapsoGraphDBClient.FORMAT_TURTLE.type
                format: 'application/rdf+xml'
            });
            enLogger.info(
                '\nUploadFromData:\n' + JSON.stringify(resp.success, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoDownloadToFile() {
        try {
            // download a repository or named graph to file
            let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
            let resp = await this.graphDBEndpoint.downloadToFile({
                format: lFormat.type,
                filename:
                    '../ontologies/' +
                    this.graphDBEndpoint.getRepository() +
                    lFormat.extension
            });
            enLogger.info(
                '\nDownload (file):\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoDownloadToText() {
        try {
            // download a repository or named graph to memory
            resp = await this.graphDBEndpoint.downloadToText({
                format: EnapsoGraphDBClient.FORMAT_TURTLE.type
            });
            enLogger.info(
                '\nDownload (text):\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoQuery() {
        try {
            // perform a query
            let query = `
        select * 
            from <${GRAPHDB_CONTEXT_TEST}>
        where {
            ?s ?p ?o
        } `;
            let binding = await this.graphDBEndpoint.query(query);
            // if a result was successfully returned
            if (binding.success) {
                // transform the bindings into a more convenient result format (optional)
                let resp = EnapsoGraphDBClient.transformBindingsToResultSet(
                    binding,
                    {
                        // drop the prefixes for easier resultset readability (optional)
                        dropPrefixes: false
                    }
                );
                enLogger.info(
                    'Query succeeded:\n' + JSON.stringify(resp, null, 2)
                );
            } else {
                enLogger.info(
                    'Query failed:\n' + JSON.stringify(binding, null, 2)
                );
            }
        } catch (err) {
            console.log(err);
        }
    },

    async demoInsert() {
        try {
            // perform an update (insert operation)
            let update = `
            prefix et: <http://ont.enapso.com/test#>
            insert data {
                graph <${GRAPHDB_CONTEXT_TEST}> {
                    et:TestClass rdf:type owl:Class
                }
            }
        `;
            let resp = await this.graphDBEndpoint.update(update);
            // if a result was successfully returned
            if (resp.success) {
                enLogger.info(
                    'Update succeeded:\n' + JSON.stringify(resp, null, 2)
                );
            } else {
                enLogger.info(
                    'Update failed:\n' + JSON.stringify(resp, null, 2)
                );
            }
        } catch (err) {
            console.log(err);
        }
    },

    async demoUpdate() {
        try {
            // perform an update (update operation)
            let update = `
            prefix et: <http://ont.enapso.com/test#>
            with <${GRAPHDB_CONTEXT_TEST}>
            delete {
                et:TestClass rdf:type owl:Class
            }
            insert {
                et:TestClassUpdated rdf:type owl:Class
            }
            where {
                et:TestClass rdf:type owl:Class
            }
        `;
            let resp = await this.graphDBEndpoint.update(update);
            // if a result was successfully returned
            if (resp.success) {
                enLogger.info(
                    'Update succeeded:\n' + JSON.stringify(resp, null, 2)
                );
            } else {
                enLogger.info(
                    'Update failed:\n' + JSON.stringify(resp, null, 2)
                );
            }
        } catch (err) {
            console.log(err);
        }
    },

    async demoDelete() {
        try {
            // perform an update (delete operation)
            let update = `
            prefix et: <http://ont.enapso.com/test#>
            with <http://ont.enapso.com/test>
            delete {
                et:TestClassUpdated rdf:type owl:Class
            }
            where {
                et:TestClassUpdated rdf:type owl:Class
            }
        `;
            let resp = await this.graphDBEndpoint.update(update);
            // if a result was successfully returned
            if (resp.success) {
                enLogger.info(
                    'Update succeeded:\n' + JSON.stringify(resp, null, 2)
                );
            } else {
                enLogger.info(
                    'Update failed:\n' + JSON.stringify(resp, null, 2)
                );
            }
        } catch (err) {
            console.log(err);
        }
    },

    async demoPerformGarbageCollection() {
        try {
            // lists all contexts (named graph) in the repository
            let resp = await this.graphDBEndpoint.performGarbageCollection();
            enLogger.info(
                '\nGarbage Collection:\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetResources() {
        try {
            // lists all contexts (named graph) in the repository
            let resp = await this.graphDBEndpoint.getResources();
            enLogger.info('\nResources:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoWaitForGraphDB() {
        try {
            // lists all contexts (named graph) in the repository
            enLogger.info('\nWaiting for GraphDB...');
            let resp = await this.graphDBEndpoint.waitForGraphDB({
                timeout: 10000, // wait at most 10 seconds
                interval: 2000, // check resources all 2 seconds
                cpuWatermark: 0.8,
                memoryWatermark: 0.7,
                performGarbageCollection: true,
                callback: function (aEvent) {
                    enLogger.info(JSON.stringify(aEvent));
                }
            });
            enLogger.info(
                'Wait for GraphDB:\n' + JSON.stringify(resp, null, 2)
            );
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoGetQuery() {
        try {
            // lists all contexts (named graph) in the repository
            let resp = await this.graphDBEndpoint.getQuery();
            enLogger.info('\nGet Query:\n' + JSON.stringify(resp, null, 2));
            return resp;
        } catch (err) {
            console.log(err);
        }
    },

    async demoShacl() {
        try {
            let resp;

            // read sparqls
            let validSparql = await fsPromises.readFile(
                '../test/validUpdate.sparql',
                'utf-8'
            );
            let invalidSparql = await fsPromises.readFile(
                '../test/invalidUpdate.sparql',
                'utf-8'
            );
            let getPersonsSparql = await fsPromises.readFile(
                '../test/selectAllPersons.sparql',
                'utf-8'
            );
            // read the shacl turtle
            let shaclTtl = await fsPromises.readFile(
                '../ontologies/EnapsoTestShacl.ttl',
                'utf-8'
            );
            // read the shacl json-ld
            let shaclJsonLd = await fsPromises.readFile(
                '../ontologies/EnapsoTestShacl.jsonld',
                'utf-8'
            );

            // first drop the shacl graph if exists, if it does not exist, this will not be a problem
            enLogger.info('\nDropping SHACL Graph...');
            resp = await this.graphDBEndpoint.dropShaclGraph();
            enLogger.info(
                '\nDrop SHACL Graph:\n' + JSON.stringify(resp, null, 2)
            );

            // now clear the current repository to ensure that there is no old data inside that could disturb the tests
            enLogger.info('\nClearing repository...');
            resp = await this.graphDBEndpoint.clearRepository();
            enLogger.info(
                '\nCleared repository:\n' + JSON.stringify(resp, null, 2)
            );

            // now upload ontology directly from test ontology file into test graph into the test repository
            enLogger.info('\nUploading ontology from file...');
            resp = await this.graphDBEndpoint.uploadFromFile({
                filename: '../ontologies/EnapsoTest.owl',
                context: GRAPHDB_CONTEXT_TEST,
                format: EnapsoGraphDBClient.FORMAT_RDF_XML.type
            });
            enLogger.info(
                '\nUploaded ontology from file:\n' +
                    JSON.stringify(resp, null, 2)
            );

            resp = await this.graphDBEndpoint.query(getPersonsSparql);
            enLogger.info(
                '\nGet Persons after upload (supposed to work):\n' +
                    JSON.stringify(resp, null, 2)
            );

            // first try all actions w/o a shacl being applied
            resp = await this.graphDBEndpoint.update(validSparql);
            enLogger.info(
                '\nValid SPARQL w/o SHACL (supposed to work):\n' +
                    JSON.stringify(resp, null, 2)
            );

            resp = await this.graphDBEndpoint.update(invalidSparql);
            enLogger.info(
                'Invalid SPARQL w/o SHACL (supposed to work):\n' +
                    JSON.stringify(resp, null, 2)
            );

            resp = await this.graphDBEndpoint.query(getPersonsSparql);
            enLogger.info(
                '\nGet Persons w/o SHACL (supposed to work):\n' +
                    JSON.stringify(resp, null, 2)
            );

            // now clear the repository again, it contains invalid data from the tests w/o shacl support
            enLogger.info('\nClearing repository...');
            resp = await this.graphDBEndpoint.clearRepository();
            enLogger.info(
                '\nCleared repository:\n' + JSON.stringify(resp, null, 2)
            );

            // and upload ontology again to have the same initital status for shacl tests as w/o the shacl tests
            enLogger.info('\nUploading ontology from file...');
            resp = await this.graphDBEndpoint.uploadFromFile({
                filename: '../ontologies/EnapsoTest.owl',
                context: GRAPHDB_CONTEXT_TEST,
                format: EnapsoGraphDBClient.FORMAT_RDF_XML.type
            });
            enLogger.info(
                '\nUploaded ontology from file:\n' +
                    JSON.stringify(resp, null, 2)
            );

            // now load the shacl on top of the correct ontology
            enLogger.info('\nUploading SHACL from Data...');
            // now upload the shacl file, using correct context (graph name) and format!
            resp = await this.graphDBEndpoint.uploadFromData({
                // data: shaclTtl,
                data: shaclJsonLd,
                context: GRAPHDB_CONTEXT_SHACL,
                // format: EnapsoGraphDBClient.FORMAT_TURTLE.type
                format: EnapsoGraphDBClient.FORMAT_JSON_LD.type
            });
            enLogger.info(
                '\nUploaded SHACL from Data:\n' + JSON.stringify(resp, null, 2)
            );

            // next try all actions w/o a shacl being applied
            resp = await this.graphDBEndpoint.update(validSparql);
            enLogger.info(
                '\nValid SPARQL with SHACL support (supposed to work):\n' +
                    JSON.stringify(resp, null, 2)
            );

            resp = await this.graphDBEndpoint.update(invalidSparql);
            enLogger.info(
                '\nInvalid SPARQL with SHACL support (NOT supposed to work):\n' +
                    JSON.stringify(resp, null, 2)
            );

            resp = await this.graphDBEndpoint.query(getPersonsSparql);
            enLogger.info(
                '\nGet Persons with SHACL support (supposed to work):\n' +
                    JSON.stringify(resp, null, 2)
            );

            enLogger.info('\nDone');
        } catch (err) {
            console.log(err);
        }
    },

    async demo() {
        this.graphDBEndpoint = await this.createEndpoint();
        this.authentication = await this.login();
        // // verify authentication
        // if (!this.authentication.success) {
        //     enLogger.info(
        //         '\nLogin failed:\n' +
        //             JSON.stringify(this.authentication, null, 2)
        //     );
        //     return;
        // }
        // enLogger.info('\nLogin successful');
        // await this.demoAssignRoles({
        //     userName: 'ashesh',
        //     authorities: [
        //         {
        //             action: 'READ',
        //             resource_type: 'db',
        //             resource: ['Test']
        //         },
        //         {
        //             action: 'WRITE',
        //             resource_type: 'db',
        //             resource: ['Test']
        //         }
        //     ]
        // });
        // await this.demoRemoveRoles({
        //     userName: 'ashesh',
        //     authorities: [
        //         {
        //             action: 'CREATE',
        //             resource_type: 'db',
        //             resource: ['Test']
        //         },
        //         {
        //             action: 'WRITE',
        //             resource_type: 'db',
        //             resource: ['Test']
        //         }
        //     ]
        // });
        // clear entire repository
        // CAUTION! This operation empties the entire repository and cannot be undone!
        // this.demoClearRepository();
        // this.demoUploadFromData();
        // // clear entire context (named graph)
        // // CAUTION! This operation empties the entire context (named graph) and cannot be undone!
        // this.demoClearContext();
        // this.demoGetRepositories();
        // // getLocations requires repository manager role!
        // this.demoGetLocations();
        // getUsers requires admin role!
        // this.demoGetUsers();
        // this.demoGetContexts();
        // this.demoGetSavedQueries();
        this.demoImportServerFile();
        // this.demoUploadFromFile();
        // this.demoDownloadToFile();
        // this.demoDownloadToText();
        // this.demoShacl();
        // await this.demoDropShaclGraph();
        // enLogger.info('--- Inserting new triple --- ');
        // await this.demoInsert();
        //enLogger.info("--- Graph should contain TestClass now --- ")
        // await this.demoQuery();
        /*
			 await this.demoDownloadToFile();
			enLogger.info("--- Updating existing triple --- ")
			await this.demoUpdate();
			enLogger.info("--- Graph should contain TestClassUpdated now --- ")
			await this.demoQuery();
			enLogger.info("--- Deleting existing triple --- ")
			await this.demoDelete();
			enLogger.info("--- Graph should not contain TestClassUpdated anymore --- ")
			await this.demoQuery();
			*/
        // await this.demoGetResources();
        // await this.demoPerformGarbageCollection();
        // await this.demoGetResources();
        // await this.demoCreateRepository();
        // await this.demoDeleteRepository();
        // await this.demoCreateUser();
        // await this.demoUpdateUser();
        // await this.demoDeleteUser();
        // await this.demoClearRepository();
        // enLogger.info('Start: ' + new Date().toISOString());
        // await this.demoWaitForGraphDB();
        // enLogger.info('Finish: ' + new Date().toISOString());

        // await this.demoGetQuery();
    }
};

EnapsoGraphDBAdminDemo.demo();
