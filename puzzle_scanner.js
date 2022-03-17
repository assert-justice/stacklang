const { endianness } = require("os");

function grab(src, start, seek, ends){
    let idx = src.indexOf(seek, start[0]);
    if(idx === -1) return null;
    idx += seek.length;
    let endIdx = Infinity;
    for (const end of ends) {
        let temp = src.indexOf(end, idx);
        if(temp < endIdx && temp !== -1) endIdx = temp;
    }
    if(endIdx === Infinity) return null;
    start[0] = endIdx;
    return src.slice(idx, endIdx).trim();
}

function scanPuzzle(src){
    // find title
    const start = [0];
    const id = grab(src, start, 'ID:', ['TITLE']);
    const title = grab(src, start, 'TITLE:', ['DESCRIPTION']);
    const description = grab(src, start, 'DESCRIPTION:', ['MAX_CYCLES', 'IN']);
    const maxCycles = +grab(src, start, 'MAX_CYCLES', ['IN']) || 1_000_000;
    const inputs = [];
    while(true){
        const input = grab(src, start, 'IN:', ['IN', 'SOLUTION']);
        if(!input) break;
        inputs.push(input);
    }
    const solutions = [];
    while(true){
        const solution = grab(src, start, 'SOLUTION:', ['SOLUTION', 'END']);
        if(!solution) break;
        solutions.push(solution);
    }
    return {id, title, description, maxCycles, inputs, solutions};
}

module.exports = scanPuzzle;