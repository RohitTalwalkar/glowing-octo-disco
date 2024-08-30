"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  printer.print(logSources[1].pop());
  printer.print(logSources[0].pop());
  return console.log("Sync sort complete.");
};
