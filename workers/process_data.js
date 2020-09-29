module.exports = async function processData(filename) {
  console.log(`Processing: ${filename}`);
  return filename.length;
}

const Comlink = require(`../comlink-4.1.0`);
const { isMainThread, parentPort } = require('worker_threads');
if(parentPort && !isMainThread) {

  // Just make sure these get logged. If an error causes the thread to exit, that is caught
  // in worker.js
  //
  process.on('uncaughtException', (err) => { console.error(err); });
  process.on('unhandledRejection', (reason) => { console.error(reason); });
  Comlink.expose(module.exports, Comlink.nodeEndpoint(parentPort));
}