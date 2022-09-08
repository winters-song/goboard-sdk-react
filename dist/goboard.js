/*! For license information please see goboard.js.LICENSE.txt */
!function (e, t) {
  if ("object" === typeof exports && "object" === typeof module) module.exports = t(); else if ("function" === typeof define && define.amd) define([], t); else {
    var r = t();
    for (var n in r) ("object" === typeof exports ? exports : e)[n] = r[n]
  }
}(self, (function () {
  return function () {
    "use strict";
    var e = {
      374: function (e, t, r) {
        var n = r(791), o = Symbol.for("react.element"), u = Symbol.for("react.fragment"),
          c = Object.prototype.hasOwnProperty,
          i = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
          a = {key: !0, ref: !0, __self: !0, __source: !0};

        function f(e, t, r) {
          var n, u = {}, f = null, l = null;
          for (n in void 0 !== r && (f = "" + r), void 0 !== t.key && (f = "" + t.key), void 0 !== t.ref && (l = t.ref), t) c.call(t, n) && !a.hasOwnProperty(n) && (u[n] = t[n]);
          if (e && e.defaultProps) for (n in t = e.defaultProps) void 0 === u[n] && (u[n] = t[n]);
          return {$$typeof: o, type: e, key: f, ref: l, props: u, _owner: i.current}
        }

        t.jsx = f
      }, 117: function (e, t) {
        var r = Symbol.for("react.element"), n = Symbol.for("react.portal"), o = Symbol.for("react.fragment"),
          u = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), i = Symbol.for("react.provider"),
          a = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"),
          s = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), y = Symbol.iterator;
        var d = {
          isMounted: function () {
            return !1
          }, enqueueForceUpdate: function () {
          }, enqueueReplaceState: function () {
          }, enqueueSetState: function () {
          }
        }, _ = Object.assign, v = {};

        function b(e, t, r) {
          this.props = e, this.context = t, this.refs = v, this.updater = r || d
        }

        function m() {
        }

        function h(e, t, r) {
          this.props = e, this.context = t, this.refs = v, this.updater = r || d
        }

        b.prototype.isReactComponent = {}, b.prototype.setState = function (e, t) {
          if ("object" !== typeof e && "function" !== typeof e && null != e) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          this.updater.enqueueSetState(this, e, t, "setState")
        }, b.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, "forceUpdate")
        }, m.prototype = b.prototype;
        var S = h.prototype = new m;
        S.constructor = h, _(S, b.prototype), S.isPureReactComponent = !0;
        var E = Array.isArray, j = Object.prototype.hasOwnProperty, w = {current: null},
          R = {key: !0, ref: !0, __self: !0, __source: !0};

        function g(e, t, n) {
          var o, u = {}, c = null, i = null;
          if (null != t) for (o in void 0 !== t.ref && (i = t.ref), void 0 !== t.key && (c = "" + t.key), t) j.call(t, o) && !R.hasOwnProperty(o) && (u[o] = t[o]);
          var a = arguments.length - 2;
          if (1 === a) u.children = n; else if (1 < a) {
            for (var f = Array(a), l = 0; l < a; l++) f[l] = arguments[l + 2];
            u.children = f
          }
          if (e && e.defaultProps) for (o in a = e.defaultProps) void 0 === u[o] && (u[o] = a[o]);
          return {$$typeof: r, type: e, key: c, ref: i, props: u, _owner: w.current}
        }

        function O(e) {
          return "object" === typeof e && null !== e && e.$$typeof === r
        }

        var k = /\/+/g;

        function $(e, t) {
          return "object" === typeof e && null !== e && null != e.key ? function (e) {
            var t = {"=": "=0", ":": "=2"};
            return "$" + e.replace(/[=:]/g, (function (e) {
              return t[e]
            }))
          }("" + e.key) : t.toString(36)
        }

        function x(e, t, o, u, c) {
          var i = typeof e;
          "undefined" !== i && "boolean" !== i || (e = null);
          var a = !1;
          if (null === e) a = !0; else switch (i) {
            case"string":
            case"number":
              a = !0;
              break;
            case"object":
              switch (e.$$typeof) {
                case r:
                case n:
                  a = !0
              }
          }
          if (a) return c = c(a = e), e = "" === u ? "." + $(a, 0) : u, E(c) ? (o = "", null != e && (o = e.replace(k, "$&/") + "/"), x(c, t, o, "", (function (e) {
            return e
          }))) : null != c && (O(c) && (c = function (e, t) {
            return {$$typeof: r, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner}
          }(c, o + (!c.key || a && a.key === c.key ? "" : ("" + c.key).replace(k, "$&/") + "/") + e)), t.push(c)), 1;
          if (a = 0, u = "" === u ? "." : u + ":", E(e)) for (var f = 0; f < e.length; f++) {
            var l = u + $(i = e[f], f);
            a += x(i, t, o, l, c)
          } else if (l = function (e) {
            return null === e || "object" !== typeof e ? null : "function" === typeof (e = y && e[y] || e["@@iterator"]) ? e : null
          }(e), "function" === typeof l) for (e = l.call(e), f = 0; !(i = e.next()).done;) a += x(i = i.value, t, o, l = u + $(i, f++), c); else if ("object" === i) throw t = String(e), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
          return a
        }

        function C(e, t, r) {
          if (null == e) return e;
          var n = [], o = 0;
          return x(e, n, "", "", (function (e) {
            return t.call(r, e, o++)
          })), n
        }

        function P(e) {
          if (-1 === e._status) {
            var t = e._result;
            (t = t()).then((function (t) {
              0 !== e._status && -1 !== e._status || (e._status = 1, e._result = t)
            }), (function (t) {
              0 !== e._status && -1 !== e._status || (e._status = 2, e._result = t)
            })), -1 === e._status && (e._status = 0, e._result = t)
          }
          if (1 === e._status) return e._result.default;
          throw e._result
        }

        var I = {current: null}, T = {transition: null},
          L = {ReactCurrentDispatcher: I, ReactCurrentBatchConfig: T, ReactCurrentOwner: w};
        t.Children = {
          map: C, forEach: function (e, t, r) {
            C(e, (function () {
              t.apply(this, arguments)
            }), r)
          }, count: function (e) {
            var t = 0;
            return C(e, (function () {
              t++
            })), t
          }, toArray: function (e) {
            return C(e, (function (e) {
              return e
            })) || []
          }, only: function (e) {
            if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
            return e
          }
        }, t.Component = b, t.Fragment = o, t.Profiler = c, t.PureComponent = h, t.StrictMode = u, t.Suspense = l, t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = L, t.cloneElement = function (e, t, n) {
          if (null === e || void 0 === e) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
          var o = _({}, e.props), u = e.key, c = e.ref, i = e._owner;
          if (null != t) {
            if (void 0 !== t.ref && (c = t.ref, i = w.current), void 0 !== t.key && (u = "" + t.key), e.type && e.type.defaultProps) var a = e.type.defaultProps;
            for (f in t) j.call(t, f) && !R.hasOwnProperty(f) && (o[f] = void 0 === t[f] && void 0 !== a ? a[f] : t[f])
          }
          var f = arguments.length - 2;
          if (1 === f) o.children = n; else if (1 < f) {
            a = Array(f);
            for (var l = 0; l < f; l++) a[l] = arguments[l + 2];
            o.children = a
          }
          return {$$typeof: r, type: e.type, key: u, ref: c, props: o, _owner: i}
        }, t.createContext = function (e) {
          return (e = {
            $$typeof: a,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null
          }).Provider = {$$typeof: i, _context: e}, e.Consumer = e
        }, t.createElement = g, t.createFactory = function (e) {
          var t = g.bind(null, e);
          return t.type = e, t
        }, t.createRef = function () {
          return {current: null}
        }, t.forwardRef = function (e) {
          return {$$typeof: f, render: e}
        }, t.isValidElement = O, t.lazy = function (e) {
          return {$$typeof: p, _payload: {_status: -1, _result: e}, _init: P}
        }, t.memo = function (e, t) {
          return {$$typeof: s, type: e, compare: void 0 === t ? null : t}
        }, t.startTransition = function (e) {
          var t = T.transition;
          T.transition = {};
          try {
            e()
          } finally {
            T.transition = t
          }
        }, t.unstable_act = function () {
          throw Error("act(...) is not supported in production builds of React.")
        }, t.useCallback = function (e, t) {
          return I.current.useCallback(e, t)
        }, t.useContext = function (e) {
          return I.current.useContext(e)
        }, t.useDebugValue = function () {
        }, t.useDeferredValue = function (e) {
          return I.current.useDeferredValue(e)
        }, t.useEffect = function (e, t) {
          return I.current.useEffect(e, t)
        }, t.useId = function () {
          return I.current.useId()
        }, t.useImperativeHandle = function (e, t, r) {
          return I.current.useImperativeHandle(e, t, r)
        }, t.useInsertionEffect = function (e, t) {
          return I.current.useInsertionEffect(e, t)
        }, t.useLayoutEffect = function (e, t) {
          return I.current.useLayoutEffect(e, t)
        }, t.useMemo = function (e, t) {
          return I.current.useMemo(e, t)
        }, t.useReducer = function (e, t, r) {
          return I.current.useReducer(e, t, r)
        }, t.useRef = function (e) {
          return I.current.useRef(e)
        }, t.useState = function (e) {
          return I.current.useState(e)
        }, t.useSyncExternalStore = function (e, t, r) {
          return I.current.useSyncExternalStore(e, t, r)
        }, t.useTransition = function () {
          return I.current.useTransition()
        }, t.version = "18.2.0"
      }, 791: function (e, t, r) {
        e.exports = r(117)
      }, 184: function (e, t, r) {
        e.exports = r(374)
      }
    }, t = {};

    function r(n) {
      var o = t[n];
      if (void 0 !== o) return o.exports;
      var u = t[n] = {exports: {}};
      return e[n](u, u.exports, r), u.exports
    }

    r.d = function (e, t) {
      for (var n in t) r.o(t, n) && !r.o(e, n) && Object.defineProperty(e, n, {enumerable: !0, get: t[n]})
    }, r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
    }, r.r = function (e) {
      "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    };
    var n = {};
    return function () {
      r.r(n), r.d(n, {
        Button: function () {
          return t
        }, Logo: function () {
          return o
        }
      });
      r(791);
      var e = r(184), t = function (t) {
        return (0, e.jsx)("button", {className: "btn-primary", children: t.label})
      }, o = function (t) {
        return (0, e.jsx)("div", {className: "logo", children: t.message})
      };
      console.log("This is library")
    }(), n
  }()
}));
//# sourceMappingURL=goboard.js.map