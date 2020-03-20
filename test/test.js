// Innotrade Enapso GraphDB Admin - Automated Test Suite
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

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
		repository: testConfig.repository,
		prefixes: testConfig.prefixes
	});

	it('Authenticate against GraphDB instance', (done) => {
		endpoint.login(
			testConfig.username,
			testConfig.password
		).then(result => {
			expect(result).to.have.property('statusCode', 200);
			done();
		})
	});

	it('Garbage Collection', (done) => {
		endpoint.performGarbageCollection({
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		})
	});

	it('Create New Repository in GraphDB', (done) => {
		endpoint.createRepository({
			"id": "EnapsoAutomatedTest",
			"title": "Enapso Automatically created Repository",
			"location": ""
		}).then(result => {
			expect(result.statusCode).to.equal(201);
			done();
		})
	});

	it('Get Repositories of GraphDB Instance', (done) => {
		endpoint.getRepositories({
		}).then(result => {
			// console.log(result);
			// todo: Here we need to check if the new repo really has been created!
			expect(result.statusCode).to.equal(200);
			done();
		})
	});

	it('Get Users of GraphDB Instance', (done) => {
		endpoint.getUsers({
		}).then(result => {
			// console.log(result);
			// todo: Here we need to check if the user "Test" really exists!
			expect(result.statusCode).to.equal(200);
			done();
		})
	});

	it('Get Contexts (Graphs) of the "Test" Repository of the GraphDB Instance', (done) => {
		endpoint.getContexts({
			repository: "Test"
		}).then(result => {
			console.log(JSON.stringify(result, null, 2));
			// todo: To make this test reasonable, we need to create two graphs in the test repo before!
			expect(result.statusCode).to.equal(200);
			done();
		})
	});


	/*
		it('Download the Ontology from Graphdb', (done) => {
			endpoint.downloadToFile({
			}).then(result => {
				// console.log(result);
				expect(result).to.have.property('success', true);
				done();
			})
		});
		// before(function (done) { setTimeout(function () { done(); }, 500); });
	


	
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
	it('Clear Test Repository', (done) => {
		endpoint.clearRepository({
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		})
	});

	it('Delete Test Repository in GraphDB Instance', (done) => {
		endpoint.deleteRepository({
			"id": "EnapsoAutomatedTest"
		}).then(result => {
			expect(result.statusCode).to.equal(200);
			done();
		})
	});

});
