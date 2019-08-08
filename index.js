var compilador = new Vue({
    el: '#app',
    data: {
        code: ''
    },
    methods: {
        run: function(){
            var _compilador = new Compilador();
            console.log(_compilador.with(this.code).get())
        }
    }
})
