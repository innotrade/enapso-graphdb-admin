// Innotrade Enapso GraphDB Admin Example
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// require the Enapso GraphDB Admin Demo module
const EnapsoGraphDBClient = require("enapso-graphdb-client");
const EnapsoGraphDBAdmin = require("./enapso-graphdb-admin");

const EnapsoGraphDBAdminDemo = require("./examples/demo1");

console.log("Enapso GraphDB Admin Demo");

(async () => {
    var lRes;

    // instantiate a GraphDB endpoint
    let lEndpoint = new EnapsoGraphDBClient.Endpoint({
        baseURL: EnapsoGraphDBAdminDemo.GRAPHDB_BASE_URL,
        repository: EnapsoGraphDBAdminDemo.GRAPHDB_REPOSITORY,
        prefixes: EnapsoGraphDBAdminDemo.GRAPHDB_DEFAULT_PREFIXES
    });
    // login into GraphDB using JWT
    let lLogin = await lEndpoint.login(
        EnapsoGraphDBAdminDemo.GRAPHDB_USERNAME, 
        EnapsoGraphDBAdminDemo.GRAPHDB_PASSWORD
    );
    // check authentication
    console.log("Login:\n" + JSON.stringify(lLogin, null, 2));
    if( !lLogin.success) {
        return;
    }

    // lists all repositories
    lRes = await lEndpoint.getRepositories();
    console.log("Repositories:\n" + JSON.stringify(lRes, null, 2));

    // upload a file
    lRes = await lEndpoint.uploadFromFile({
        filename: "ontologies/test.owl",
        format: "application/rdf+xml",
        baseURI: "http://ont.enapso.com/test#",
        context: "http://ont.enapso.com/test"
    });
    console.log("uploadFromFile:\n" + JSON.stringify(lRes, null, 2));
    return;

    /*

    // lists all repositories operated in your GraphDB instance
    lRes = await EnapsoGraphDBAdmin.getEndpoint({
        baseURL: EnapsoGraphDBAdminDemo.GRAPHDB_BASE_URL,
        repository: EnapsoGraphDBAdminDemo.GRAPHDB_REPOSITORY
    }).
        // downloads a repository operated in your GraphDB instance
        lRes = await EnapsoGraphDBAdminDemo.uploadFileDemo();
        console.log("Upload File:\n" + JSON.stringify(lRes, null, 2));
        return;    

    // clears the entire "Test" repository
    // CAUTION! This operation cannot be undone!
    // lRes = await EnapsoGraphDBAdminDemo.clearRepositoryDemo();
    // console.log("Clear Repository:\n" + JSON.stringify(lRes, null, 2));

    // lists all repositories operated in your GraphDB instance
    lRes = await EnapsoGraphDBAdminDemo.getRepositoriesDemo();
    console.log("Repositories:\n" + JSON.stringify(lRes, null, 2));

    // lists all locations configured in your GraphDB instance
    lRes = await EnapsoGraphDBAdminDemo.getLocationsDemo();
    console.log("Locations:\n" + JSON.stringify(lRes, null, 2));

    // lists all users configured in your GraphDB instance
    lRes = await EnapsoGraphDBAdminDemo.getUsersDemo();
    console.log("Users:\n" + JSON.stringify(lRes, null, 2));

    // lists all contexts (named graphs) configured in the "Test" Repository your GraphDB instance
    lRes = await EnapsoGraphDBAdminDemo.getContextsDemo();
    console.log("Contexts:\n" + JSON.stringify(lRes, null, 2));

    // clear the test context in the test repository
    lRes = await EnapsoGraphDBAdminDemo.clearContextDemo();
    console.log("Clear Context:\n" + JSON.stringify(lRes, null, 2));

    // should return 0 rows, after deleting named graph
    lRes = await EnapsoGraphDBAdminDemo.queryDemo();
    console.log("Query Result:\n" + JSON.stringify(lRes, null, 2));

    // import a graph from a file
    lRes = await EnapsoGraphDBAdminDemo.uploadFileDemo();
    console.log("Upload File:\n" + JSON.stringify(lRes, null, 2));

    // should return some rows according to imported graph
    // give GraphDB some seconds to import the delivered graph asynchronously
    setTimeout(async function () {
        lRes = await EnapsoGraphDBAdminDemo.queryDemo();
        console.log("Result:\n" + JSON.stringify(lRes, null, 2));

        // downloads a repository operated in your GraphDB instance
        lRes = await EnapsoGraphDBAdminDemo.downloadToFileDemo();
        console.log("Download:\n" + lRes);

    }, 2000);

    */

})();
