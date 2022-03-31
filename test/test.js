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

describe('ENAPSO GraphDB Admin Automated Test Suite', function () {
    // this.timeout(60000);

    // instantiate a new GraphDB endpoint
    const lEndpoint = new EnapsoGraphDBClient.Endpoint({
        baseURL: testConfig.baseURL,
        repository: testConfig.repository,
        prefixes: testConfig.prefixes
    });

    it('Authenticate against GraphDB instance', function (done) {
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

    it('Create test user in GraphDB instance', function (done) {
        lEndpoint
            .createUser({
                username: testConfig.newUsername, // Username
                password: testConfig.newPassword, // Password for the user
                authorities: [
                    // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
                    `READ_REPO_${testConfig.newRepository}`,
                    'ROLE_USER' // Role of the user
                ]
            })
            .then((result) => {
                expect(result).to.have.property('status', 201);
                done();
            })
            .catch((err) => {
                console.log(`Create new user: ${err.message}`);
                done(err);
            });
    });

    it('Find test users in GraphDB instance', function (done) {
        lEndpoint
            .getUsers({})
            .then((result) => {
                let success = result.status === 200;
                if (success && result.data) {
                    for (const user of result.data) {
                        success = user.username === testConfig.newUsername;
                        if (success) {
                            break;
                        }
                    }
                }
                expect(success).to.be.true;
                done();
            })
            .catch((err) => {
                console.log(`Find user: ${err.message}`);
                done(err);
            });
    });

    it('Delete test user from GraphDB instance', function (done) {
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
    });

    it('Find Newly created repository in GraphDB', (done) => {
        lEndpoint
            .getRepositories({})
            .then((result) => {
                let success = result.status === 200;
                if (success && result.data) {
                    for (const repository of result.data) {
                        success =
                            repository.username === testConfig.newUsername;
                        if (success) {
                            break;
                        }
                    }
                }
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Find repo: ${err.message}`);
                done(err);
            });
    });

    it('Get contexts (graphs) of the test repository of the GraphDB instance', function (done) {
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
                // console.log(result);
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`Delete repo: ${err.message}`);
                done(err);
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
    });

    it('Get Location requires repository manager role', (done) => {
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
    });

    it('Perform garbage collection', (done) => {
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
    });

    it('Get Saved Query from Graphdb', (done) => {
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
    });

    it('Lists all contexts (named graph) in the repository', (done) => {
        lEndpoint
            .getQuery({})
            .then((result) => {
                // console.log(result);
                expect(result).to.have.property('success', true);
                done();
            })
            .catch((err) => {
                console.log(`List all contexts : ${err.message}`);
                done(err);
            });
    });
});
