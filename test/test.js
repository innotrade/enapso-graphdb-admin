// Innotrade Enapso GraphDB Admin - Automated Test Suite
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze and Muhammad Yasir

const chai = require('chai');
const should = require('chai').should;
const expect = require('chai').expect;
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { EnapsoGraphDBAdmin } = require('../index');
const testConfig = require("./config");


describe("Enapso GraphDB Admin Tests", () => {

	// instantiate a new GraphDB endpoint
	let endpoint = new EnapsoGraphDBClient.Endpoint({
		baseURL: testConfig.baseURL,
		repository: testConfig.newRepository,
		prefixes: testConfig.prefixes
	});

	it('Authenticate against GraphDB instance', (done) => {
		endpoint.login(
			testConfig.username,
			testConfig.password
		).then(result => {
			expect(result).to.have.property('statusCode', 200);
			done();
		}).catch(err => {
			console.log(err.message);
			done(err);
		})
	});

	it('Create test repository in GraphDB instance', (done) => {
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
				console.log(err.message);
				done(err);
			})
		})
	});

	it('Find test repository in GraphDB instance', (done) => {
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
			console.log(err.message);
			done(err);
		})
	});

	it('Create test user in GraphDB instance', (done) => {
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
			console.log(err.message);
			done(err);
		})
	});

	it('Find test users in GraphDB instance', (done) => {
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
			console.log(err.message);
			done(err);
		})
	});

	it('Update test user´s authorities in GraphDB instance', (done) => {
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
			console.log(err.message);
			done(err);
		})
	});

	it('Delete test user from GraphDB instance', (done) => {
		endpoint.deleteUser({
			"user": testConfig.newUsername,		// username which you want to delete
		}).then(result => {
			expect(result).to.have.property('statusCode', 204);
			done();
		}).catch(err => {
			console.log(err.message);
			done(err);
		})
	});

	/*
	it('Upload Ontology to GraphDB Repository', (done) => {
		endpoint.uploadFromFile({
			"filename": "/System/Volumes/Data/git/enapso-graphdb-admin/ontologies/EnapsoTest.owl",
			"format": "application/rdf+xml",
			"baseIRI": "http://ont.enapso.com/test#",
			"context": "http://ont.enapso.com/test"
		}).then(result => {
			// console.log(result);
			expect(result.statusCode).to.equal(202);
			done();
		}).catch(err => {
			console.log(err.message);
			done(err);
		})
	});
	*/

	/*
	it('Get Contexts (Graphs) of the "Test" Repository of the GraphDB Instance', (done) => {
		endpoint.getContexts({
			repository: "Test"
		}).then(result => {
			console.log(JSON.stringify(result, null, 2));
			// todo: To make this test reasonable, we need to chech the graph created by the upload in the test repo before!
			expect(result.statusCode).to.equal(200);
			done();
		})
	});
	* /

	/*
		it('Download the Ontology from Graphdb', (done) => {
			endpoint.downloadToFile({
			}).then(result => {
				// console.log(result);
				expect(result).to.have.property('success', true);
				done();
			})
		});
	
		it('Get Query from Graphdb', (done) => {
			endpoint.getQuery({
			}).then(result => {
				// console.log(result);
				expect(result).to.have.property('success', true);
				done();
			})
		});
	*/

	/*
	it('Download the Ontology from Graphdb', (done) => {
		endpoint.downloadToFile({
		}).then(result => {
			// console.log(result);
			expect(result.statusCode).to.equal(201);
			done();
		})
	});
	*/

	/*
		it('Clear Test Repository', (done) => {
			endpoint.clearRepository({
			}).then(result => {
				expect(result.statusCode).to.equal(200);
				done();
			})
		});
	*/

	it('Delete test repository from GraphDB instance', (done) => {
		endpoint.deleteRepository({
			"id": testConfig.newRepository
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		}).catch(err => {
			console.log(err.message);
			done(err);
		})
	});

	it('Perform garbage collection', (done) => {
		endpoint.performGarbageCollection({
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		}).catch(err => {
			console.log(err.message);
			done(err);
		})
	});

});
