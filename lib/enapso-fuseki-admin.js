// Innotrade ENAPSO Graph Database Admin
// (C) Copyright 2021-2022 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze and Muhammad Yasir

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const request = require('axios');
const FormData = require('form-data');
const qs = require('qs');
const { Readable } = require('stream');

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
                    message: err.message || err?.response?.data?.message
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
                        Accept: 'application/rdf+xml',
                        'Content-Type': 'multipart/form-data'
                    }
                };
            } else {
                const stringData = aOptions.fileName;
                let extension = aOptions.extension || 'ttl';
                const stream = new Readable();
                stream.push(stringData);
                stream.push(null); // Indicate the end of the stream
                form.append('file', stream, `filename.${extension}`);
                //  form.append('file', binaryString);

                // form.append('file', aOptions.fileName);
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
                        Accept: 'application/rdf+xml',
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
        let resp;
        return new Promise(async (resolve, reject) => {
            let options = {
                method: 'GET',
                uri: client.getBaseURL() + '/' + client.getRepository() + '/data',
                json: true,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };
    
            try {
                if (!Array.isArray(aOptions.graph)) {
                    if (aOptions.graph) {
                        options.uri = `${options.uri}?graph=${aOptions.graph}`;
                    }
                    resp = await this.execRequest(options);
                    if (!resp.data) {
                        resp.data = '';
                    }
                    if (aOptions.saveToFile == true) {
                        fs.writeFileSync(aOptions.fileName, resp.data);
                        delete resp.data;
                    }
                    resolve(resp);
                } else {
                    // Create a zip archive
                    const zipPath = `${aOptions.fileName}.zip`;
                    const output = fs.createWriteStream(zipPath);
                    const archive = archiver('zip', { zlib: { level: 9 } });
    
                    output.on('close', () => {
                        console.log(`${archive.pointer()} total bytes`);
                        console.log('Archiver has been finalized and the output file descriptor has closed.');
                        resolve(resp);
                    });
    
                    archive.on('error', (err) => {
                        reject(err);
                    });
    
                    archive.pipe(output);
                    let uri=options.uri;
                    for (let graph of aOptions.graph) {
                        delete options.uri;
                        options.uri = `${uri}?graph=${graph}`;
                        const sanitizedGraph = this.sanitizeFilename(graph);
                        resp = await this.execRequest(options);
                        if (!resp.data) {
                            resp.data = '';
                        }
                        if (aOptions.saveToFile == true) {
                            const tempFileName = `${sanitizedGraph}.ttl`;
                            archive.append(resp.data, { name: tempFileName });
                            delete resp.data;
                        }
                    }
    
                    await archive.finalize();
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    sanitizeFilename(filename) {
        return filename.replace(/[:\\\/\*\?"<>\|]/g, "_");
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
