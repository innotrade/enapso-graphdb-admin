// Innotrade ENAPSO Graph Database Admin
// (C) Copyright 2021-2022 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze and Muhammad Yasir

const fs = require('fs');
const request = require('axios');
const FormData = require('form-data');
const qs = require('qs');

const EnapsoFusekiAdmin = {
    execRequest(options) {
        return new Promise(async (resolve, reject) => {
            var res;
            try {
                options.resolveWithFullResponse = true;
                options.url = options.uri || options.url;
                if (options.body) {
                    options.data = options.body;
                }
                res = await request(options);
                // success is OK (200) and ACCEPTED (202) and CREATED (201)
                let success = true;
                res = {
                    success: success,
                    status: res.status,
                    message: res.statusMessage
                        ? res.statusMessage
                        : success
                        ? 'OK'
                        : 'ERROR ' + res.statusCode,
                    data: res.data
                };
                resolve(res);
                // console.log("OK: " + JSON.stringify(res));
            } catch (err) {
                res = {
                    success: false,
                    status: err.status ? err.statusCode : -1,
                    message: err.response.data.message
                };
                reject(res);
                // console.log("ERROR: " + JSON.stringify(res));
            }
        });
    },
    createDataSet(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            let config = {
                dbName: aOptions.name,
                dbType: aOptions.type || 'tdb2'
            };
            let options = {
                method: 'POST',
                uri: client.getBaseURL() + '/$/datasets',
                data: qs.stringify(config), //formurlencoded(config),
                json: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
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
    getDataSet(aOptions) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            let options = {
                method: 'GET',
                uri: this.getBaseURL() + '/$/datasets/' + aOptions.name,
                json: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=UTF-8'
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
    getAllDataSet(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            let options = {
                method: 'GET',
                uri: client.getBaseURL() + '/$/datasets',
                json: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=UTF-8'
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
    deleteDataSet(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            let options = {
                method: 'Delete',
                uri: client.getBaseURL() + '/$/datasets/' + aOptions.name,
                json: true,
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=UTF-8'
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
    uploadOntology(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            let apiType = client.getApiType();
            let form = new FormData();
            let config,
                options,
                graph = '';
            if (apiType == 'fileUpload') {
                form.append('fileName', fs.createReadStream(aOptions.fileName));
                form.append('graph', aOptions.graph);
                // config = {
                //     fileName: fs.createReadStream(aOptions.fileName),
                //     graph: aOptions.graph
                // };
                options = {
                    method: 'POST',
                    uri:
                        client.getBaseURL() +
                        '/' +
                        client.getRepository() +
                        '/upload',
                    data: form,
                    json: true,
                    headers: {
                        Accept: 'application/redf+xml',
                        'Content-Type': 'multipart/form-data'
                    }
                };
            } else {
                form.append('file', fs.createReadStream(aOptions.fileName));
                if (aOptions.graph) {
                    graph = `?graph=${aOptions.graph}`;
                }
                options = {
                    method: 'POST',
                    uri:
                        client.getBaseURL() +
                        '/' +
                        client.getRepository() +
                        '/data' +
                        graph,
                    data: form,
                    json: true,
                    headers: {
                        Accept: 'application/redf+xml',
                        'Content-Type': 'multipart/form-data'
                    }
                };
            }
            try {
                let resp = await this.execRequest(options);
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    downloadOntology(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            let config = {
                graph: aOptions.graph
            };
            let options = {
                method: 'GET',
                uri:
                    client.getBaseURL() +
                    '/' +
                    client.getRepository() +
                    '/data',
                body: config,
                json: true,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };
            // console.log(options);
            try {
                let resp = await this.execRequest(options);
                if (!resp.data) {
                    resp.data = '';
                }
                if (aOptions.saveToFile == true) {
                    fs.writeFileSync(aOptions.fileName, resp.data);
                    delete resp.data;
                }
                resolve(resp);
            } catch (err) {
                reject(err);
            }
        });
    },
    clearDataSet(client) {
        return new Promise(async (resolve, reject) => {
            try {
                let lRes = await client.update(`CLEAR ALL`);
                let res = {
                    status: lRes.status || lRes.statusCode,
                    message: lRes.message || lRes.statusMessage,
                    success: lRes.success || true
                };
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    },
    getContexts(client) {
        return new Promise(async (resolve, reject) => {
            try {
                let lRes = await client.query(`select distinct ?graph{
                    graph ?graph
                     {?s ?p ?o}
                 }
                 `);
                resolve(lRes);
            } catch (err) {
                reject(err);
            }
        });
    },
    clearSpecificGraph(aOptions, client) {
        return new Promise(async (resolve, reject) => {
            try {
                let lRes = await client.update(
                    `CLEAR graph <${aOptions.graph}>`
                );
                let res = {
                    status: lRes.status || lRes.statusCode,
                    message: lRes.message || lRes.statusMessage,
                    success: lRes.success || true
                };
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }
};

module.exports = EnapsoFusekiAdmin;
