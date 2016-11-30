process.on('uncaughtException', function(error) {
  // Catch the error
  // Send report via google analytics here
  console.log('Uncaught node.js on ' + ' | Error: ', error);
});