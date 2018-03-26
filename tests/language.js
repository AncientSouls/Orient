"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const l = require("../lib/language");
function default_1() {
    describe('Language:', () => {
        describe('wrap', () => {
            it('first', () => {
                const q = new l.Query();
                (r => chai_1.assert.equal(r, 'first()'))(q.wrap({ type: 'first', values: [] }));
            });
        });
        it('data', () => {
            const q = new l.Query();
            chai_1.assert.equal(q.data(true), 'true');
            chai_1.assert.equal(q.data(false), 'false');
            chai_1.assert.equal(q.data(123), 123);
            chai_1.assert.equal(q.data('eval(123);'), ':param0');
        });
        it('field', () => {
            const q = new l.Query();
            chai_1.assert.equal(q.field('aB0'), `['aB0']`);
            chai_1.assert.throws(() => q.field(':'));
        });
        describe('fetch', () => {
            it('data', () => {
                const q = new l.Query();
                (r => chai_1.assert.equal(r, 'true,false,123,:param0'))(q.fetch(l.fetch('data', true, false, 123, 'eval(123);')));
            });
            it('field', () => {
                const q = new l.Query();
                (r => chai_1.assert.equal(r, `['aB0']`))(q.fetch(l.fetch('field', 'aB0')));
            });
        });
        it('projection', () => {
            const q = new l.Query();
            (r => chai_1.assert.equal(r, `@this['a']['b']['c'] as x`))(q.projection({ fetch: l.fields('a', 'b', 'c'), as: 'x' }));
        });
        it('from', () => {
            const q = new l.Query();
            chai_1.assert.equal(q.from('V'), `V`);
            chai_1.assert.equal(q.from('#1:2'), `#1:2`);
            chai_1.assert.equal(q.from(['#1:2', '#2:3']), `[#1:2,#2:3]`);
            chai_1.assert.throws(() => q.from(['#1:2', 'V']));
        });
        it('let', () => {
            const q = new l.Query();
            (r => chai_1.assert.equal(r, `$_y = (select @this['a']['b']['c'] as x from [#1:2])`))(q.let({
                y: {
                    what: [{ fetch: l.fields('a', 'b', 'c'), as: 'x' }],
                    from: ['#1:2'],
                },
            }));
        });
        it('condition', () => {
            const q = new l.Query();
            (r => chai_1.assert.equal(r, `@this['a']['b']['c'] is true`))(q.condition(l.cond('is', l.fields('a', 'b', 'c'), l.data(true))));
        });
        it('logical', () => {
            const q = new l.Query();
            (r => chai_1.assert.equal(r, `((1 > 2) and (5 < 2)) or (@this['a']['b']['c'] is true)`))(q.logical(l.logic('or', [l.cond('is', l.fields('a', 'b', 'c'), l.data(true))], [l.logic('and', [l.cond('>', l.data(1), l.data(2)), l.cond('<', l.data(5), l.data(2))])])));
        });
        it('select', () => {
            const q = new l.Query();
            (r => chai_1.assert.equal(r, `select @this['a']['b']['c'] as x from [#1:2] ` +
                `where ((1 > 2) and (5 < 2)) or (@this['a']['b']['c'] is true)`))(q.select({
                what: [{ fetch: l.fields('a', 'b', 'c'), as: 'x' }],
                from: ['#1:2'],
                where: l.logic('or', [l.cond('is', l.fields('a', 'b', 'c'), l.data(true))], [l.logic('and', [l.cond('>', l.data(1), l.data(2)), l.cond('<', l.data(5), l.data(2))])]),
            }));
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=language.js.map