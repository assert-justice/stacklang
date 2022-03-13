class Interpreter{
    constructor(){
        this.load([]);
        this.opcodes = {
            bin:{'+': ()=>this.bin((a,b)=>a+b),
                '-': ()=>this.bin((a,b)=>a-b),
                '*': ()=>this.bin((a,b)=>a*b),
                '/': ()=>this.bin((a,b)=>{
                    if(b === 0){
                        this.error('Attempted to divide by zero');
                        return 0;
                    }
                    else{return Math.trunc(a/b);}
                }),
                '%': ()=>this.bin((a,b)=>{
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
                'save': ()=>{
                    const dest = this.stack.pop();
                    const val = this.stack.pop();
                    this.mem[dest] = val;
                },},
            unary:{'neg': ()=>this.stack[this.stack.length-1] *= -1,
                'dup': ()=>this.stack.push(this.stack[this.stack.length-1]),
                'inc': ()=>this.stack[this.stack.length-1]++,
                'dec': ()=>this.stack[this.stack.length-1]--,
                'del': ()=>this.stack.pop(),
                'out': ()=>this.outbox.push(this.stack.pop()),
                'load': ()=>{
                    const dest = this.stack.pop();
                    this.stack.push(this.mem[dest] ? this.mem[dest] : 0);
                },
                'sez': ()=>{if(this.stack.pop() === 0)this.ip++;},
                'snz': ()=>{if(this.stack.pop() !== 0)this.ip++;},
                'slz': ()=>{if(this.stack.pop() < 0)this.ip++;},
                'sgz': ()=>{if(this.stack.pop() > 0)this.ip++;},
            },    
            nullary:{
                'in': ()=>{
                    if(this.inbox.length === 0){this.halted = true;}
                    else{this.stack.push(this.inbox.pop());}
                },
                'rev': ()=>this.stack.reverse(),
                'jmp': ()=>this.ip = this.token.val,
                'lit': ()=>this.stack.push(this.token.val),
                'noop': ()=>{/* Left intentionally empty. */},
                'dump': this.dump,
            }
        };
    }
    isOpcode(opcode){
        return Object.values(this.opcodes).some(obj => obj[opcode]);
    }
    assemble(tokens){
        const newTokens = [];
        const labels = {};
        this.jumps = [];
        let i;
        function consumeLabel(){
            i++;
            if(i === tokens.length){
                this.error('Expected a label, instead reached eof');
                return;
            }
            i++;
            const label = tokens[i].op;
            if(this.isOpcode(label)){
                this.error(`Label names cannot be opcodes`);
                return;
            }
            return label;
        }
        for (i = 0; i < tokens.length; i++) {
            this.token = tokens[i];
            const {op, val} = this.token;
            if(op === 'mark'){
                const label = consumeLabel();
                if(label){labels[label] = newTokens.length;}
            }
            else if(!this.isOpcode(op)){
                this.error(`'${op}' is not a valid opcode`);
                return;
            }
            else if(op === 'jmp'){
                this.token.val = consumeLabel();
                jumps.push(this.token);
                newTokens.push(this.token);
            }
            else{
                newTokens.push(this.token);
            }
            if(this.errorMsg) return;
        }
        for (const jump of jumps) {
            if(!labels[jump.val]){
                this.token = jump;
                this.error(`'${jump.val}' is not a valid label`);
                return;
            }
            jump.val = labels[jump.val];
        }
        this.tokens = newTokens;
    }
    load(tokens){
        this.tokens = tokens;
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
        console.log(msg);
        this.errorMsg = msg;
        this.halted = true;
    }
    stackCheck(minLength){
        if(this.stack.length < minLength){
            const {op} = this.token;
            this.error(`${op} requires a stack size of at least ${minLength} but the current stack length is ${this.stack.length}`);
        }
    }
    bin(fun){
        const b = this.stack.pop();
        const a = this.stack.pop();
        this.stack.push(fun(a,b));
    }
    cycle(){
        if(this.ip > this.tokens.length) this.halted = true;
        if(this.halted) return;
        this.token = this.tokens[this.ip];
        this.ip++;
        const {op} = this.token;
        if(this.opcodes.bin.includes(op)){
            this.stackCheck(2);
        }
        else if(this.opcodes.unary.includes(op)){
            this.stackCheck(1);
        }
        else if(!this.opcodes.nullary.includes(op)){
            this.error(`'${op}' is not a valid opcode.`);
        }
        if(!this.halted) this.opcodes[op]();
    }
}

module.exports = Interpreter;