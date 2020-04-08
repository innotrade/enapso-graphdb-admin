// Innotrade Enapso GraphDB Client - Configuration for automated tests
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

module.exports = (Object.freeze({

    baseURL: 'http://localhost:7200',
    
	repository: 'Test',
    username: 'Test',
    password: 'Test',

    testBaseIRI: 'http://ont.enapso.com/test#',
    testContext: 'http://ont.enapso.com/test',

	newRepository: 'EnapsoAutomatedRepo',
    newUsername: 'EnapsoAutomatedUser',
    newPassword: 'EnapsoAutomatedPass',

    adminUsername: 'admin',
    adminPassword: 'root',

    prefixes: {
        PREFIX_OWL: {
            "prefix": 'owl',
            "iri": 'http://www.w3.org/2002/07/owl#'
        },
        PREFIX_RDF: {
            "prefix": 'rdf',
            "iri": 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        },
        PREFIX_RDFS: {
            "prefix": 'rdfs',
            "iri": 'http://www.w3.org/2000/01/rdf-schema#'
        },
        PREFIX_XSD: {
            "prefix": 'xsd',
            "iri": 'http://www.w3.org/2001/XMLSchema#'
        },
        PREFIX_FN: {
            "prefix": 'fn',
            "iri": 'http://www.w3.org/2005/xpath-functions#'
        },
        PREFIX_SFN: {
            "prefix": 'sfn',
            "iri": 'http://www.w3.org/ns/sparql#'
        }
    }
    
}));