/* eslint-disable prettier/prettier */
/* eslint-disable no-console, func-names, no-undef, no-restricted-syntax, no-unused-expressions */
// Innotrade enapso GraphDB Admin - Automated Test Suite
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze and Muhammad Yasir
require('@innotrade/enapso-config');
const chai = require('chai');

const { expect } = chai;
const { EnapsoGraphDBClient } = requireEx('@innotrade/enapso-graphdb-client');
/* eslint-disable no-unused-vars */
// this is required to add the admin features for the client
const { EnapsoGraphDBAdmin } = require('../index');
const testConfig = require('./config');

describe('ENAPSO GraphDB Admin Automated Test Suite', () => {
    // this.timeout(60000);

    // instantiate a new GraphDB endpoint
    const lEndpoint = new EnapsoGraphDBClient.Endpoint({
        baseURL: testConfig.baseURL,
        repository: testConfig.repository,
        prefixes: testConfig.prefixes,
        version: testConfig.version,
        triplestore: testConfig.triplestore
    });

    it('Authenticate against GraphDB instance', (done) => {
        if (testConfig.triplestore != 'fuseki') {
            lEndpoint
                .login(testConfig.adminUsername, testConfig.adminPassword)
                .then((result) => {
                    expect(result).to.have.property('status', 200);
                    done();
                })
                .catch((err) => {
                    console.log(`Authentication: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Create new repository in Graphdb', (done) => {
        lEndpoint
            .createRepository({
                id: testConfig.newRepository,
                title: 'enapso Automated Test Repository',
                location: ''
            })
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Create new repository: ${err.message}`);
                done(err);
            });
    });

    it('Create test user in GraphDB instance', (done) => {
        if (testConfig.triplestore != 'fuseki') {
            let role;
            if (testConfig.triplestore == 'stardog') {
                role = testConfig.stardogUserAuthorities;
            } else {
                role = testConfig.authorities;
            }
            lEndpoint
                .createUser({
                    username: testConfig.newUsername, // Username
                    password: testConfig.newPassword, // Password for the user
                    authorities: role
                })
                .then((result) => {
                    expect(result).to.have.property('status', 201);
                    done();
                })
                .catch((err) => {
                    console.log(`Create new user: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Find test users in GraphDB instance', (done) => {
        if (testConfig.triplestore != 'fuseki') {
            lEndpoint
                .getUsers({})
                .then((result) => {
                    expect(result).to.have.property('success', true);
                    done();
                })
                .catch((err) => {
                    console.log(`Find user: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Update test users roles in GraphDB instance', (done) => {
        if (testConfig.triplestore == 'graphDB') {
            lEndpoint
                .updateUser({
                    authorities: testConfig.updateGraphDBUserRole,
                    username: testConfig.newUsername
                })
                .then((result) => {
                    expect(result).to.have.property('success', true);
                    done();
                })
                .catch((err) => {
                    console.log(`Find user: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Assign Role to users stardog instance', (done) => {
        if (testConfig.triplestore == 'stardog') {
            lEndpoint
                .assignRoles({
                    authorities: testConfig.roles,
                    username: testConfig.newUsername
                })
                .then((result) => {
                    expect(result).to.have.property('success', true);
                    done();
                })
                .catch((err) => {
                    console.log(`Assign role to user: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Remove Role to users stardog instance', (done) => {
        if (testConfig.triplestore == 'stardog') {
            lEndpoint
                .removeRoles({
                    authorities: testConfig.roles,
                    username: testConfig.newUsername
                })
                .then((result) => {
                    done();
                })
                .catch((err) => {
                    console.log(`Remove user role: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Delete test user from GraphDB instance', (done) => {
        if (testConfig.triplestore != 'fuseki') {
            lEndpoint
                .deleteUser({
                    user: testConfig.newUsername // username which you want to delete
                })
                .then((result) => {
                    expect(result).to.have.property('status', 204);
                    done();
                })
                .catch((err) => {
                    console.log(`Delete user: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Find Newly created repository in GraphDB', (done) => {
        lEndpoint
            .getRepositories({})
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Find repo: ${err.message}`);
                done(err);
            });
    });

    it('Get contexts (graphs) of the test repository of the GraphDB instance', (done) => {
        lEndpoint
            .getContexts()
            .then((result) => {
                // console.log(JSON.stringify(result, null, 2));
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Get contexts: ${err.message}`);
                done(err);
            });
    });

    it('Delete newly created repository in Graphdb', (done) => {
        lEndpoint
            .deleteRepository({
                id: testConfig.newRepository
            })
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Delete repo: ${err.message}`);
                done();
            });
    });

    it('Clear Repository', (done) => {
        lEndpoint
            .clearRepository()
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`clearr repo: ${err.message}`);
                done(err);
            });
    });

    it('Drop SHACL from GraphDB', (done) => {
        if (
            testConfig.triplestore != 'fuseki' &&
            testConfig.triplestore != 'stardog'
        ) {
            lEndpoint
                .dropShaclGraph()
                .then((result) => {
                    expect(result).to.have.property('success', true);
                    done();
                })
                .catch((err) => {
                    console.log(`Drop shacl: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Upload Ontology to GraphDB', (done) => {
        lEndpoint
            .uploadFromFile({
                filename: './ontologies/EnapsoTest.owl',
                format: 'application/rdf+xml',
                baseIRI: 'http://ont.enapso.com/test#',
                context: 'http://ont.enapso.com/test'
            })
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Upload Ontology: ${err.message}`);
                done(err);
            });
    });

    it('Download Ontology from GraphDB', (done) => {
        const lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
        lEndpoint
            .downloadToFile({
                format: lFormat.type,
                filename: `ontologies/${lEndpoint.getRepository()}${
                    lFormat.extension
                }`
            })
            .then((result) => {
                // console.log(result);
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Download Ontology: ${err.message}`);
                done(err);
            });
    });

    it('Clear context of graph', (done) => {
        lEndpoint
            .clearContext('http://ont.enapso.com/test')
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Clear context of graph: ${err.message}`);
                done(err);
            });
    });

    it('Get running queries from GraphDB', (done) => {
        if (testConfig.triplestore != 'fuseki') {
            lEndpoint
                .getQuery({})
                .then((result) => {
                    // console.log(result);
                    expect(result).to.have.property('success', true);
                    done();
                })
                .catch((err) => {
                    console.log(`Get Queries: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Get Location requires repository manager role', (done) => {
        if (
            testConfig.triplestore != 'fuseki' &&
            testConfig.triplestore != 'stardog'
        ) {
            lEndpoint
                .getLocations()
                .then((result) => {
                    // console.log(result);
                    expect(result).to.exist;
                    done();
                })
                .catch((err) => {
                    console.log(`Get Location: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Perform garbage collection', (done) => {
        if (
            testConfig.triplestore != 'fuseki' &&
            testConfig.triplestore != 'stardog'
        ) {
            lEndpoint
                .performGarbageCollection({})
                .then((result) => {
                    expect(result.status).to.equal(200);
                    done();
                })
                .catch((err) => {
                    console.log(`Perform garbage collection: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });

    it('Get Saved Query from Graphdb', (done) => {
        if (
            testConfig.triplestore != 'fuseki' &&
            testConfig.triplestore != 'stardog'
        ) {
            lEndpoint
                .getSavedQueries()
                .then((result) => {
                    expect(result).to.have.property('success', true);
                    done();
                })
                .catch((err) => {
                    console.log(`Get Saved Query : ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
    });
});
