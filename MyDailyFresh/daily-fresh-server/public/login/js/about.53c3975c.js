(window.webpackJsonp = window.webpackJsonp || []).push([['about'], {
  f820(t, n, a) {
    a.r(n); const e = function () { const t = this; const n = t.$createElement; const a = t._self._c || n; return a('div', { staticClass: 'about' }, [a('div', { domProps: { innerHTML: t._s(t.dom) } })]); }; const o = []; const u = a('bc3a'); const l = a.n(u); const c = { name: 'About', data() { return { dom: null }; }, created() { const t = this; l.a.get('http://localhost:3333/vue-mall-readme').then(((n) => { t.dom = n.data; })); } }; const r = c; const s = a('2877'); const i = Object(s.a)(r, e, o, !1, null, null, null); n.default = i.exports;
  },
}]);
// # sourceMappingURL=about.53c3975c.js.map
