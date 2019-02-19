// Innotrade Enapso GraphDB Admin Example
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany

// require the Enapso GraphDB Admin Demo package
const EnapsoGraphDBAdminDemo = require("./examples/demo1");

console.log("Enapso GraphDB Admin Demo");

(async () => {
    var lRes;
    // should return 0 rows, after deleting named graph
    lRes = await EnapsoGraphDBAdminDemo.queryDemo();
    console.log(lRes);
    // import a graph from a file
    lRes = await EnapsoGraphDBAdminDemo.uploadFileDemo();
    console.log(lRes);
    // should return some rows according to imported graph
    // give GraphDB some seconds to import the delivered graph asynchronously
    setTimeout(async function() {
        lRes = await EnapsoGraphDBAdminDemo.queryDemo();
        console.log(lRes);
    }, 2000);
})();
