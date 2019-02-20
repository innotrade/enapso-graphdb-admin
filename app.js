// Innotrade Enapso GraphDB Admin Example
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// require the Enapso GraphDB Admin Demo module
const EnapsoGraphDBAdminDemo = require("./examples/demo1");

console.log("Enapso GraphDB Admin Demo");

(async () => {
    var lRes;

    // lists all repositories operated in your GraphDB instance
    lRes = await EnapsoGraphDBAdminDemo.getRepositoriesDemo();
    console.log("Repositories:\n" + JSON.stringify(lRes, null, 2));

    // lists all locations configured in your GraphDB instance
    lRes = await EnapsoGraphDBAdminDemo.getLocationsDemo();
    console.log("Locations:\n" + JSON.stringify(lRes, null, 2));

    // lists all contexts (named graphs) configured in the "Test" Repository your GraphDB instance
    lRes = await EnapsoGraphDBAdminDemo.getContextsDemo();
    console.log("Contexts:\n" + JSON.stringify(lRes, null, 2));

    // should return 0 rows, after deleting named graph
    lRes = await EnapsoGraphDBAdminDemo.queryDemo();
    console.log("Query Result:\n" + JSON.stringify(lRes, null, 2));

    // import a graph from a file
    lRes = await EnapsoGraphDBAdminDemo.uploadFileDemo();
    console.log("Upload File:\n" + JSON.stringify(lRes, null, 2));

    // should return some rows according to imported graph
    // give GraphDB some seconds to import the delivered graph asynchronously
    setTimeout(async function() {
        lRes = await EnapsoGraphDBAdminDemo.queryDemo();
        console.log("Result:\n" + JSON.stringify(lRes, null, 2));
    }, 2000);
})();
