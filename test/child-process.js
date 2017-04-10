const spawn = require('child_process').spawn;
const grep = spawn('ls', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
