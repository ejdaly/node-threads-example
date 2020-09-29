const Comlink = require(`./comlink-4.1.0`);
const { Worker } = require('worker_threads');

// This is just a simple wrapper around worker_threads and Comlink, to run a module in a 
// thread, and expose it's methods (module.exports) on the main thread
// The object returned from this function has the same methods as if the module were required
// in the main thread (but all calls are async - see Comlink documentation)
//

// NOTE: @path must be absolute path and must include the .js extension...
// workerData is optional:
// https://nodejs.org/docs/latest-v12.x/api/worker_threads.html#worker_threads_worker_workerdata
//
module.exports = function(path, workerData) {
  const worker = new Worker(`${path}`, { workerData });
  console.info(`Worker.new [path: ${path}]`, { workerData });

  worker.on("message", function(data = {}) {
    const { method, options } = data;
    if(method === "log") {
      const { level, message, data, context } = options;
      console.log({ level, message, data, context });
    }
  });

  // It's difficult to know when different errors will cause the 
  // thread to exit (e.g. it seems uncaughtExceptions are more 
  // likely to cause an issue than uncaughtRejections; and then
  // errors which occur in EventEmitter callbacks, seem to not
  // cause any issues...)
  //
  worker.on("exit", function(code) {
    if(code) {
      throw new Error(`Worker Terminated Unexpectedly [path: ${path}, code: ${code}]`);
    }
  });

  return Comlink.wrap(Comlink.nodeEndpoint(worker));
}