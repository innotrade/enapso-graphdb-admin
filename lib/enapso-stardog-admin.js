// Innotrade enapso stardog Admin
// (C) Copyright 2022 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze and Muhammad Yasir
const fs = require('fs');
const request = require('request-promise');
// const jsdoc2md = require('jsdoc-to-markdown');
// require the enapso GraphDB Client package
const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const { config } = require('process');

// jsdoc2md.render({ files: 'lib/*.js' }).then(console.log);

/** @constructor */
const EnapsoStarDogAdmin = {
    execRequest(options) {
        return new Promise(async (resolve, reject) => {
            var res;
            try {
                options.resolveWithFullResponse = true;
                res = await request(options);
                // success is OK (200) and ACCEPTED (202) and CREATED (201)
                let success =
                    200 === res.statusCode ||
                    202 === res.statusCode ||
                    201 === res.statusCode ||
                    204 === res.statusCode;
                res = {
                    success: success,
                    status: res.statusCode,
                    message: res.statusMessage
                        ? res.statusMessage
                        : success
                        ? 'OK'
                        : 'ERROR ' + res.statusCode,
                    data: res.body
                };
                resolve(res);
                // console.log("OK: " + JSON.stringify(res));
            } catch (err) {
                res = {
                    success: false,
                    status: err.statusCode ? err.statusCode : -1,
                    message:
                        err.error && err.error.message
                            ? err.error.message
                            : err.message
                };
                reject(res);
            }
        });
    },
    createDatabase(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}

            let config = {
                dbname: aOptions.name,
                options: {
                    'icv.active.graphs': '*',
                    'database.online': true,
                    'database.ignore.bulk.load.errors': true,
                    'strict.parsing': true,
                    'edge.properties': false,
                    'spatial.precision': 11,
                    'spatial.error.percentage': 0.025,
                    'index.literals.canonical': true,
                    'index.statistics.on_db_create': 'Sync',
                    'preserve.bnode.ids': true,
                    'transaction.write.conflict.strategy': 'LAST_COMMIT_WINS',
                    'literal.language.normalization': 'DEFAULT'
                }
            };

            let options = {
                method: 'POST',
                uri: client.getBaseURL() + '/admin/databases',
                formData: { root: JSON.stringify(config) },
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'multipart/form-data',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await this.execRequest(options);
                resolve(resp);
            } catch (err) {
                reject(err);
            }

            //return resp;
        });
    },
    deleteDatabase(aOptions, client) {
        aOptions = aOptions || {};
        let name = aOptions.name;
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let options = {
                method: 'DELETE',
                uri: client.getBaseURL() + `/admin/databases/${name}`,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await this.execRequest(options);
                resolve(resp);
            } catch (err) {
                reject(err);
            }

            //return resp;
        });
    },
    uploadOntology(options, client) {
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}

            let buffer;
            try {
                buffer = fs.readFileSync(options.fileName, 'binary');
            } catch (err) {
                reject({
                    status: 400,
                    message: err.message,
                    success: false
                });
            }

            try {
                var res = await this.upload(
                    {
                        data: buffer,
                        format: options.format,
                        context: options.context,
                        filename: options.fileName
                    },
                    client
                );
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    },
    upload(aOptions, client) {
        aOptions = aOptions || {};
        let data = aOptions.data;
        let fileName = aOptions.fileName;
        let context = aOptions.context || 'default';
        let format = aOptions.format;
        let transactionId;
        return new Promise(async (resolve, reject) => {
            try {
                await this.loginStatus;
            } catch (e) {}
            let transactionOptions = {
                method: 'POST',
                uri:
                    client.getBaseURL() +
                    `/${client.getRepository()}/transaction/begin`,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let transactionResp = await this.execRequest(
                    transactionOptions
                );
                transactionId = transactionResp.data;
            } catch (err) {
                reject(err);
            }
            let addDataOptions = {
                method: 'POST',
                uri:
                    client.getBaseURL() +
                    `/${client.getRepository()}/${transactionId}/add?graph-uri=${encodeURIComponent(
                        context
                    )}`,
                body: data,
                headers: {
                    Accept: 'text/plain',
                    'content-type': format,
                    Authorization: client.getAuthorization()
                }
            };
            let commitOptions = {
                method: 'POST',
                uri:
                    client.getBaseURL() +
                    `/${client.getRepository()}/transaction/commit/${transactionId}`,
                headers: {
                    Accept: '*/*',
                    'content-type': format,
                    Authorization: client.getAuthorization()
                }
            };
            try {
                await this.execRequest(addDataOptions);
                let commitResp = await this.execRequest(commitOptions);
                resolve(commitResp);
            } catch (err) {
                reject(err);
            }

            //return resp;
        });
    },
    getFormatName(format) {
        formats = [
            {
                format: 'application/rdf+xml',
                name: 'RDF/XML'
            },
            {
                format: 'text/turtle',
                name: 'Turtle'
            },
            {
                format: 'application/ld+json',
                name: 'JSON-LD'
            },
            {
                format: 'text/x-nquads',
                name: 'NQuads'
            }
        ];
        let formatName = formats.filter((item) => item.format == format);
        return formatName[0].name;
    },
    downloadOntology(aOptions, client) {
        aOptions = aOptions || {};
        let context = aOptions.context || 'tag:stardog:api:context:default';
        let format = aOptions.format || 'text/turtle';
        let formatName = this.getFormatName(aOptions.format);
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let options = {
                method: 'GET',
                uri:
                    client.getBaseURL() +
                    `/${client.getRepository()}/export?graph-uri=${encodeURIComponent(
                        context
                    )}&format=${encodeURIComponent(formatName)}`,
                headers: {
                    Accept: '*/*',
                    'content-type': format,
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await client.execRequest(options);
                if (aOptions.saveToFile == true) {
                    fs.writeFileSync(aOptions.filename, resp.data);
                    delete resp.data;
                }
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    getAllDatabases(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let options = {
                method: 'GET',
                uri: client.getBaseURL() + `/admin/databases`,
                headers: {
                    Accept: '*/*',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await client.execRequest(options);
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    getAllUsers(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let options = {
                method: 'GET',
                uri: client.getBaseURL() + `/admin/users`,
                headers: {
                    Accept: '*/*',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await client.execRequest(options);
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    createUser(aOptions, client) {
        aOptions = aOptions || {};
        let roles = aOptions.roles;
        let userName = aOptions.userName;
        let password = aOptions.password.split('');
        let config = {
            username: userName,
            password: password,
            superuser: false
        };
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let options = {
                method: 'POST',
                uri: client.getBaseURL() + '/admin/users',
                body: JSON.stringify(config),
                headers: {
                    Accept: '*/*',
                    'content-type': 'application/json',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await this.execRequest(options);
                if (roles) {
                    await this.assignRoles(
                        {
                            roles: roles,
                            userName: userName
                        },
                        client
                    );
                }
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    assignRoles(aOptions, client) {
        aOptions = aOptions || {};
        let roles = aOptions.roles;
        let userName = aOptions.userName;
        let resp;
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            try {
                for (let i = 0; i < roles.length; i++) {
                    let config = {
                        action: roles[i].action,
                        resource: roles[i].resource,
                        resource_type: roles[i].resource_type
                    };
                    let options = {
                        method: 'PUT',
                        uri:
                            client.getBaseURL() +
                            `/admin/permissions/user/${userName}`,
                        body: JSON.stringify(config),
                        headers: {
                            Accept: '*/*',
                            'content-type': 'application/json',
                            Authorization: client.getAuthorization()
                        }
                    };
                    resp = await this.execRequest(options);
                }
                // roles.forEach(async (item) => {});
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    removeRoles(aOptions) {
        aOptions = aOptions || {};
        let roles = aOptions.roles;
        let userName = aOptions.userName;
        let resp;
        let pms = [];
        return new Promise(async (resolve, reject) => {
            try {
                await this.loginStatus;
            } catch (e) {}
            try {
                for (let i = 0; i < roles.length; i++) {
                    pms.push(
                        new Promise(async (resolve, reject) => {
                            try {
                                let config = {
                                    action: roles[i].action,
                                    resource: roles[i].resource,
                                    resource_type: roles[i].resource_type
                                };
                                let options = {
                                    method: 'POST',
                                    uri:
                                        this.getBaseURL() +
                                        `/admin/permissions/user/${userName}/delete`,
                                    body: JSON.stringify(config),
                                    headers: {
                                        Accept: '*/*',
                                        'content-type': 'application/json',
                                        Authorization: this.getAuthorization()
                                    }
                                };
                                resp = await this.execRequest(options);
                                resolve(resp);
                            } catch (err) {
                                reject(err);
                            }
                        })
                    );
                }
                await Promise.allSettled(pms).then((result) => {
                    resolve(result);
                });
            } catch (err) {
                reject(err);
            }
        });
    },
    deleteUser(aOptions, client) {
        aOptions = aOptions || {};
        let userName = aOptions.userName;
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let options = {
                method: 'DELETE',
                uri: client.getBaseURL() + `/admin/users/${userName}`,
                headers: {
                    Accept: '*/*',
                    'content-type': 'application/json',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await this.execRequest(options);
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    clearDatabase(client) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.loginStatus;
            } catch (e) {}
            let sparql = `clear all`;
            try {
                let res = await client.update(sparql);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    },
    getContexts(client) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.loginStatus;
            } catch (e) {}
            let sparql = `select distinct ?graph{
                graph ?graph
                 {?s ?p ?o}
             }`;
            try {
                let res = await client.query(sparql);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    },
    getQuery(client) {
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let options = {
                method: 'GET',
                uri: client.getBaseURL() + `/admin/queries`,
                headers: {
                    Accept: '*/*',
                    Authorization: client.getAuthorization()
                }
            };
            try {
                let resp = await client.execRequest(options);
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    clearContext(options, client) {
        return new Promise(async (resolve, reject) => {
            try {
                await client.loginStatus;
            } catch (e) {}
            let sparql = `clear graph <${options.context}>`;
            try {
                let res = await client.update(sparql);
                resolve(res);
            } catch (err) {
                reject({
                    status: 404,
                    success: false,
                    message: 'Context is not found in the Database'
                });
            }
        });
    }
};

module.exports = EnapsoStarDogAdmin;