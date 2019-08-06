class AnalizadorLexico {
    constructor(code) {
        if(!code) throw('No code provided to Lexic Analyzer')
        // this.code = code.replace(/[()]/g, '')
        this.raw_code = code
        this.constants = { "T": 1, "F": 0 }
    }

function test(){
	var x = "a b ac (a b ac b) a (a b)"
	var res = x;
    var start_pos = -1;
    var end_pos = -1;
    var count = 0;
    var temp_count = 0;
    var temp = {};
    for(var i = 0; i < x.length; i++){
        if(start_pos == -1){
            if(x[i] == '('){
                start_pos = i
            }
        }else{
            if(x[i] == '('){
                count += 1
            }else if(x[i] == ')'){
                if(count > 0){
                    count -= 1
                }else{
                    temp["temp"+(++temp_count)] = x.substring(start_pos+1, i)
                    res = res.replace("(" + temp["temp"+temp_count] + ")", "temp"+temp_count)
                    start_pos = -1
                }
            }
        }
    }
	return res;
}

    // break_words(_){
    //     return _.split` `.filter(a=>a!='')
    // }
    // is_variable(_){
    //     return _.match(/^[A-Za-z_]+$/g) != null
    // }
    // is_constante(_){
    //     var consts = this.constants
    //     return Object.keys(consts).indexOf(_) > -1
    // }
    // is_operador(_){
    //     return _.match(/^[→↔¬∧∨⊕]+$/g) != null
    // }
    // analyze() {
    //     var _this = this
    //     var _tokens = this.break_words(this.code)
    //     var _tokens_type = _tokens.map(a=>(
    //         _this.is_constante(a)? {constante: a} :
    //         _this.is_variable(a)?  {variable: a}  :
    //         _this.is_operador(a)?  {operador: a}  :
    //         {not_valid: a}
    //     ))
    //     var error_index;
    //     if((error_index = _tokens_type.map(a=>Object.keys(a)).flat().indexOf('not_valid')) > -1){
    //         _tokens[error_index] = `[${_tokens[error_index]}]`
    //         __throw(`Identificador ${_tokens[error_index]} invalido en { ${_tokens.join` `} }`)
    //         return false
    //     }
    //     __throw("all tokens valid")
    //     return this.raw_code
    // }
}
