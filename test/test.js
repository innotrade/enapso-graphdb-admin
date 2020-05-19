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
	let lEndpoint = new EnapsoGraphDBClient.Endpoint({
		baseURL: testConfig.baseURL,
		repository: testConfig.repository,
		prefixes: testConfig.prefixes
	});

	it('Authenticate against GraphDB instance', function (done) {
		lEndpoint.login(
			testConfig.username,
			testConfig.password
		).then(result => {
			expect(result).to.have.property('statusCode', 200);
			done();
		})
	});
	it('Create new repository in Graphdb', (done) => {
		lEndpoint.createRepository({
			"id": testConfig.newRepository,
			"title": "Enapso Automated Test Repository",
			"location": ""
		}).then(result => {
			expect(result).to.have.property('success', true);
			done();
		})
	});
	it('Create test user in GraphDB instance', function (done) {
		lEndpoint.createUser({
			"username": testConfig.newUsername,	// Username 
			"password": testConfig.newPassword,	// Password for the user
			"authorities": [
				"READ_REPO_" + testConfig.newRepository,	// Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
				"ROLE_USER",		// Role of the user
			]
		}).then(result => {
			expect(result).to.have.property('statusCode', 201);
			done();
		})
	});

	it('Find test users in GraphDB instance', function (done) {
		lEndpoint.getUsers({
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
		})
	});
	it('Delete test user from GraphDB instance', function (done) {
		lEndpoint.deleteUser({
			"user": testConfig.newUsername,		// username which you want to delete
		}).then(result => {
			expect(result).to.have.property('statusCode', 204);
			done();
		})
	});
	it('Find Newly created repository in GraphDB', (done) => {
		lEndpoint.getRepositories({
		}).then(result => {
			let success = result.statusCode === 200;
			if (success && result.data) {
				for (let repository of result.data) {
					success = repository.username === testConfig.newUsername;
					if (success) { break; }
				}
			}
			expect(result).to.have.property('success', true);
			done();
		})
	});

	it('Get contexts (graphs) of the test repository of the GraphDB instance', function (done) {
		lEndpoint.getContexts({
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
		})
	});
	it('Delete newly created repository in Graphdb', (done) => {
		lEndpoint.deleteRepository({
			"id": testConfig.newRepository
		}).then(result => {
			// console.log(result);
			expect(result).to.have.property('success', true);
			done();
		})
	});

	it('Clear Repository', (done) => {
		lEndpoint.clearRepository().then(result => {
			expect(result).to.have.property('success', true);
			done();
		})
	});
	it('Drop SHACL from GraphDB', (done) => {
		lEndpoint.dropShaclGraph().then(result => {
			expect(result).to.have.property('success', true);
			done();
		})
	});

	it('Upload Ontology to GraphDB', (done) => {
		lEndpoint.uploadFromFile({
			filename: "./ontologies/EnapsoTest.owl",
			format: "application/rdf+xml",
			baseIRI: "http://ont.enapso.com/test#",
			context: "http://ont.enapso.com/test"
		}).then(result => {
			expect(result).to.have.property('success', true);
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
	it('Get running queries from GraphDB', (done) => {
		lEndpoint.getQuery({
		}).then(result => {
			// console.log(result);
			expect(result).to.have.property('success', true);
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
	it('Perform garbage collection', (done) => {
		lEndpoint.performGarbageCollection({
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		})
	});
	it('Get Saved Query from Graphdb', (done) => {
		lEndpoint.getSavedQueries().then(result => {
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

















});
