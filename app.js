// Worker is a wrapper - will take whatever module you give it, and
// create a worker thread for that module, and expose the module.exports
// back to the main thread
//
const Worker = require("./worker");

main();
async function main() {

  // Create a new worker from "workers/process_data.js"
  // The result "process_data_worker_1" has the same API as the standard module.exports
  // but runs in a separate thread
  //
  const process_data_worker_1 = new Worker(`${__dirname }/workers/process_data.js`, {
    name: "process_data_worker_1"
  });
  
  for(let filename of ["file1", "file2"]) {
    const result = await process_data_worker_1(filename);
    console.log(`File: ${filename}, Result: ${result}`);
  }
  
  // We could also just load the process_data module as normal here and
  // use it in the main thread. The API exposed (module.exports from process_data)
  // is exactly the same..
  //
  const process_data_mainthread = require("./workers/process_data");
  for(let filename of ["file3", "file4"]) {
    const result = await process_data_mainthread(filename);
    console.log(`File: ${filename}, Result: ${result}`);
  }
}