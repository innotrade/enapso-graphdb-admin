// Innotrade ENAPSO Graph Database Admin
// (C) Copyright 2021-2025 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze and Muhammad Yasir

// QLever exposes no dedicated import/upload/replace REST endpoints. Instead we
// wrap the incoming data into SPARQL 1.1 Update statements (INSERT DATA / CLEAR)
// and execute them through the client, which already targets QLever's endpoint.

// Formats whose serialization can be inlined directly into an INSERT DATA block.
// Everything else (TriG, N-Quads, RDF/XML, JSON-LD, RDF/JSON, TriX, binary RDF)
// is not valid SPARQL update syntax and is rejected by the preflight guard.
const QLEVER_INLINE_FORMATS = ['text/turtle', 'text/plain', 'text/rdf+n3'];

const EnapsoQleverAdmin = {
    // Normalizes a context that may arrive as a plain string or as { context }
    resolveGraph(graph) {
        if (graph && typeof graph === 'object') {
            return graph.context;
        }
        return graph;
    },

    // Preflight guard: returns an error response for formats QLever cannot ingest
    // via INSERT DATA, or null when the format is safe to inline.
    checkFormat(format) {
        if (format && !QLEVER_INLINE_FORMATS.includes(format)) {
            return {
                success: false,
                status: 415, // Unsupported Media Type
                message: `Format '${format}' is not supported for QLever. Use Turtle (text/turtle), N-Triples (text/plain) or N3 (text/rdf+n3).`
            };
        }
        return null;
    },

    // Upload data or an ontology by inlining it into an INSERT DATA statement.
    // When a graph (context) is supplied the triples are wrapped in a GRAPH block.
    uploadOntology(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            const invalid = this.checkFormat(aOptions.format);
            if (invalid) {
                return resolve(invalid);
            }
            const graph = this.resolveGraph(aOptions.graph);
            const data = aOptions.data;
            const inner = graph ? `GRAPH <${graph}> { ${data} }` : data;
            try {
                let res = await client.update(`INSERT DATA { ${inner} }`);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    },

    // Clear the whole repository (all named graphs and the default graph).
    // caution! this operation cannot be undone!
    clearDataSet(client) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await client.update(`CLEAR ALL`);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    },

    // Clear a single context (named graph).
    // caution! this operation cannot be undone!
    clearSpecificGraph(aOptions, client) {
        aOptions = aOptions || {};
        return new Promise(async (resolve, reject) => {
            const graph = this.resolveGraph(aOptions.graph);
            try {
                let res = await client.update(`CLEAR GRAPH <${graph}>`);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    },

    // List the contexts (named graphs) of the repository.
    getContexts(client) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await client.query(
                    `SELECT DISTINCT ?graph { GRAPH ?graph { ?s ?p ?o } }`
                );
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }
};

module.exports = EnapsoQleverAdmin;
