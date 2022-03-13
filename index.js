const src = require('./loader')();
const Parser = require('./parser');
const Interpreter = require('./interpreter');

const parser = new Parser();
const tokens = parser.parse(src);
console.log(tokens);