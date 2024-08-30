"use strict";
// Using https://www.npmjs.com/package/@datastructures-js/priority-queue

const {
  MinPriorityQueue,
} = require('@datastructures-js/priority-queue');

// n = number of log sources
// the queue is heap-based so it will take up log(n) space
// the queue is heap-based so it will allow for insertions in log(n) time, since we're able to binary search for where to add the item
// the queue will have the next log as the first element, so dequeue will take log(1) time
// javascript uses dynamic arrays so the amortized runtime of growing the array used by the heap is log(1); 
// but yes, when it needs to increase the array size, it will pause the execution
// we could optimize that a bit by starting out with a large array for the heap


// Print all entries, across all of the *async* sources, in chronological order.

const waitForNextLogItem = async (logSources) => {
  const logPromises = [];
  for (let source of logSources) {
    if (!source.drained) {
      logPromises.push(source.popAsync());
    }
  }
  return await Promise.all(logPromises);
}

module.exports = async (logSources, printer) => {
  // add one item from each log source to start out
  const logQueue = new MinPriorityQueue((source) => source.date);
  let nextLogs = await waitForNextLogItem(logSources);
  for (let logItem of nextLogs) {
    logQueue.enqueue(logItem);
  }

  return new Promise(async (resolve, reject) => {
    while (!logQueue.isEmpty()) {
      printer.print(logQueue.dequeue());
      nextLogs = await waitForNextLogItem(logSources);
      for (let logItem of nextLogs) {
        if (logItem) {
          logQueue.enqueue(logItem);
        }
      }
    }
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
