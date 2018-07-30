Air.module("module.name", function () {
    var Fn = (function () {
        function Fn() {
            this.key = '';
            this.value = '123';
        }
        return Fn;
    }());
    return Fn;
});
Air.run(function (require) {
    var Fn = require('module.name');
    var fn = new Fn();
});
