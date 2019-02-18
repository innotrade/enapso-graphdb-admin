const chai = require('chai');
const should = require('chai').should;
const expect = require('chai').expect;
const EnapsoGraphDBClient = require("enapso-graphdb-client");
const testConfig = require("./config");


describe("Upload test", () => {

    // before(function (done) { setTimeout(function () { done(); }, 500); });

    it('It should upload an ontology to GraphDB', (done) => {

        EnapsoGraphDBAdmin.listRepositories({
            method: 'POST',
            uri: lBaseURL + '/rest/repositories',
        }).then(result => {
            expect(result).to.exist;
            done();
        })
    });

});
