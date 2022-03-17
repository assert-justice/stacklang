const Parser = require('./parser');

class Interpreter{
    constructor(){
        this.parser = new Parser();
        this.clear();
        this.numRegisters = 8;
        this.maxValue = 9999;
        this.minValue = -9999;
        this.debug = false;
        this.opcodes = {
            bin:{'add': ()=>this.bin((a,b)=>a+b),
                'sub': ()=>this.bin((a,b)=>a-b),
                'mul': ()=>this.bin((a,b)=>a*b),
                'div': ()=>this.bin((a,b)=>{
                    if(b === 0){
                        this.error('Attempted to divide by zero');
                        return 0;
                    }
                    else{return Math.trunc(a/b);}
                }),
                'rem': ()=>this.bin((a,b)=>{
                    if(b === 0){
                        this.error('Attempted to divide by zero');
                        return 0;
                    }
                    else{return a%b;}
                }),
                'swp': ()=>{
                    const b = this.stack.pop();
                    const a = this.stack.pop();
                    this.stack.push(b);
                    this.stack.push(a);
                },
                'rand': ()=>this.bin((a,b)=>this.rand(a, b)),
            },
            unary:{'neg': ()=>this.stack[this.stack.length-1] *= -1,
                'dup': ()=>this.stack.push(this.stack[this.stack.length-1]),
                'del': ()=>this.stack.pop(),
                'out': ()=>this.outbox.push(this.stack.pop()),
                'sav': ()=>{
                    const dest = this.token.val;
                    const val = this.stack.pop();
                    this.mem[dest] = val;
                },
                'sez': ()=>{if(this.stack.pop() === 0)this.ip++;},
                'snz': ()=>{if(this.stack.pop() !== 0)this.ip++;},
                'slz': ()=>{if(this.stack.pop() < 0)this.ip++;},
                'sgz': ()=>{if(this.stack.pop() > 0)this.ip++;},
            },    
            nullary:{
                'in': ()=>{
                    if(this.inbox.length === 0){this.halt();}
                    else{this.stack.push(this.inbox.pop());}
                },
                'rev': ()=>this.stack.reverse(),
                'jmp': ()=>this.ip = this.token.val,
                'lit': ()=>this.stack.push(this.token.val),
                'lod': ()=>this.stack.push(this.mem[this.token.val]),
                'noop': ()=>{/* Left intentionally empty. */},
                'dump': ()=>this.dump(),
                'empty': ()=>{while(this.stack.length > 0)this.outbox.push(this.stack.pop());},
                'halt': ()=>this.halt,
            }
        };
    }
    isOpcode(opcode){
        return Object.values(this.opcodes).some(obj => obj[opcode]);
    }
    halt(){
        this.halted = true;
        // maybe add more side effects later
    }
    mod(a,b){
        // True modulo function
        let m = a%b;
        if (m < 0) {
            m = (b < 0) ? m - b : m + b;
        }
        return m;
    }
    trunc(n){
        // Truncate numbers into the expected range. No overflows.
        return Math.min(Math.max(n, this.minValue), this.maxValue);
    }
    rand(min, max){
        return Math.floor((max - min) * Math.random()) + min;
    }
    assemble(src){
        const tokens = this.parser.parse(src);
        const me = this;
        const newTokens = [];
        const labels = {};
        const jumps = [];
        let i;
        function consumeLabel(){
            i++;
            if(i === tokens.length){
                me.error('Expected a label, instead reached eof');
                return;
            }
            const label = tokens[i].opcode;
            if(me.isOpcode(label)){
                me.error(`Label names cannot be opcodes`);
                return;
            }
            return label;
        }
        for (i = 0; i < tokens.length; i++) {
            this.token = tokens[i];
            const {opcode, val} = this.token;
            if(opcode === 'mark'){
                const label = consumeLabel();
                if(label){this.error(`${opcode} expects `)}
                else{labels[label] = newTokens.length;}
            }
            else if(!this.isOpcode(opcode)){
                this.error(`'${opcode}' is not a valid opcode`);
                return;
            }
            else if(opcode === 'jmp'){
                this.token.val = consumeLabel();
                jumps.push(this.token);
                newTokens.push(this.token);
            }
            else if(opcode === 'sav' || opcode === 'lod'){
                i++;
                const register = tokens[i];
                if(!register || register.type !== 'register'){
                    this.error(`${opcode} must be followed by a valid register name`);
                }
                else {
                    this.token.val = register.val;
                    newTokens.push(this.token);
                }
            }
            else{
                newTokens.push(this.token);
            }
            if(this.errorMsg) return;
        }
        for (const jump of jumps) {
            if(labels[jump.val] === undefined){
                this.token = jump;
                this.error(`'${jump.val}' is not a valid label`);
                return;
            }
            jump.val = labels[jump.val];
        }
        return newTokens;
    }
    printTokens(){
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            console.log(i,':',token);
        }
    }
    load(src, inbox = null, expected = null){
        this.clear();
        this.tokens = this.assemble(src);
        this.inbox = inbox ? [...inbox] : [];
    }
    clear(){
        this.tokens = [];
        this.ip = 0;
        this.stack = [];
        this.mem = {};
        this.inbox = [];
        this.outbox = [];
        this.cycles = 0;
        this.errorMsg = null;
        this.token = null;
        this.halted = false;
    }
    dump(){
        console.log('ip:', this.ip);
        console.log('Cycles:', this.cycles);
        console.log('Stack:', this.stack);
        console.log('Inbox:', this.inbox);
        console.log('Outbox:', this.outbox);
        console.log('Memory:', this.mem);
    }
    error(msg){
        console.log(`Error: ${msg} on line ${this.token.line}.`);
        this.errorMsg = msg;
        this.halt();
    }
    stackCheck(minLength){
        if(this.stack.length < minLength){
            const {opcode} = this.token;
            this.error(`${opcode} requires a stack size of at least ${minLength} but the current stack length is ${this.stack.length}`);
        }
    }
    bin(fun){
        const b = this.stack.pop();
        const a = this.stack.pop();
        this.stack.push(this.trunc(fun(a,b)));
    }
    cycle(){
        if(this.ip >= this.tokens.length) {this.halt(); return;}
        if(this.halted) return;
        this.cycles++;
        this.token = this.tokens[this.ip];
        this.ip++;
        const {opcode} = this.token;
        this.stackCheck(opcode);
        let func
        if(func = this.opcodes.bin[opcode]){
            this.stackCheck(2);
        }
        else if( func = this.opcodes.unary[opcode]){
            this.stackCheck(1);
        }
        else if(func = this.opcodes.nullary[opcode]){}
        else{
            this.error(`'${opcode}' is not a valid opcode.`);
        }
        if(!this.halted) func();
        if(this.debug){
            console.log(opcode, this.stack);
        }
    }
    run(maxCycles = Infinity, debug = false){
        this.debug = debug;
        for(let i = 0; i < maxCycles; i++){
            if(this.halted) break;
            this.cycle();
        }
        if(!this.halted) this.error('Maximum cycle count exceeded!');
        this.debug = false;
    }
}

module.exports = Interpreter;