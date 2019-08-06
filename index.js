var compilador = new Vue({
    el: '#app',
    data: {
        code: ''
    },
    methods: {
        run: function(){
            var analizadorLexico = new AnalizadorLexico(this.code)
            console.log(analizadorLexico.analyze())
        }
    }
})

var __throw = function(_){
    console.log(_)
}
