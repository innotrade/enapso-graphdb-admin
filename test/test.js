// Innotrade Enapso GraphDB Admin Automated Test Suite
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

const chai = require('chai');
const should = require('chai').should;
const expect = require('chai').expect;
const EnapsoGraphDBAdmin = require("../enapso-graphdb-admin");
const testConfig = require("./config");


describe("Enapso GraphDB Admin Tests", () => {

    // before(function (done) { setTimeout(function () { done(); }, 500); });

    it('Get all repositories of local GraphDB instance', (done) => {
        EnapsoGraphDBAdmin.getRepositories({
        }).then(result => {
            // console.log(result);
            expect(result).to.exist;
            done();
        })
    });

    it('Get all users of local GraphDB instance', (done) => {
        EnapsoGraphDBAdmin.getUsers({
        }).then(result => {
            // console.log(result);
            expect(result).to.exist;
            done();
        })
    });

    it('Get all contexts of the "Test" repository of local GraphDB instance', (done) => {
        EnapsoGraphDBAdmin.getContexts({
            repository: "Test"
        }).then(result => {
            // console.log(result);
            expect(result).to.exist;
            done();
        })
    });

});
