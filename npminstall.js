var isWindows = process.platform === "win32";
const { execSync } = require('child_process');
var command='';
if (isWindows){    
    command = 'npm i msnodesqlv8@0.6.12'
    console.log(`Started installing msnodesqlv8`)
    execSync(command);
    console.log(`Finished installing msnodesqlv8`)
}