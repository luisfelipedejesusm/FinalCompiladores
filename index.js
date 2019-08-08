var compilador = new Vue({
    el: '#app',
    data: {
        code: '',
        results: null
    },
    methods: {
        run: function(){
            var _compilador = new Compilador();
            if(this.results == "" || this.results == null){
                M.toast({html: "Unespecified Expression", classes: 'danger-toast'})
                return;
            }
            try{
                this.results = _compilador.with(this.code).get()
            }catch(e){
                this.results = null
                M.toast({html: "Syntax Error", classes: 'danger-toast'})
            }
            if(typeof this.results == "string"){
                M.toast({html: this.results, classes: 'danger-toast'})
            }
        }
    }
})
