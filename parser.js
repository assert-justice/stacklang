class Parser{
    constructor(){
        //
    }
    error(msg){
        this.errorMsg = msg;
        console.log(`Parse error: ${msg} on line ${this.line}.`);
    }
    addToken(opcode = null, val = 0){
        if(!opcode){
            opcode = this.src.slice(this.start, this.current);
        }
        this.tokens.push({opcode, val, line: this.line});
    }
    isEof(){return this.current >= this.src.length;}
    peek(){return this.src[this.current];}
    advance(){
        this.current++;
        return this.src[this.current - 1];
    }
    isAlpha(c){return '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(c);}
    isNumeric(c){return '0123456789'.includes(c);}
    isAlphaNumeric(c){return this.isAlpha(c) || this.isNumeric(c);}
    comment(){
        while(!this.isEof()){
            const c = this.peek();
            if(c === '\n') return;
            this.advance();
        }
    }
    number(){
        while(!this.isEof()){
            const c = this.peek();
            if(!this.isNumeric(c)) break;
            this.advance();
        }
        const val = +this.src.slice(this.start, this.current);
        if(isNaN(val)) return;
        this.addToken('lit', val);
    }
    ident(){
        while(!this.isEof()){
            const c = this.peek();
            if(!this.isAlphaNumeric(c)) break;
            this.advance();
        }
        this.addToken();
    }
    parse(src){
        this.src = src;
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.tokens = [];
        this.errorMsg = null;
        while(!this.isEof() && !this.errorMsg){
            this.start = this.current;
            const c = this.advance();
            if(' \t\r'.includes(c)){}
            else if(c === '\n'){this.line++;}
            else if(c === ';'){this.comment();}
            else if('+-*/%'.includes(c)){
                this.addToken();
            }
            else if(this.isNumeric(c)){this.number();}
            else if(this.isAlpha(c)){this.ident();}
            else{this.error(`Unexpected character '${c}'`);}
        }
        if(this.errorMsg) return [];
        return this.tokens;
    }
}

module.exports = Parser;