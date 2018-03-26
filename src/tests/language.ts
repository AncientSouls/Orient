import { assert } from 'chai';
import * as _ from 'lodash';

import { ValidatableQuery } from '../lib/validatable';
import * as l from '../lib/language';

export default function () {
  describe('Language:', () => {
    describe('wrap', () => {
      it('first', () => {
        const q = new ValidatableQuery();
        (r => assert.equal(r, 'first()'))
        (q.wrap({ type: 'first', values: [] }));
      });
    });
    it('data', () => {
      const q = new ValidatableQuery();
      assert.equal(q.data(true), 'true');
      assert.equal(q.data(false), 'false');
      assert.equal(q.data(123), 123);
      assert.equal(q.data('eval(123);'), ':param0');
    });
    it('field', () => {
      const q = new ValidatableQuery();
      assert.equal(q.field('aB0'), `['aB0']`);
      assert.equal(q.field('@rid'), `.@rid`);
      assert.throws(() => q.field(':'));
    });
    describe('fetch', () => {
      it('data', () => {
        const q = new ValidatableQuery();
        (r => assert.equal(r, 'true,false,123,:param0'))
        (q.fetch(l.fetch('data', true, false, 123, 'eval(123);')));
      });
      it('field', () => {
        const q = new ValidatableQuery();
        (r => assert.equal(r, `['aB0']`))
        (q.fetch(l.fetch('field', 'aB0')));
      });
    });
    it('projection', () => {
      const q = new ValidatableQuery();
      (r => assert.equal(r, `@this['a']['b']['c'] as x`))
      (q.projection({ fetch: l.fields('a', 'b', 'c'), as: 'x' }));
    });
    it('from', () => {
      const q = new ValidatableQuery();
      assert.equal(q.from('V'), `V`);
      assert.equal(q.from('#1:2'), `#1:2`);
      assert.equal(q.from(['#1:2','#2:3']), `[#1:2,#2:3]`);
      assert.throws(() => q.from(['#1:2','V']));
    });
    it('let', () => {
      const q = new ValidatableQuery();
      (r => assert.equal(r, `$_y = (select @this['a']['b']['c'] as x from [#1:2])`))
      (q.let({
        y: {
          what: [{ fetch: l.fields('a', 'b', 'c'), as: 'x' }],
          from: ['#1:2'],
        },
      }));
    });
    it('condition', () => {
      const q = new ValidatableQuery();
      (r => assert.equal(r, `@this['a']['b']['c'] is true`))
      (q.condition(l.cond('is', l.fields('a', 'b', 'c'), l.data(true))));
    });
    it('logical', () => {
      const q = new ValidatableQuery();
      (r => assert.equal(r, `((1 > 2) and (5 < 2)) or (@this['a']['b']['c'] is true)`))
      (q.logical(
        l.logic(
          'or',
          [l.cond('is', l.fields('a', 'b', 'c'), l.data(true))],
          [l.logic('and', [l.cond('>', l.data(1), l.data(2)), l.cond('<', l.data(5), l.data(2))])],
        ),
      ));
    });
    it('select', () => {
      const q = new ValidatableQuery();
      (r => assert.equal(r, `select @this['a']['b']['c'] as x from [#1:2] ` +
      `where ((1 > 2) and (5 < 2)) or (@this['a']['b']['c'] is true)`))
      (q.select({
        what: [{ fetch: l.fields('a','b','c'), as: 'x' }],
        from: ['#1:2'],
        where: l.logic(
          'or',
          [l.cond('is', l.fields('a', 'b', 'c'), l.data(true))],
          [l.logic('and', [l.cond('>', l.data(1), l.data(2)), l.cond('<', l.data(5), l.data(2))])],
        ),
      }));
    });
  });
}
