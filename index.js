var compilador = new Vue({
    el: '#app',
    data: {
        code: '',
        results: null,
        shortcuts: {
            "_AND_": "∧",
            '_OR_': '∨',
            '_XOR_': '⊕',
            '_IF THEN_': '→',
            '_IF CONDITIONAL_': '↔',
            '_NEGATE_': '¬',
            '_NOT_': '¬'
        }
    },
    watch: {
        code: function(val){
            if(val.match(/_.+?_/g)){
                this.code = this.code.replace(/_.+?_/g, a=>this.shortcuts[a.toUpperCase()] || '')
            }
        }
    },
    methods: {
        focusinput: function(){
            document.getElementById('expression-input').focus()
        },
        run: function(){
            var _compilador = new Compilador();
            if(this.code == "" || this.code == null){
                M.toast({html: "Unespecified Expression", classes: 'danger-toast'})
                return;
            }
            try{
                // debugger
                this.results = _compilador.with(this.code).get()
            }catch(e){
                console.log(e)
                this.results = null
                M.toast({html: "Syntax Error", classes: 'danger-toast'})
            }
            if(typeof this.results == "string"){
                M.toast({html: this.results, classes: 'danger-toast'})
            }
        }
    }
})
