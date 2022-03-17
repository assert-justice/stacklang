const load = require('./loader');
const {scanPuzzle, scanScript, scanMacro} = require('./puzzle_scanner');
const test = require('./test');
const Interpreter = require('./interpreter');

function runTest(solutionSrc, puzzleSrc){
    const puzzle = scanPuzzle(puzzleSrc);
    test(puzzle, solutionSrc);
}

function runScript(solutionSrc){
    const interpreter = new Interpreter();
    const solution = scanScript(solutionSrc);
    console.log(solution);
    interpreter.load(solution.input);
    interpreter.run();
    const inbox = interpreter.outbox;
    interpreter.load(solution.scriptSrc, [], inbox);
    interpreter.run();
    console.log(interpreter.outbox);
}

function main(){
    const solutionFname = process.argv[3] || 'examples/test.st';
    const solutionSrc = load(solutionFname);
    const puzzleFname = process.argv[4] || 'puzzles/test_puzzle.sp';
    const puzzleSrc = load(puzzleFname);
    const macros = scanMacro(load('macros/dev.sm'));
    if(process.argv[2] === 'test'){
        runTest(solutionSrc, puzzleSrc);
    }
    else{
        runScript(solutionSrc);
    }
}

main();

// const puzzleFname = process.argv[2] || 'puzzles/test_puzzle.sp';
// const programFname = process.argv[3] || 'examples/test.st';

// const puzzleSrc = load(puzzleFname);
// const programSrc = load(programFname);

// const puzzle = scanPuzzle(puzzleSrc);

// console.log(puzzle);

// const results = test(puzzle, programSrc);

// console.log(results);
// const interpreter = new Interpreter();
// interpreter.load(src, [0,-20,30,-10,10,0,1,2]);
// interpreter.run();
// interpreter.dump();