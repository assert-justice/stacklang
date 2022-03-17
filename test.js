const Interpreter = require('./interpreter');

function test(puzzle, solutionSrc){
    const interpreter = new Interpreter();
    const {maxCycles, inputs, solutions} = puzzle;
    const results = [];
    for (const input of inputs) {
        interpreter.load(input);
        interpreter.run();
        const inbox = interpreter.outbox;
        let answer = null;
        let bestSize = Infinity;
        let bestSpeed = Infinity;
        for (const solution of solutions) {
            interpreter.load(solution, inbox);
            interpreter.run(maxCycles);
            if(!answer) answer = interpreter.outbox;
            if(interpreter.tokens.length < bestSize) bestSize = interpreter.tokens.length;
            if(interpreter.cycles < bestSpeed) bestSpeed = interpreter.cycles;
        }
        interpreter.load(solutionSrc, inbox, answer);
        interpreter.run(maxCycles);
        const result = {
            passed: !interpreter.errorMsg,
            bestSize,
            bestSpeed,
            solutionSize: interpreter.tokens.length,
            solutionSpeed: interpreter.cycles,
        };
        results.push(result);
        if(!result.passed) break;
    }
    return results;
}

module.exports = test;