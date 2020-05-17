var isWindows = process.platform === "win32";
const { execSync } = require('child_process');
var command='';
console.log(`Is windows ${isWindows}`)
if (isWindows){    
    command = 'npm install msnodesqlv8'
    console.log(`Started installing msnodesqlv8`)
    execSync(command);
    console.log(`Finished installing msnodesqlv8`)
}