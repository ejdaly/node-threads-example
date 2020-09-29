const Worker = require("./worker");

main();
async function main() {
  const process_data_worker_1 = new Worker(`${__dirname }/workers/process_data.js`, {
    name: "process_data_worker_1"
  });
  
  for(let filename of ["file1", "file2"]) {
    const result = await process_data_worker_1(filename);
    console.log(`File: ${filename}, Result: ${result}`);
  }
  
  const process_data_mainthread = require("./workers/process_data");
  for(let filename of ["file3", "file4"]) {
    const result = await process_data_mainthread(filename);
    console.log(`File: ${filename}, Result: ${result}`);
  }
}