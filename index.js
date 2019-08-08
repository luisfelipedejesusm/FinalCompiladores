var compilador = new Vue({
    el: '#app',
    data: {
        code: '',
        results: null
    },
    methods: {
        run: function(){
            var _compilador = new Compilador();
            try{
                this.results = _compilador.with(this.code).get()
            }catch(e){
                M.toast({html: "Syntax Error", classes: 'danger-toast'})
            }
            if(typeof this.results == "string"){
                M.toast({html: this.results, classes: 'danger-toast'})
            }
        }
    }
})
