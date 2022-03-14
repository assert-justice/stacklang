const src = require('./loader')();
const Interpreter = require('./interpreter');

const interpreter = new Interpreter();
interpreter.load(src);
// const parser = new Parser();
// const tokens = parser.parse(src);
// console.log(tokens);