/* eslint-disable prettier/prettier */
/* eslint-disable no-console, func-names, no-undef, no-restricted-syntax, no-unused-expressions */
// Innotrade ENAPSO Graph Database Admin - Automated Test Suite
// (C) Copyright 2021-2022 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze and Muhammad Yasir
require('@innotrade/enapso-config');
const { EnapsoGraphDBClient } = requireEx('@innotrade/enapso-graphdb-client');
/* eslint-disable no-unused-vars */
// this is required to add the admin features for the client
const { EnapsoGraphDBAdmin } = require('../index');
const testConfig = require('./config');

const baseURL = process.argv[5].replace(/'/g, '');
const triplestore = process.argv[7].replace(/'/g, '');
const username = process.argv[9].replace(/'/g, '');
const password = process.argv[11].replace(/'/g, '');
const version = testConfig.version;
describe('ENAPSO Graph Database Admin Automated Test Suite', () => {
    // this.timeout(60000);
    let chai, expect;
    
    // Setup - load chai using dynamic import before tests run
    before(async function() {
        chai = await import('chai');
        expect = chai.expect;
    });

    // instantiate a new Graph Database endpoint
    const lEndpoint = new EnapsoGraphDBClient.Endpoint({
        baseURL,
        repository: testConfig.repository,
        prefixes: testConfig.prefixes,
        version: testConfig.version,
        triplestore
    });

    it('Authenticate against Graph Database instance', (done) => {
        if (triplestore != 'fuseki') {
            lEndpoint
                .login(username, password)
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
    // first try to insert a class
    it('Insert a class', (done) => {
        const lQuery = `
insert data {
    sfn:TestClass rdf:type owl:Class
}`;
        lEndpoint
            .update(lQuery)
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Insert class: ${err.message}`);
                done(err);
            });
    });
    // now try to read the updated class
    it('Read inserted class', (done) => {
        const lQuery = `
select ?class 
where  {
		?class a owl:Class
} limit 1`;
        lEndpoint
            .query(lQuery)
            .then((result) => {
                // console.log('Success: ' + result.success);
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Read class: ${err.message}`);
                done(err);
            });
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

    it('Create test user in Graph Database instance', (done) => {
        if (triplestore != 'fuseki') {
            let role;
            if (triplestore == 'stardog') {
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

    it('Find test users in Graph Database instance', (done) => {
        if (triplestore != 'fuseki') {
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

    it('Update test users roles in Graph Database instance', (done) => {
        if (triplestore == 'graphdb') {
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
        if (triplestore == 'stardog') {
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
        if (triplestore == 'stardog') {
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

    it('Delete test user from Graph Database instance', (done) => {
        if (triplestore != 'fuseki') {
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

    it('Find Newly created repository in Graph Database', (done) => {
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

    it('Get contexts (graphs) of the test repository of the Graph Database instance', (done) => {
        lEndpoint
            .getContexts()
            .then((result) => {
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Get contexts: ${err.message}`);
                done(err);
            });
    });

    it('Get Resource of the test repository of the Graph Database instance', (done) => {
        if (triplestore != 'fuseki' && triplestore != 'stardog') {
            lEndpoint
                .getResources()
                .then((result) => {
                    expect(result).to.have.property('success', true);
                    done();
                })
                .catch((err) => {
                    console.log(`Get Resources: ${err.message}`);
                    done(err);
                });
        } else {
            done();
        }
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

    it('Drop SHACL from Graph Database', (done) => {
        if (triplestore != 'fuseki' && triplestore != 'stardog') {
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

    it('Upload Ontology to Graph Database', (done) => {
        lEndpoint
            .uploadFromFile({
                filename: 'ontologies/dotnetpro_demo_ontology_2.owl',
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

    it('Download Ontology from Graph Database', (done) => {
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
                console.log(err);
                console.log(`Clear context of graph: ${err.message}`);
                done(err);
            });
    });

    it('Get running queries from Graph Database', (done) => {
        if (triplestore != 'fuseki') {
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
        if (triplestore != 'fuseki' && triplestore != 'stardog') {
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
            triplestore != 'fuseki' &&
            triplestore != 'stardog' &&
            version < 10.2
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
        if (triplestore != 'fuseki' && triplestore != 'stardog') {
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
