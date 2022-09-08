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
          a = Object.prototype.hasOwnProperty,
          c = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
          f = {key: !0, ref: !0, __self: !0, __source: !0};

        function i(e, t, r) {
          var n, u = {}, i = null, s = null;
          for (n in void 0 !== r && (i = "" + r), void 0 !== t.key && (i = "" + t.key), void 0 !== t.ref && (s = t.ref), t) a.call(t, n) && !f.hasOwnProperty(n) && (u[n] = t[n]);
          if (e && e.defaultProps) for (n in t = e.defaultProps) void 0 === u[n] && (u[n] = t[n]);
          return {$$typeof: o, type: e, key: i, ref: s, props: u, _owner: c.current}
        }

        t.jsx = i
      }, 117: function (e, t) {
        var r = Symbol.for("react.element"), n = Symbol.for("react.portal"), o = Symbol.for("react.fragment"),
          u = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), c = Symbol.for("react.provider"),
          f = Symbol.for("react.context"), i = Symbol.for("react.forward_ref"), s = Symbol.for("react.suspense"),
          l = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), y = Symbol.iterator;
        var d = {
          isMounted: function () {
            return !1
          }, enqueueForceUpdate: function () {
          }, enqueueReplaceState: function () {
          }, enqueueSetState: function () {
          }
        }, _ = Object.assign, v = {};

        function m(e, t, r) {
          this.props = e, this.context = t, this.refs = v, this.updater = r || d
        }

        function b() {
        }

        function h(e, t, r) {
          this.props = e, this.context = t, this.refs = v, this.updater = r || d
        }

        m.prototype.isReactComponent = {}, m.prototype.setState = function (e, t) {
          if ("object" !== typeof e && "function" !== typeof e && null != e) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          this.updater.enqueueSetState(this, e, t, "setState")
        }, m.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, "forceUpdate")
        }, b.prototype = m.prototype;
        var S = h.prototype = new b;
        S.constructor = h, _(S, m.prototype), S.isPureReactComponent = !0;
        var E = Array.isArray, w = Object.prototype.hasOwnProperty, R = {current: null},
          j = {key: !0, ref: !0, __self: !0, __source: !0};

        function k(e, t, n) {
          var o, u = {}, a = null, c = null;
          if (null != t) for (o in void 0 !== t.ref && (c = t.ref), void 0 !== t.key && (a = "" + t.key), t) w.call(t, o) && !j.hasOwnProperty(o) && (u[o] = t[o]);
          var f = arguments.length - 2;
          if (1 === f) u.children = n; else if (1 < f) {
            for (var i = Array(f), s = 0; s < f; s++) i[s] = arguments[s + 2];
            u.children = i
          }
          if (e && e.defaultProps) for (o in f = e.defaultProps) void 0 === u[o] && (u[o] = f[o]);
          return {$$typeof: r, type: e, key: a, ref: c, props: u, _owner: R.current}
        }

        function $(e) {
          return "object" === typeof e && null !== e && e.$$typeof === r
        }

        var x = /\/+/g;

        function O(e, t) {
          return "object" === typeof e && null !== e && null != e.key ? function (e) {
            var t = {"=": "=0", ":": "=2"};
            return "$" + e.replace(/[=:]/g, (function (e) {
              return t[e]
            }))
          }("" + e.key) : t.toString(36)
        }

        function g(e, t, o, u, a) {
          var c = typeof e;
          "undefined" !== c && "boolean" !== c || (e = null);
          var f = !1;
          if (null === e) f = !0; else switch (c) {
            case"string":
            case"number":
              f = !0;
              break;
            case"object":
              switch (e.$$typeof) {
                case r:
                case n:
                  f = !0
              }
          }
          if (f) return a = a(f = e), e = "" === u ? "." + O(f, 0) : u, E(a) ? (o = "", null != e && (o = e.replace(x, "$&/") + "/"), g(a, t, o, "", (function (e) {
            return e
          }))) : null != a && ($(a) && (a = function (e, t) {
            return {$$typeof: r, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner}
          }(a, o + (!a.key || f && f.key === a.key ? "" : ("" + a.key).replace(x, "$&/") + "/") + e)), t.push(a)), 1;
          if (f = 0, u = "" === u ? "." : u + ":", E(e)) for (var i = 0; i < e.length; i++) {
            var s = u + O(c = e[i], i);
            f += g(c, t, o, s, a)
          } else if (s = function (e) {
            return null === e || "object" !== typeof e ? null : "function" === typeof (e = y && e[y] || e["@@iterator"]) ? e : null
          }(e), "function" === typeof s) for (e = s.call(e), i = 0; !(c = e.next()).done;) f += g(c = c.value, t, o, s = u + O(c, i++), a); else if ("object" === c) throw t = String(e), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
          return f
        }

        function C(e, t, r) {
          if (null == e) return e;
          var n = [], o = 0;
          return g(e, n, "", "", (function (e) {
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
          L = {ReactCurrentDispatcher: I, ReactCurrentBatchConfig: T, ReactCurrentOwner: R};
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
            if (!$(e)) throw Error("React.Children.only expected to receive a single React element child.");
            return e
          }
        }, t.Component = m, t.Fragment = o, t.Profiler = a, t.PureComponent = h, t.StrictMode = u, t.Suspense = s, t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = L, t.cloneElement = function (e, t, n) {
          if (null === e || void 0 === e) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
          var o = _({}, e.props), u = e.key, a = e.ref, c = e._owner;
          if (null != t) {
            if (void 0 !== t.ref && (a = t.ref, c = R.current), void 0 !== t.key && (u = "" + t.key), e.type && e.type.defaultProps) var f = e.type.defaultProps;
            for (i in t) w.call(t, i) && !j.hasOwnProperty(i) && (o[i] = void 0 === t[i] && void 0 !== f ? f[i] : t[i])
          }
          var i = arguments.length - 2;
          if (1 === i) o.children = n; else if (1 < i) {
            f = Array(i);
            for (var s = 0; s < i; s++) f[s] = arguments[s + 2];
            o.children = f
          }
          return {$$typeof: r, type: e.type, key: u, ref: a, props: o, _owner: c}
        }, t.createContext = function (e) {
          return (e = {
            $$typeof: f,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null
          }).Provider = {$$typeof: c, _context: e}, e.Consumer = e
        }, t.createElement = k, t.createFactory = function (e) {
          var t = k.bind(null, e);
          return t.type = e, t
        }, t.createRef = function () {
          return {current: null}
        }, t.forwardRef = function (e) {
          return {$$typeof: i, render: e}
        }, t.isValidElement = $, t.lazy = function (e) {
          return {$$typeof: p, _payload: {_status: -1, _result: e}, _init: P}
        }, t.memo = function (e, t) {
          return {$$typeof: l, type: e, compare: void 0 === t ? null : t}
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
    };
    var n = {};
    return function () {
      r.d(n, {
        default: function () {
          return o
        }
      });
      r(791);
      var e = r(184), t = {
        Button: function (t) {
          return (0, e.jsx)("button", {className: "btn-primary", children: t.label})
        }, Logo: function (t) {
          return (0, e.jsx)("div", {className: "logo", children: t.message})
        }
      };
      console.log("This is library");
      var o = t
    }(), n = n.default
  }()
}));
//# sourceMappingURL=goboard.js.map