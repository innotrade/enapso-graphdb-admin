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
	let lEndpoint = new EnapsoGraphDBClient.Endpoint({
		baseURL: testConfig.baseURL,
		repository: testConfig.repository,
		prefixes: testConfig.prefixes
	});

	it('Authenticate against GraphDB instance', (done) => {
		lEndpoint.login(
			testConfig.username,
			testConfig.password
		).then(result => {
			// console.log(result.statusCode);
			expect(result).to.have.property('statusCode', 200);
			done();
		})
	});

	it('Garbage Collection', (done) => {
		lEndpoint.performGarbageCollection({
		}).then(result => {
			// console.log(result);
			expect(result.statusCode).to.equal(200);
			done();
		})
	});
	/*
		it('Clear Repository', (done) => {
			lEndpoint.clearRepository({
			}).then(result => {
				// console.log(result);
				expect(result.statusCode).to.equal(200);
				done();
			})
		});
	
		it('Download the Ontology from Graphdb', (done) => {
			lEndpoint.downloadToFile({
			}).then(result => {
				// console.log(result);
				expect(result).to.have.property('success', true);
				done();
			})
		});
		// before(function (done) { setTimeout(function () { done(); }, 500); });
	
		it('Get all repositories of local GraphDB instance', (done) => {
			lEndpoint.getRepositories({
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
	
		it('Get all contexts of the "Test" repository of local GraphDB instance', (done) => {
			lEndpoint.getContexts({
				repository: "Test"
			}).then(result => {
				// console.log(result);
				expect(result).to.exist;
				done();
			})
		});
	
		it('Get Query from Graphdb', (done) => {
			lEndpoint.getQuery({
			}).then(result => {
				// console.log(result);
				expect(result).to.have.property('success', true);
				done();
			})
		});
	*/

	it('Create new repository in Graphdb', (done) => {
		lEndpoint.createRepository({
			"id": "AutomatedTest",
			"title": "Enapso Automated Test Repository",
			"location": ""
		}).then(result => {
			// console.log(result);
			expect(result).to.have.property('success', true);
			done();
		})
	});

	it('Delete repository in Graphdb', (done) => {
		lEndpoint.deleteRepository({
			"id": "AutomatedTest"
		}).then(result => {
			// console.log(result);
			expect(result.statusCode).to.equal(200);
			done();
		})
	});
	/*	
			it('Check Graphdn for Update function use for performing insertion,deletion and updation query', (done) => {
				lEndpoint.update({
				}).then(result => {
					// console.log(result);
					expect(result.statusCode).to.equal(200);
					done();
				})
			});
		*/

});
