Air.Module('B.scope.scopeManager', function (require) {
    var rootScope = {};
    var ScopeTreeManager = require('B.scope.ScopeTreeManager');
    var initModel = require('B.directive.model');
    var eventDirective = require('B.directive.event');
    var showDirective = require('B.directive.show');
    var existDirective = require('B.directive.exist');
    var styleDirective = require('B.directive.style');
    var propertyDirective = require('B.directive.property');
    var Repeater = require('B.directive.Repeater');
    var tagManager = require('B.scope.tagManager');
    var util = require('B.util.util');
    var nodeUtil = require('B.util.node');
    var memCache = require('B.data.memCache');
    var scopeTreeManager = new ScopeTreeManager();
    function isView(node) {
        var isHTMLElement = util.isHTML(node);
        return isHTMLElement && (node.nodeName.toUpperCase() == 'VIEW');
    }
    function isRepeat(node) {
        var isHTMLElement = util.isHTML(node);
        return isHTMLElement && (node.hasAttribute('b-repeat'));
    }
    var backtrackingPoints = [];
    function bindObjectData(dataPath, currentScopeIndex, callback) {
        var scopeStructure = scopeTreeManager.getScope(currentScopeIndex) || scopeTreeManager.getRoot();
        var scope = scopeStructure.scope;
        var activePath = '';
        var pathNodes = dataPath.split('.') || [];
        for (var i = 0; i < pathNodes.length; i++) {
            var nextPathNode = pathNodes[i];
            var activeObj = activePath ? util.getData(activePath, scope) : scope;
            activeObj = activeObj || Air.NS(activePath, scope);
            var nextObj = nextPathNode && util.getData(nextPathNode, activeObj);
            nextPathNode && (!(Object.getOwnPropertyDescriptor(activeObj, nextPathNode) && Object.getOwnPropertyDescriptor(activeObj, nextPathNode).set) || /^\d+$/.test(nextPathNode) || (i === pathNodes.length - 1)) &&
                Object.defineProperty(activeObj, nextPathNode, createDescriptor.call(activeObj, nextObj, dataPath, currentScopeIndex, callback));
            activePath = nextPathNode && activePath ? (activePath + '.' + nextPathNode) : nextPathNode;
        }
    }
    function getTokens(tag, node, scopeIndex) {
        node.$template = node.$template || node.nodeValue;
        var scope = scopeTreeManager.getScope(scopeIndex);
        var tokens = tag.match(/(['"])\s*([$a-zA-Z\._0-9\s\-]+)\s*\1|(['"])?\s*([$a-zA-Z\._0-9\s]+)\s*\1?/g) || [];
        var result = [];
        var _loop_1 = function (i) {
            var token = util.trim(tokens[i]);
            if (!(/^\d+$/.test(token) || /^['"]/.test(token) || token == '' || token === 'true' || token === 'false')) {
                var tokenReg = new RegExp('(^|\\b).*?(' + token.replace(/([.*?+\-^\/$])/g, '\\$1') + ')', 'g');
                var lastTagStr = (node.$tag || tag);
                var tagStr = lastTagStr.replace(tokenReg, function ($0, $1, $2) {
                    if ($0.indexOf('util.getData("' + token) >= 0) {
                        return $0;
                    }
                    else {
                        return $0.replace($2, 'util.getData("' + token + '", scope)');
                    }
                });
                node.$template = node.$template.replace(lastTagStr, tagStr);
                node.$tag = tagStr;
                result.push(token);
            }
        };
        for (var i = 0; i < tokens.length; i++) {
            _loop_1(i);
        }
        if (result.length === 0) {
            node.$tag = tag;
        }
        return result;
    }
    function tryGenerateSubViewScope(node, scopeStructure) {
        if (node.tagName.toLowerCase() === 'view') {
            var scopeKey = node.getAttribute('b-scope-key');
            var viewName_1 = node.getAttribute('name');
            var subScopeName = scopeKey || viewName_1;
            var subScope = scopeStructure.scope;
            var currentScopeName = scopeStructure.name;
            if (!subScope) {
                var subScopeIndex = scopeTreeManager.addScope(currentScopeName, subScopeName);
                subScope = scopeTreeManager.getScope(subScopeIndex);
            }
            if (scopeKey) {
                var controllerMap = memCache.get('controllerMap') || {};
                var controller_1 = controllerMap[viewName_1];
                if (controller_1) {
                    setTimeout(function () {
                        b.run(viewName_1, controller_1);
                    }, 0);
                }
            }
        }
        return scopeStructure;
    }
    function createDescriptor(value, dataPath, scopeIndex, callBack) {
        var scope = scopeTreeManager.getScope(scopeIndex);
        var oldLength = 0;
        var descriptor = {
            enumerable: true,
            configurable: true,
            get: function () {
                var isArray = beacon.utility.isType(value, 'Array');
                if (isArray) {
                    setTimeout(function () {
                        if (oldLength !== value.length) {
                            callBack && callBack();
                        }
                        oldLength = value.length;
                    }, 0);
                }
                return value;
            },
            set: function (val) {
                var hasChanged = value !== val;
                var isArray = beacon.utility.isType(val, 'Array');
                var isObject = beacon.utility.isType(val, 'Object');
                var isPathNode = isArray || isObject;
                if (hasChanged && isPathNode) {
                    value = value || (isArray ? [] : {});
                    if (isArray) {
                        var oldLen = value.length;
                        var newLen = val.length;
                        if (newLen < oldLen) {
                            value.splice(newLen - oldLen, oldLen - newLen);
                        }
                    }
                    if (isObject) {
                        for (var aa in value) {
                            if (!(aa in val)) {
                                val[aa] = undefined;
                            }
                        }
                    }
                    beacon.utility.merge(value, val);
                    isArray && callBack && callBack();
                }
                else {
                    if (value !== val) {
                        value = val;
                        tagManager.updateNodeValue(scopeIndex, scope.scope, dataPath);
                    }
                }
            }
        };
        return descriptor;
    }
    beacon.on('updateObjectData', function (e, args) {
        bindObjectData(args.dataPath, args.currentScopeIndex);
    });
    var ScopeManager = (function () {
        function ScopeManager() {
            this.getScope = function (scopeName) {
                return scopeTreeManager.getScopeByName(scopeName);
            };
            this.setRoot = function (scope) {
                return scopeTreeManager.setRootScope(scope);
            };
            this.getScopeInstance = function (scopeName) {
                return scopeTreeManager.getScopeInstanceByName(scopeName);
            };
        }
        ScopeManager.prototype.parseScope = function (viewName, viewElement, needScope) {
            var scopeStructure = scopeTreeManager.getScopeByName(viewName);
            if (!scopeStructure) {
                this.parseTemplate(viewElement, viewName);
                scopeStructure = scopeTreeManager.getScopeByName(viewName) || {};
            }
            return scopeStructure.scope;
        };
        ScopeManager.prototype.watchData = function (tag, node, scopeIndex, callback, callbackNow) {
            var scope = scopeTreeManager.getScope(scopeIndex);
            var tokens = getTokens(tag, node, scopeIndex);
            for (var i = 0; i < tokens.length; i++) {
                var activeToken = tokens[i];
                callback && callbackNow && callback(util.getData(activeToken, scope.scope));
                tagManager.addNode(scopeIndex, activeToken, node, callback);
                bindObjectData(activeToken, scopeIndex, callback);
            }
        };
        ScopeManager.prototype.parseTEXT = function (node, currentScopeIndex) {
            var tags = node.nodeValue.match(/{{.*?}}/g) || [];
            var scopeStructure = scopeTreeManager.getScope(currentScopeIndex) || scopeTreeManager.getRoot();
            var scope = scopeStructure.scope;
            for (var i = 0; i < tags.length; i++) {
                var activeTag = tags[i];
                this.watchData(activeTag, node, currentScopeIndex);
                if (node.$tag) {
                    var val = eval(node.$tag.replace(/(^{{)|(}}$)/g, '')) || '';
                    node.nodeValue = node.nodeValue.replace(activeTag, val);
                    node.$tag = '';
                }
            }
        };
        ScopeManager.prototype.parseHTML = function (node, currentScopeName) {
            var scopeStructure = scopeTreeManager.getScope(currentScopeName) || scopeTreeManager.getRoot();
            ;
            tryGenerateSubViewScope(node, scopeStructure);
            var scope = scopeStructure.scope;
            existDirective(node, scopeStructure, this.watchData);
            if (!node.parentElement) {
                return;
            }
            initModel(node, scopeStructure, this.watchData);
            eventDirective(node, scope);
            showDirective(node, scopeStructure, this.watchData);
            styleDirective(node, scopeStructure, this.watchData);
            propertyDirective(node, scopeStructure, this.watchData);
            var attributes = [].concat.apply([], node.attributes);
            for (var i = 0; i < attributes.length; i++) {
                var activeAttribute = attributes[i];
                if ([initModel.key, showDirective.key].indexOf(activeAttribute.name) !== -1) {
                    continue;
                }
                this.parseTEXT(activeAttribute, currentScopeName);
            }
        };
        ScopeManager.prototype.parseViewElement = function (view) {
            return view.lastChild;
        };
        ScopeManager.prototype.parseTemplate = function (rootElement, currentScopeName) {
            if (currentScopeName === void 0) { currentScopeName = 'root'; }
            var other = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                other[_i - 2] = arguments[_i];
            }
            var nodeIterator = document.createNodeIterator(rootElement, NodeFilter.SHOW_ALL);
            var scopeList = [];
            var lastViewEndElement = [];
            var currentNode = rootElement;
            do {
                if (isView(currentNode)) {
                    scopeList.push(currentScopeName);
                    var lastChildElement = currentNode.lastChild;
                    lastChildElement && lastViewEndElement.push(lastChildElement);
                    currentScopeName = currentNode.getAttribute('b-scope-key') || currentNode.getAttribute('name');
                    var parentScopName = scopeList[scopeList.length - 2];
                    scopeTreeManager.addScope(parentScopName, currentScopeName);
                }
                else if (isRepeat(currentNode)) {
                    var repeatNode = this.createRepeatNodes(currentNode, currentScopeName);
                    var nextSibling = currentNode.nextSibling;
                    continue;
                }
                switch (currentNode.nodeType) {
                    case nodeUtil.type.HTML:
                        this.parseHTML(currentNode, currentScopeName);
                        break;
                    case nodeUtil.type.TEXT:
                    case nodeUtil.type.ATTR:
                        this.parseTEXT(currentNode, currentScopeName);
                        break;
                    default:
                }
                if (lastViewEndElement[lastViewEndElement.length - 1] === currentNode) {
                    lastViewEndElement.pop();
                    currentScopeName = scopeList.pop();
                }
            } while (currentNode = nodeIterator.nextNode());
        };
        ScopeManager.prototype.parseTemplateBAK = function (node, scopeName, currentScopeIndex, isSub, needScope) {
            var _this = this;
            if (!node) {
                return;
            }
            if (!isSub) {
                backtrackingPoints = [];
            }
            currentScopeIndex = currentScopeIndex || 0;
            var goOn = function (nextNode, scopeName) {
                var targetScopeIndex;
                if (!nextNode && isSub) {
                    var lastNode = backtrackingPoints.pop();
                    nextNode = lastNode && lastNode.nextSibling;
                    targetScopeIndex = isView(lastNode) ? scopeTreeManager.getScope(currentScopeIndex).pn : currentScopeIndex;
                    scopeName = isView(lastNode) && targetScopeIndex;
                }
                return _this.parseTemplate(nextNode, scopeName, targetScopeIndex || currentScopeIndex, true);
            };
            if (isView(node) || needScope) {
                scopeName = node.getAttribute('b-scope-key') || node.getAttribute('name');
                currentScopeIndex = scopeTreeManager.addScope(currentScopeIndex, scopeName);
            }
            else if (isRepeat(node)) {
                var nextNode_1 = isSub && node.nextSibling;
                var repeatNode = this.createRepeatNodes(node, currentScopeIndex);
                if (!repeatNode) {
                    return goOn(nextNode_1, scopeName);
                }
                else {
                    node = repeatNode;
                }
            }
            if (isSub && node.nextSibling && node.firstChild) {
                backtrackingPoints.push(node);
            }
            ;
            var nextSibling = node.nextSibling;
            switch (node.nodeType) {
                case nodeUtil.type.HTML:
                    this.parseHTML(node, currentScopeIndex);
                    break;
                case nodeUtil.type.TEXT:
                case nodeUtil.type.ATTR:
                    this.parseTEXT(node, currentScopeIndex);
                    break;
                default:
            }
            var nextNode;
            if (!node.parentElement) {
                if (isSub && node.firstChild) {
                    backtrackingPoints.pop();
                }
                nextNode = (isSub && nextSibling);
            }
            else {
                nextNode = node.firstChild || (isSub && nextSibling);
            }
            return goOn(nextNode, scopeName);
        };
        ScopeManager.prototype.createRepeatNodes = function (template, currentScopeIndex) {
            var _this = this;
            var scopeStructure = scopeTreeManager.getScope(currentScopeIndex);
            var parseTemplateProxy = function (node, scopeName, currentScopeIndex, isSub, needScope) {
                _this.parseTemplate(node, scopeName, currentScopeIndex, isSub, needScope);
            };
            var repeater = new Repeater(template, currentScopeIndex, scopeStructure, parseTemplateProxy);
            var newFirstNode = repeater.updateUI()[0];
            return newFirstNode;
        };
        return ScopeManager;
    }());
    return new ScopeManager();
});
