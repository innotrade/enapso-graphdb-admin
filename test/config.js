/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
// Innotrade Enapso GraphDB Client - Configuration for automated tests
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze
require('@innotrade/enapso-config');

module.exports = Object.freeze({
    baseURL: encfg.getConfig(
        'enapsoDefaultGraphDB.baseUrl',
        'http://localhost:3030'
    ),

    repository: encfg.getConfig('enapsoDefaultGraphDB.repository', 'Test'),
    adminUsername: encfg.getConfig('enapsoDefaultGraphDB.userName', 'admin'),
    adminPassword: encfg.getConfig('enapsoDefaultGraphDB.password', 'root'),
    triplestore: 'fuseki',
    testBaseIRI: 'http://ont.enapso.com/test#',
    testContext: 'http://ont.enapso.com/test',
    // version: 9,
    newRepository: 'EnapsoAutomatedRepo',
    newUsername: 'EnapsoAutomatedUser',
    newPassword: 'EnapsoAutomatedPass',
    authorities: [
        // {
        //     action: 'CREATE',
        //     resource_type: 'db',
        //     resource: ['Test']
        // } // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
        `READ_REPO_EnapsoAutomatedRepo`,
        'ROLE_USER' // Role of the user
    ],
    prefixes: {
        PREFIX_OWL: {
            prefix: 'owl',
            iri: 'http://www.w3.org/2002/07/owl#'
        },
        PREFIX_RDF: {
            prefix: 'rdf',
            iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        },
        PREFIX_RDFS: {
            prefix: 'rdfs',
            iri: 'http://www.w3.org/2000/01/rdf-schema#'
        },
        PREFIX_XSD: {
            prefix: 'xsd',
            iri: 'http://www.w3.org/2001/XMLSchema#'
        },
        PREFIX_FN: {
            prefix: 'fn',
            iri: 'http://www.w3.org/2005/xpath-functions#'
        },
        PREFIX_SFN: {
            prefix: 'sfn',
            iri: 'http://www.w3.org/ns/sparql#'
        }
    }
});
