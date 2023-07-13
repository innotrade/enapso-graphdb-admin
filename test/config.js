/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
// Innotrade ENAPSO Graph Database Admin - Configuration for automated tests
// (C) Copyright 2021-2022 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze
require('@innotrade/enapso-config');

module.exports = Object.freeze({
    repository: encfg.getConfig('enapsoDefaultGraphDB.repository', 'Test'),
    testBaseIRI: 'http://ont.enapso.com/test#',
    testContext: 'http://ont.enapso.com/test',
    roles: [
        {
            action: 'READ',
            resource_type: 'db',
            resource: ['Test']
        },
        {
            action: 'WRITE',
            resource_type: 'db',
            resource: ['Test']
        }
    ],
    stardogUserAuthorities: [
        {
            action: 'CREATE',
            resource_type: 'db',
            resource: ['Test']
        }
    ],
    // version: 10.2,
    newRepository: 'EnapsoAutomatedRepo',
    newUsername: 'EnapsoAutomatedUser',
    newPassword: 'EnapsoAutomatedPass',
    updateGraphDBUserRole: [
        // Writing excess wrote WRITE_ and in last name of Repository which excess provided like REPO_Test
        'READ_REPO_Test', // Reading excess wrote READ_ and in last name of Repository which excess provided like REPO_Test
        'WRITE_REPO_Vaccine',
        'READ_REPO_Vaccine',
        'ROLE_USER' // Role of the user
    ],
    authorities: [
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
