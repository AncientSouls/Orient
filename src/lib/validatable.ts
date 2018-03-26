import * as _ from 'lodash';
import * as assert from 'assert';
import * as t from './types';

import {
  TClass,
  IInstance,
} from 'ancient-mixins/lib/mixins';

import {
  Query,
  IQuery,
} from '../lib/query';

export function mixin<T extends TClass<IInstance>>(
  superClass: T,
): any {
  return class ValidatableQuery extends superClass {
    wrap(wrap) {
      assert.ok(_.isObject(wrap), `Invalid IWrap ${wrap}`);
      assert.ok(_.includes(['first'], wrap.type), `Invalid IWrap.type ${wrap.type}`);
      assert.ok(_.isArray(wrap.values), `Invalid IWrap.values ${wrap.values}`);
      return super.wrap(wrap);
    }
    data(data) {
      assert.ok(
        _.isBoolean(data) || _.isNumber(data) || _.isString(data),
        `Wrang TData ${data}`,
      );
      return super.data(data);
    }
    rid(rid) {
      assert.ok(_.isString(rid), `Invalid TRid ${rid}`);
      return super.rid(rid);
    }
    key(key) {
      assert.ok(_.isString(key), `Invalid TKey ${key}`);
      return super.key(key);
    }
    field(field) {
      assert.ok(_.isString(field));
      return super.field(field);
    }
    fetch(fetch) {
      assert.ok(_.isObject(fetch), `Invalid IFetch ${fetch}`);
      assert.ok(_.isArray(fetch.values), `Invalid IFetch.values ${fetch.values}`);
      return super.fetch(fetch);
    }
    fetches(fetches) {
      assert.ok(_.isArray(fetches), `Invalid IFetch[] ${fetches}`);
      return super.fetches(fetches);
    }
    projection(projection) {
      assert.ok(_.isObject(projection), `Invalid IProjection ${projection}`);
      return super.projection(projection);
    }
    from(from) {
      assert.ok(_.isArray(from) || _.isString(from), `Invalid TFrom ${from}`);
      return super.from(from);
    }
    select(select) {
      assert.ok(_.isObject(select), `Invalid ISelect ${select}`);
      return super.select(select);
    }
    let(lets) {
      assert.ok(_.isObject(lets), `Invalid ILet[] ${lets}`);
      return super.let(lets);
    }
    logical(logical) {
      assert.ok(_.isObject(logical), `Invalid ILogical ${logical}`);
      if (!_.isArray(logical.logicals)) logical.logicals = [];
      if (!_.isArray(logical.conditions)) logical.conditions = [];
      return super.logical(logical);
    }
    condition(condition) {
      assert.ok(_.isObject(condition), `Invalid ICondition ${condition.type}`);
      assert.ok(_.isString(condition.type), `Invalid ICondition.type ${condition.type}`);
      return super.condition(condition);
    }
  };
}

export const MixedValidatableQuery: TClass<IQuery> = mixin(Query);
export class ValidatableQuery extends MixedValidatableQuery {}
