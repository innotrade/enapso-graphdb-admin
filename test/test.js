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
		repository: testConfig.newRepository,
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




	
});
