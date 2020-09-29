# node-threads-example

The idea here is that we can define modules as usual (e.g. workers/process_data.js), but add a snippet to the end:

```js
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
```

So, when this module is loaded normally (with require()) it just works as a standard module.
But it can also be loaded as a worker, with the exact same exposed module.exports.
So, code in the main thread (app.js) is exactly the same - but the work can be done in main thread / worker thread..

## Start
$ node app.js
