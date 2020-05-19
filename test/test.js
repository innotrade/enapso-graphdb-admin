// Innotrade Enapso GraphDB Admin - Automated Test Suite
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze and Muhammad Yasir

const chai = require('chai');
const should = require('chai').should;
const expect = require('chai').expect;
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { EnapsoGraphDBAdmin } = require('../index');
const testConfig = require("./config");


describe("Enapso GraphDB Admin Tests", function () {

	this.timeout(60000);

	// instantiate a new GraphDB endpoint
	let endpoint = new EnapsoGraphDBClient.Endpoint({
		baseURL: testConfig.baseURL,
		repository: testConfig.newRepository,
		prefixes: testConfig.prefixes
	});

	it('Authenticate against GraphDB instance', function (done) {
		endpoint.login(
			testConfig.username,
			testConfig.password
		).then(result => {
			expect(result).to.have.property('statusCode', 200);
			done();
		}).catch(err => {
			console.log('Authentication: ' + err.message);
			done(err);
		})
	});

	it('Create test repository in GraphDB instance', function (done) {
		endpoint.login(
			testConfig.adminUsername,
			testConfig.adminPassword
		).then(result => {
			endpoint.createRepository({
				"id": testConfig.newRepository,
				"title": "Enapso Automatically Created Repository",
				"location": ""
			}).then(result => {
				expect(result.statusCode).to.equal(201);
				done();
			}).catch(err => {
				console.log('Create repository: ' + err.message);
				done(err);
			})
		})
	});

	it('Find test repository in GraphDB instance', function (done) {
		endpoint.getRepositories({
		}).then(result => {
			let success = result.statusCode === 200;
			if (success && result.data) {
				for (let repo of result.data) {
					success = repo.id === testConfig.newRepository;
					if (success) { break; }
				}
			}
			expect(success).to.be.true;
			done();
		}).catch(err => {
			console.log('Find repository: ' + err.message);
			done(err);
		})
	});

	it('Create test user in GraphDB instance', function (done) {
		endpoint.createUser({
			"username": testConfig.newUsername,	// Username 
			"password": testConfig.newPassword,	// Password for the user
			"authorities": [
				"READ_REPO_" + testConfig.newRepository,	// Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
				"ROLE_USER",		// Role of the user
			]
		}).then(result => {
			// console.log(result.statusCode);
			expect(result).to.have.property('statusCode', 201);
			done();
		}).catch(err => {
			console.log('Create user: ' + err.message);
			done(err);
		})
	});

	it('Find test users in GraphDB instance', function (done) {
		endpoint.getUsers({
		}).then(result => {
			let success = result.statusCode === 200;
			if (success && result.data) {
				for (let user of result.data) {
					success = user.username === testConfig.newUsername;
					if (success) { break; }
				}
			}
			expect(success).to.be.true;
			done();
		}).catch(err => {
			console.log('Find user: ' + err.message);
			done(err);
		})
	});

	it('Update test user´s authorities in GraphDB instance', function (done) {
		endpoint.updateUser({
			"username": testConfig.newUsername,	// Username 
			"authorities": [
				// Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
				"WRITE_REPO_" + testConfig.newRepository,	// Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
				"READ_REPO_" + testConfig.newRepository,	// Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
				"ROLE_USER",		// Role of the user
			]
		}).then(result => {
			expect(result).to.have.property('statusCode', 200);
			done();
		}).catch(err => {
			console.log('Update user: ' + err.message);
			done(err);
		})
	});

	it('Delete test user from GraphDB instance', function (done) {
		endpoint.deleteUser({
			"user": testConfig.newUsername,		// username which you want to delete
		}).then(result => {
			expect(result).to.have.property('statusCode', 204);
			done();
		}).catch(err => {
			console.log('Delete user: ' + err.message);
			done(err);
		})
	});

	it('Upload ontology to GraphDB repository', function (done) {
		this.timeout(60000);
		endpoint.uploadFromFile({
			"filename": "ontologies/EnapsoTest.owl",
			"format": "application/rdf+xml",
			"baseIRI": testConfig.testBaseIRI,
			"context": testConfig.testContext
		}).then(result => {
			// console.log(result);
			expect(result.statusCode).to.equal(202);
			done();
		}).catch(err => {
			console.log('Upload ontology ' + err.message);
			done(err);
		})
	});
<<<<<<< HEAD
	
		it('Clear Repository', (done) => {
			lEndpoint.clearRepository().then(result => {
				// console.log(result);
				expect(result.statusCode).to.equal(200);
				done();
			})
		});

	
		it('Get all repositories of local GraphDB instance', (done) => {
			lEndpoint.getRepositories({
			}).then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});
		it('Upload Ontology to GraphDB', (done) => {
			lEndpoint.uploadFromFile({
				filename: "../ontologies/Test.owl",
				format: "application/rdf+xml",
				baseIRI: "http://ont.enapso.com/test#",
				context: "http://ont.enapso.com/test"
			}).then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});
		it('Download Ontology from GraphDB', (done) => {
			let lFormat = EnapsoGraphDBClient.FORMAT_TURTLE;
			lEndpoint.downloadToFile({
				format: lFormat.type,
				filename: "./ontologies/" +
				lEndpoint.getRepository() +
					lFormat.extension
			}).then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});
		it('Get all users of local GraphDB instance', (done) => {
			lEndpoint.getUsers({
			}).then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});
		it('Get Reposiotry of local GraphDB instance', (done) => {
			lEndpoint.getRepositories().then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});
		it('Get Location requires repository manager role', (done) => {
			lEndpoint.getLocations().then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});

		it('Get all contexts of the "Test" repository of local GraphDB instance', (done) => {
			lEndpoint.getContexts({
				repository: "Test"
			}).then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});
		it('Get all Resource of  repository of local GraphDB instance', (done) => {
			lEndpoint.getResources().then(result => {
				// console.log(result);
				expect(result).to.have.property('success', true);
				done();
			})
		});
		it('Lists all contexts (named graph) in the repository', (done) => {
			lEndpoint.getQuery({
			}).then(result => {
				// console.log(result);
				expect(result).to.have.property('success', true);
				done();
			})
		});
		it('Get Saved Query from Graphdb', (done) => {
			lEndpoint.getSavedQueries().then(result => {
				expect(result).to.have.property('success', true);
				done();
			})
		});
		it('Clear context of graph', (done) => {
			lEndpoint.clearContext(
				'http://ont.enapso.com/test').then(result => {
				expect(result).to.have.property('success', true);
				done();
			})
		});
	it('Create new repository in Graphdb', (done) => {
		lEndpoint.createRepository({
			"id": "AutomatedTest",
			"title": "Enapso Automated Test Repository",
			"location": ""
=======

	it('Get contexts (graphs) of the test repository of the GraphDB instance', function (done) {
		endpoint.getContexts({
			repository: testConfig.newRepository
		}).then(result => {
			// console.log(JSON.stringify(result, null, 2));
			let success = result.statusCode === 200;
			if (success && result.data && result.data.results && result.data.results.bindings) {
				for (let binding of result.data.results.bindings) {
					success = binding.contextID.value === testConfig.testContext;
					if (success) { break; }
				}
			}
			expect(success).to.be.true;
			done();
		}).catch(err => {
			console.log('Get contexts: ' + err.message);
			done(err);
		})
	});

	it('Get running queries from GraphDB', (done) => {
		endpoint.getQuery({
>>>>>>> f1d223f50d12948893ed14bddaef87627f6ed4b3
		}).then(result => {
			// console.log(result);
			expect(result).to.have.property('success', true);
			done();
		}).catch(err => {
			console.log('Get running queries: ' + err.message);
			done(err);
		})
	});

<<<<<<< HEAD
	it('Delete newly created repository in Graphdb', (done) => {
		lEndpoint.deleteRepository({
			"id": "AutomatedTest"
=======
	it('Download the ontology from GraphDB', function (done) {
		this.timeout(30000);
		endpoint.downloadToFile({
			"filename": "ontologies/EnapsoTest_Downloaded.owl",
>>>>>>> f1d223f50d12948893ed14bddaef87627f6ed4b3
		}).then(result => {
			// console.log(result);
			expect(result.statusCode).to.equal(200);
			done();
		}).catch(err => {
			console.log('Download ontology: ' + err.message);
			done(err);
		})
	});

	it('Clear test repository', function (done) {
		endpoint.clearRepository({
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		}).catch(err => {
			console.log('Clear repository: ' + err.message);
			done(err);
		})
	});

	it('Delete test repository from GraphDB instance', function (done) {
		this.timeout(20000);
		endpoint.deleteRepository({
			"id": testConfig.newRepository
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		}).catch(err => {
			console.log('Delete repository: ' + err.message);
			done(err);
		})
	});

	it('Perform garbage collection', (done) => {
		endpoint.performGarbageCollection({
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		}).catch(err => {
			console.log('Garbage collection: ' + err.message);
			done(err);
		})
	});

});
