class Compilador{
    constructor(){
        this.vars_r = null
        this.exp = null
        this.vars = []
        this.vars_negative = []
        this.result = ""
        this.error_msg = null
        this.specialChars = ["→", "↔", "¬", "∧", "∨", "⊕"]
    }
    with(code){
        this.exp = code.replace(/ /g, '')
        return this
    }
    _validate(){
        if(!this.exp){
            this.error_msg = "Expression not specified"
        }
        if(this.exp.match(/[^a-zA-Z)(→↔¬∧∨⊕]/g)){
            this.error_msg = "Expression contains not supported chars"
            return false
        }
        if(this._continuousOperators() || this._continuousLetter()){
            this.error_msg = "Invalid Expression"
            return false
        }
        if(this._checkParentheses()){
            this.error_msg = "Parentheses Missmatch"
            return false
        }
        return true
    }
    _continuousOperators(){
        for(var k in (temp = [...this.exp])){
            if(this.specialChars.includes(temp[k]) && this.specialChars.includes(temp[k-1])){
                return true
            }
        }
        return false
    }
    _continuousLetter(){
        for(var k in (temp = [...this.exp])){
            if(k == 0) continue;
            if(temp[k].match(/[A-Za-z]/g) && temp[k-1].match(/[A-Za-z]/g)){
                return true
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
    get(){}
    _createTable(){}
    _getIndex(exp){
        var match = false, after_matches = 0, match_index_start = [], match_index_end = []
        for(var k in (temp = [...exp])){
            if(temp[k] == '('){
                if(match){
                    after_matches++
                }else{
                    match = true
                    match_index_start.push(k)
                }
            }
            if(temp[k] == ')'){
                if(after_matches){
                    after_matches--
                }else{
                    match = false
                    match_index_end.push(k)
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
        for(var k in (temp = [...string])){
            switch(temp[k]){
                case '→':
                case '↔':
                case '∧':
                case '∨':
                case '⊕':
                    if(p == 0){
                        end = k
                        data.push(string.substr(start, end - start))
                        data.push(temp[k])
                        start = key + 1
                    }
                    break
                case '(':
                    p++
                    break
                case ')':
                    p--
                    if(p == 0){
                        end = neg_f? k + 1 : k
                        neg_f = false
                        data.push(string.substr(start + 1, end - start - 1))
                        start = k + 1
                        last = true
                    }
                    break
                case '¬':
                    if(temp[k + 1] == '('){
                        if(neg_f == false){
                            start = k - 1
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
            end = k
            data.push(string.substr(start, end - start + 1))
        }
        return data.filter(a=>a)
    }
    _addSpacesBetweenChars(str){
        return [...str].join` `
    }
    _printArrayP(array){
        for(var k in array){
            if(Array.isArray(array[k])){
                this._printArrayP(array[k])
            }else{
                this._calcFunction(array[k])
            }
        }
        return this
    }
    _printVars(){}
    _getVars(){
        for(var k in (temp = [...this.exp])){
            if(temp[k].match(/^[a-zA-Z]+$/g)){
                if(!this.vars.includes(temp[k])){
                    this.vars.push(temp[k])
                }
            }
        }
        var cant_v = this.vars.length
        var cant_r = cant_v ** 2
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
        for(var k in (temp = [...this.exp])){
            if(temp[k].match(/^[a-zA-Z]+$/g)){
                if(k > 0 && temp[k-1] == '¬'){
                    if(!this.vars_negative.includes(`¬${temp[k]}`)){
                        this.vars_negative.push(`¬${temp[k]}`)
                    }
                }
            }
        }
        for(var k of this.vars_negative){
            this.vars_r[k] = this.vars_r[[...k][1]].reverse() // aqui va a dar algun problema
        }
        return this.vars_negative
    }
}
