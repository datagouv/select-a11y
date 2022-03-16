// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"kTFV3":[function(require,module,exports) {
"use strict";
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "3a5f661842aa33bd";
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = it.call(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                var oldDeps = modules[asset.id][1];
                for(var dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    var id = oldDeps[dep];
                    var parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    var modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        var deps = modules[id1][1];
        var orphans = [];
        for(var dep in deps){
            var parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach(function(id) {
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    var parents = getParents(module.bundle.root, id);
    var accepted = false;
    while(parents.length > 0){
        var v = parents.shift();
        var a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            var p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push.apply(parents, _toConsumableArray(p));
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"77not":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const text = {
    help: 'Utilisez la tabulation (ou les touches flèches) pour naviguer dans la liste des suggestions',
    placeholder: 'Rechercher dans la liste',
    noResult: 'Aucun résultat',
    results: '{x} suggestion(s) disponibles',
    deleteItem: 'Supprimer {t}',
    delete: 'Supprimer'
};
const matches = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
let closest = Element.prototype.closest;
if (!closest) closest = function(s) {
    var el = this;
    do {
        if (matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
    }while (el !== null && el.nodeType === 1)
    return null;
};
class Select {
    constructor(el, options){
        this.el = el;
        this.label = document.querySelector(`label[for=${el.id}]`);
        this.id = el.id;
        this.open = false;
        this.multiple = this.el.multiple;
        this.search = '';
        this.suggestions = [];
        this.focusIndex = null;
        const passedOptions = Object.assign({
        }, options);
        const textOptions = Object.assign(text, passedOptions.text);
        delete passedOptions.text;
        this._options = Object.assign({
            text: textOptions,
            showSelected: true
        }, passedOptions);
        this._handleFocus = this._handleFocus.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleKeyboard = this._handleKeyboard.bind(this);
        this._handleOpener = this._handleOpener.bind(this);
        this._handleReset = this._handleReset.bind(this);
        this._handleSuggestionClick = this._handleSuggestionClick.bind(this);
        this._positionCursor = this._positionCursor.bind(this);
        this._removeOption = this._removeOption.bind(this);
        this._disable();
        this.button = this._createButton();
        this.liveZone = this._createLiveZone();
        this.overlay = this._createOverlay();
        this.wrap = this._wrap();
        if (this.multiple && this._options.showSelected) {
            this.selectedList = this._createSelectedList();
            this._updateSelectedList();
            this.selectedList.addEventListener('click', this._removeOption);
        }
        this.button.addEventListener('click', this._handleOpener);
        this.input.addEventListener('input', this._handleInput);
        this.input.addEventListener('focus', this._positionCursor, true);
        this.list.addEventListener('click', this._handleSuggestionClick);
        this.wrap.addEventListener('keydown', this._handleKeyboard);
        document.addEventListener('blur', this._handleFocus, true);
        this.el.form.addEventListener('reset', this._handleReset);
    }
    _createButton() {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('aria-expanded', this.open);
        button.className = 'btn btn-select-a11y';
        const text1 = document.createElement('span');
        if (this.multiple) text1.innerText = this.label.innerText;
        else {
            const selectedOption = this.el.item(this.el.selectedIndex);
            text1.innerText = selectedOption.label || selectedOption.value;
            if (!this.label.id) this.label.id = `${this.el.id}-label`;
            button.setAttribute('id', this.el.id + '-button');
            button.setAttribute('aria-labelledby', this.label.id + ' ' + button.id);
        }
        button.appendChild(text1);
        button.insertAdjacentHTML('beforeend', '<span class="icon-select" aria-hidden="true"></span>');
        return button;
    }
    _createLiveZone() {
        const live = document.createElement('p');
        live.setAttribute('aria-live', 'polite');
        live.classList.add('sr-only');
        return live;
    }
    _createOverlay() {
        const container = document.createElement('div');
        container.classList.add('a11y-container');
        const suggestions = document.createElement('div');
        suggestions.classList.add('a11y-suggestions');
        suggestions.id = `a11y-${this.id}-suggestions`;
        container.innerHTML = `
      <p id="a11y-usage-${this.id}-js" class="sr-only">${this._options.text.help}</p>
      <label for="a11y-${this.id}-js" class="sr-only">${this._options.text.placeholder}</label>
      <input type="text" id="a11y-${this.id}-js" class="${this.el.className}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${this._options.text.placeholder}" aria-describedby="a11y-usage-${this.id}-js">
    `;
        container.appendChild(suggestions);
        this.list = suggestions;
        this.input = container.querySelector('input');
        return container;
    }
    _createSelectedList() {
        const list = document.createElement('ul');
        list.className = 'list-inline list-selected';
        return list;
    }
    _disable() {
        this.el.setAttribute('tabindex', -1);
    }
    _fillSuggestions() {
        const search = this.search.toLowerCase();
        // loop over the
        this.suggestions = Array.prototype.map.call(this.el.options, (function(option, index) {
            const text2 = option.label || option.value;
            const formatedText = text2.toLowerCase();
            // test if search text match the current option
            if (formatedText.indexOf(search) === -1) return;
            // create the option
            const suggestion = document.createElement('div');
            suggestion.setAttribute('role', 'option');
            suggestion.setAttribute('tabindex', 0);
            suggestion.setAttribute('data-index', index);
            suggestion.classList.add('a11y-suggestion');
            // check if the option is selected
            if (option.selected) suggestion.setAttribute('aria-selected', 'true');
            suggestion.innerText = option.label || option.value;
            return suggestion;
        }).bind(this)).filter(Boolean);
        if (!this.suggestions.length) this.list.innerHTML = `<p class="a11y-no-suggestion">${this._options.text.noResult}</p>`;
        else {
            const listBox = document.createElement('div');
            listBox.setAttribute('role', 'listbox');
            if (this.multiple) listBox.setAttribute('aria-multiselectable', 'true');
            this.suggestions.forEach((function(suggestion) {
                listBox.appendChild(suggestion);
            }).bind(this));
            this.list.innerHTML = '';
            this.list.appendChild(listBox);
        }
        this._setLiveZone();
    }
    _handleOpener(event) {
        this._toggleOverlay();
    }
    _handleFocus() {
        if (!this.open) return;
        clearTimeout(this._focusTimeout);
        this._focusTimeout = setTimeout((function() {
            if (!this.overlay.contains(document.activeElement) && this.button !== document.activeElement) this._toggleOverlay(false, document.activeElement === document.body);
            else if (document.activeElement === this.input) // reset the focus index
            this.focusIndex = null;
            else {
                const optionIndex = this.suggestions.indexOf(document.activeElement);
                if (optionIndex !== -1) this.focusIndex = optionIndex;
            }
        }).bind(this), 10);
    }
    _handleReset() {
        clearTimeout(this._resetTimeout);
        this._resetTimeout = setTimeout((function() {
            this._fillSuggestions();
            if (this.multiple && this._options.showSelected) this._updateSelectedList();
            else if (!this.multiple) {
                const option = this.el.item(this.el.selectedIndex);
                this._setButtonText(option.label || option.value);
            }
        }).bind(this), 10);
    }
    _handleSuggestionClick(event) {
        const option = closest.call(event.target, '[role="option"]');
        if (!option) return;
        const optionIndex = parseInt(option.getAttribute('data-index'), 10);
        const shouldClose = this.multiple && event.metaKey ? false : true;
        this._toggleSelection(optionIndex, shouldClose);
    }
    _handleInput() {
        // prevent event fireing on focus and blur
        if (this.search === this.input.value) return;
        this.search = this.input.value;
        this._fillSuggestions();
    }
    _handleKeyboard(event) {
        const option = closest.call(event.target, '[role="option"]');
        const input = closest.call(event.target, 'input');
        if (event.keyCode === 27) {
            this._toggleOverlay();
            return;
        }
        if (input && event.keyCode === 13) {
            event.preventDefault();
            return;
        }
        if (event.keyCode === 40) {
            event.preventDefault();
            this._moveIndex(1);
            return;
        }
        if (!option) return;
        if (event.keyCode === 39) {
            event.preventDefault();
            this._moveIndex(1);
            return;
        }
        if (event.keyCode === 37 || event.keyCode === 38) {
            event.preventDefault();
            this._moveIndex(-1);
            return;
        }
        if (!this.multiple && event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            this._toggleSelection(parseInt(option.getAttribute('data-index'), 10), this.multiple ? false : true);
        }
        if (this.multiple && event.keyCode === 13) this._toggleOverlay();
    }
    _moveIndex(step) {
        if (this.focusIndex === null) this.focusIndex = 0;
        else {
            const nextIndex = this.focusIndex + step;
            const selectionItems = this.suggestions.length - 1;
            if (nextIndex > selectionItems) this.focusIndex = 0;
            else if (nextIndex < 0) this.focusIndex = selectionItems;
            else this.focusIndex = nextIndex;
        }
        this.suggestions[this.focusIndex].focus();
    }
    _positionCursor() {
        setTimeout((function() {
            this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
        }).bind(this));
    }
    _removeOption(event) {
        const button = closest.call(event.target, 'button');
        if (!button) return;
        const currentButtons = this.selectedList.querySelectorAll('button');
        const buttonPreviousIndex = Array.prototype.indexOf.call(currentButtons, button) - 1;
        const optionIndex = parseInt(button.getAttribute('data-index'), 10);
        // disable the option
        this._toggleSelection(optionIndex);
        // manage the focus if there's still the selected list
        if (this.selectedList.parentElement) {
            const buttons = this.selectedList.querySelectorAll('button');
            // loock for the bouton before the one clicked
            if (buttons[buttonPreviousIndex]) buttons[buttonPreviousIndex].focus();
            else buttons[0].focus();
        } else this.button.focus();
    }
    _setButtonText(text3) {
        this.button.firstElementChild.innerText = text3;
    }
    _setLiveZone() {
        const suggestions = this.suggestions.length;
        let text4 = '';
        if (this.open) {
            if (!suggestions) text4 = this._options.text.noResult;
            else text4 = this._options.text.results.replace('{x}', suggestions);
        }
        this.liveZone.innerText = text4;
    }
    _toggleOverlay(state, focusBack) {
        this.open = state !== undefined ? state : !this.open;
        this.button.setAttribute('aria-expanded', this.open);
        if (this.open) {
            this._fillSuggestions();
            this.button.insertAdjacentElement('afterend', this.overlay);
            this.input.focus();
        } else if (this.wrap.contains(this.overlay)) {
            this.wrap.removeChild(this.overlay);
            // reset the focus index
            this.focusIndex = null;
            // reset search values
            this.input.value = '';
            this.search = '';
            // reset aria-live
            this._setLiveZone();
            if (state === undefined || focusBack) // fix bug that will trigger a click on the button when focusing directly
            setTimeout((function() {
                this.button.focus();
            }).bind(this));
        }
    }
    _toggleSelection(optionIndex, close = true) {
        const option = this.el.item(optionIndex);
        if (this.multiple) this.el.item(optionIndex).selected = !this.el.item(optionIndex).selected;
        else this.el.selectedIndex = optionIndex;
        this.suggestions.forEach((function(suggestion) {
            const index = parseInt(suggestion.getAttribute('data-index'), 10);
            if (this.el.item(index).selected) suggestion.setAttribute('aria-selected', 'true');
            else suggestion.removeAttribute('aria-selected');
        }).bind(this));
        if (!this.multiple) this._setButtonText(option.label || option.value);
        else if (this._options.showSelected) this._updateSelectedList();
        if (close && this.open) this._toggleOverlay();
    }
    _updateSelectedList() {
        const items = Array.prototype.map.call(this.el.options, (function(option, index) {
            if (!option.selected) return;
            const text5 = option.label || option.value;
            return `
        <li class="tag-item">
          <span>${text5}</span>
          <button class="tag-item-supp" title="${this._options.text.deleteItem.replace('{t}', text5)}" type="button" data-index="${index}">
            <span class="sr-only">${this._options.text.delete}</span>
            <span class="icon-delete" aria-hidden="true"></span>
          </button>
        </li>`;
        }).bind(this)).filter(Boolean);
        this.selectedList.innerHTML = items.join('');
        if (items.length) {
            if (!this.selectedList.parentElement) this.wrap.appendChild(this.selectedList);
        } else if (this.selectedList.parentElement) this.wrap.removeChild(this.selectedList);
    }
    _wrap() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('select-a11y');
        this.el.parentElement.appendChild(wrapper);
        const tagHidden = document.createElement('div');
        tagHidden.classList.add('tag-hidden');
        tagHidden.setAttribute('aria-hidden', true);
        if (this.multiple) tagHidden.appendChild(this.label);
        tagHidden.appendChild(this.el);
        wrapper.appendChild(tagHidden);
        wrapper.appendChild(this.liveZone);
        wrapper.appendChild(this.button);
        return wrapper;
    }
}
exports.default = Select;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["kTFV3","77not"], "77not", "parcelRequire303f")

//# sourceMappingURL=nomodule.js.map
