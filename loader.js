const fs = require('fs');

function load(){
    const fname = process.argv[2];
    if(!fname) throw "Missing filename.";
    const src = fs.readFileSync(fname, 'utf-8');
    return src;
}

module.exports = load;