class Compilador{
    constructor(){
        this.vars_r = {}
        this.vars_array = []
        this.exp = null
        this.vars = []
        this.vars_negative = []
        this.result = ""
        this.error_msg = null
        this.specialChars = ["→", "↔", "∧", "∨", "⊕"]
    }
    with(code){
        this.exp = code.replace(/ /g, '').replace(/¬¬/g, '')
        return this
    }
    _validate(){
        if(!this.exp){
            this.error_msg = "Expression not specified"
        }
        if(this.exp.match(/[^a-zA-Z)(→↔¬∧∨⊕]/g)){
            var char = this.exp.match(/[^a-zA-Z)(→↔¬∧∨⊕]/g)[0]
            var pos = this.exp.indexOf(char)
            this.error_msg = `ERROR: Unrecognizable Token [ ${char} ]. ( Column ${pos} )`
            return false
        }
        var p = this._continuousOperators()
        if(p){
            this.error_msg = `ERROR: Expression can not contain continuous operators. [ ${p.char} ] found more than once in column ${p.pos}`
            return false
        }
        p = this._continuousLetter()
        if(p){
            this.error_msg = `ERROR: Expression can not contain continuous operands. [ ${p.char} ] found more than once in column ${p.pos}`
            return false
        }
        if(this._checkParentheses()){
            this.error_msg = "Parentheses Missmatch"
            return false
        }
        return true
    }
    _continuousOperators(){
        var temp = [...this.exp]
        for(var k in temp){
            if(this.specialChars.includes(temp[~~k]) && this.specialChars.includes(temp[~~k-1])){
                return {pos: k, char: temp[~~k]}
            }
        }
        return false
    }
    _continuousLetter(){
        var temp = [...this.exp]
        for(var k in temp){
            if(~~k == 0) continue;
            if(temp[~~k].match(/[A-Za-z]/g) && temp[~~k-1].match(/[A-Za-z]/g)){
                return {pos: k, char: temp[~~k]}
            }
        }
        return false
    }
    _checkParentheses(){
        var p_c = 0
        for(var k of [...this.exp]){
            if(k == '(')
                p_c++
            else if(k == ')')
                p_c--
        }
        return p_c != 0
    }
    get(){
        if(this._validate()){
            var res = this._printVars()._printArrayP(this._getIndex(this.exp))._calcFunction(this.exp)
            console.log(res)
            return {
                vars: res.vars_array,
                values: res.vars_r
            }
        }else{
            return this.error_msg
        }
    }
    _createTable(){}
    _getIndex(exp){
        var match = false, after_matches = 0, match_index_start = [], match_index_end = []
        var temp = [...exp];
        for(var k in temp){
            if(temp[~~k] == '('){
                if(match){
                    after_matches++
                }else{
                    match = true
                    match_index_start.push(~~k)
                }
            }
            if(temp[k] == ')'){
                if(after_matches){
                    after_matches--
                }else{
                    match = false
                    match_index_end.push(~~k)
                }
            }
        }
        return this._checkIndexLength(match_index_start, match_index_end, exp)
    }
    _checkIndexLength(mis, mie, exp){
        if(mis.length != mie.length) return true;
        return this._getParentheses(mis, mie, exp)
    }
    _getParentheses(mis, mie, exp){
        var data = []
        for(var i = 0; i < mis.length; i++){
            var n_exp = exp.substr(mis[i] + 1, mie[i] - mis[i] - 1)
            if(this._hasParentheses(n_exp)){
                data.push(this._getIndex(n_exp))
            }
            data.push(n_exp)
        }
        return data
    }
    _hasParentheses(str){
        for(var k of [...str]){
            if(k == '(' || k == ')') return true
        }
        return false
    }
    _customPregMatch(string){
        var data = [], p = 0, start = 0, end = null, last = false, neg_f = false
        var temp = [...string]
        for(var k in temp){
            switch(temp[~~k]){
                case '→':
                case '↔':
                case '∧':
                case '∨':
                case '⊕':
                    if(p == 0){
                        end = ~~k
                        data.push(string.substr(start, end - start))
                        data.push(temp[~~k])
                        start = ~~k + 1
                    }
                    break
                case '(':
                    p++
                    break
                case ')':
                    p--
                    if(p == 0){
                        end = neg_f? ~~k + 1 : ~~k
                        neg_f = false
                        data.push(string.substr(start + 1, end - start - 1))
                        start = ~~k + 1
                        last = true
                    }
                    break
                case '¬':
                    if(temp[~~k + 1] == '('){
                        if(neg_f == false){
                            start = ~~k - 1
                            neg_f = true
                        }
                    }
                    break
                default:
                    last = false
                    break
            }
        }
        if(last == false){
            end = ~~k
            data.push(string.substr(start, end - start + 1))
        }
        return data.filter(a=>a)
    }
    _addSpacesBetweenChars(str){
        return [...str].join` `
    }
    _printArrayP(array){
        for(var k in array){
            if(Array.isArray(array[~~k])){
                this._printArrayP(array[~~k])
            }else{
                this._calcFunction(array[~~k])
            }
        }
        return this
    }
    _printVars(){
        for(var k of this._getVars()){
            this.result += `<th>${this._addSpacesBetweenChars(k)}</th>`
            this.vars_array.push(this._addSpacesBetweenChars(k))
        }
        for(var k of this._getVarsNegative()){
            this.result += `<th>${this._addSpacesBetweenChars(k)}</th>`
            this.vars_array.push(this._addSpacesBetweenChars(k))
        }
        return this
    }
    _getVars(){
        var temp = [...this.exp]
        for(var k in temp){
            if(temp[~~k].match(/^[a-zA-Z]+$/g)){
                if(!this.vars.includes(temp[~~k])){
                    this.vars.push(temp[~~k])
                }
            }
        }
        var cant_v = this.vars.length
        var cant_r = 2 ** cant_v
        var exp_c = 2;
        for(var k of this.vars){
            var cant_vf = cant_r / exp_c
            var f_c = 0, is_v = true, d_v = []
            for(var i = 0; i < cant_r; i++){
                d_v.push(is_v)
                if(++f_c == cant_vf){
                    is_v = !is_v
                    f_c = 0
                }
            }
            this.vars_r[k] = d_v
            exp_c *= 2
        }
        return this.vars
    }
    _getVarsNegative(){
        var temp = [...this.exp]
        for(var k in temp){
            if(temp[~~k].match(/^[a-zA-Z]+$/g)){
                if(~~k > 0 && temp[~~k-1] == '¬'){
                    if(!this.vars_negative.includes(`¬${temp[~~k]}`)){
                        this.vars_negative.push(`¬${temp[~~k]}`)
                    }
                }
            }
        }
        for(var k of this.vars_negative){
            console.log(this.vars_r[[...k][1]])
            this.vars_r[k] = this.vars_r[[...k][1]].slice(0).reverse() // aqui va a dar algun problema
        }
        return this.vars_negative
    }
    _calcFunction(exp){
        var data = this._customPregMatch(exp)
        var cant_v = this.vars.length
        var cant_r = 2 ** cant_v, arr2 = []
        for(var i = 0; i < cant_r; i++){
            var code = ""
            for(var d of data){
                switch (d) {
                    case '∧':
                        code += ' && '
                        break;
                    case '∨':
                        code += ' || '
                        break;
                    case '→':
                        code += ' <= '
                        break;
                    case '↔':
                        code += ' == '
                        break;
                    case '⊕':
                        code += ' ^ '
                        break;
                    default:
                        code += `this.vars_r["${d}"][${i}]`
                        break;
                }
            }
            arr2.push(eval(code))
        }
        this.vars_r[exp] = arr2
        this.result += `<th>${this._addSpacesBetweenChars(exp)}</th>`
        this.vars_array.push(this._addSpacesBetweenChars(exp))
        if(this._hasNegative(exp)){
            this.vars_r[`¬(${exp})`] = arr2.map(a=>!a)
            this.result += `<th>¬(${this._addSpacesBetweenChars(exp)})</th>`
            this.vars_array.push(`¬(${this._addSpacesBetweenChars(exp)})`)
        }
        return this
    }
    _hasNegative(exp){
        var f_exp = `¬(${exp})`
        return this.exp.indexOf(f_exp) > -1
    }
}
