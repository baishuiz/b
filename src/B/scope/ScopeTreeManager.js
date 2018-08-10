Air.Module('B.scope.ScopeTreeManager', function (require) {
    var Scope = require('B.scope.Scope');
    var ScopeTreeManager = (function () {
        function ScopeTreeManager(rootScope) {
            if (rootScope === void 0) { rootScope = {}; }
            this.scopeMap = {};
            var scopeStructure = ScopeTreeManager.getStructure();
            scopeStructure.scope = rootScope;
            this.rootScope = scopeStructure;
        }
        ScopeTreeManager.getStructure = function () {
            return {
                scope: null,
                pn: null,
                name: null
            };
        };
        ;
        ScopeTreeManager.prototype.getScope = function (scopeName) {
            return this.getScopeByName(scopeName);
        };
        ScopeTreeManager.prototype.getRoot = function () {
            return this.rootScope;
        };
        ScopeTreeManager.prototype.setRootScope = function (scope) {
            this.rootScope.scope = scope;
        };
        ScopeTreeManager.prototype.addScope = function (parentName, scopeName) {
            var parentScopeStructure = this.getScope(parentName) || this.rootScope;
            var newScope = ScopeTreeManager.getStructure();
            this.scopeMap[scopeName] = newScope;
            newScope.scope = new Scope(parentScopeStructure.scope);
            newScope.pn = parentName;
            newScope.name = scopeName;
            return scopeName;
        };
        ScopeTreeManager.prototype.getScopeByName = function (scopeName) {
            return this.scopeMap[scopeName];
        };
        ScopeTreeManager.prototype.getScopeInstanceByName = function (scopeName) {
            var scopeStructure = this.getScope(scopeName) || {};
            return scopeStructure.scope;
        };
        return ScopeTreeManager;
    }());
    return ScopeTreeManager;
});
