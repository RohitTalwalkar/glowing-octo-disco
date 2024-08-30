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

// Print all entries, across all of the sources, in chronological order.
module.exports = (logSources, printer) => {
  // add one item from each log source to start out
  const logQueue = new MinPriorityQueue((source) => source.date);
  for (let source of logSources) {
    logQueue.enqueue(source.pop());
  }
  while (!logQueue.isEmpty()) {
    printer.print(logQueue.dequeue());
   // add one item from each log source if it isn't drained
    for (let source of logSources) {
      if (!source.drained) {
        let nextItem = source.pop();
        if (nextItem && nextItem.date) {
          logQueue.enqueue(nextItem);
        }
      }
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};
