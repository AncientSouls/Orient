import * as _ from 'lodash';

export type TData = boolean | number | string;
export type TKey = string; // /^[a-z0-9]+$/i
export type TRid = string; // /^#[0-9]+:[0-9]+$/i

export interface IWrap {
  type: 'first';
  values?: IFetch[];
}

export type TFetchType = 'data' | 'field';

export interface IFetch {
  type: TFetchType;
  values: TData[];
}

export interface IProjection {
  fetch: IFetch[];
  as: TKey;
}

export interface ILet {
  [key: string]: ISelect;
}

export type TLogicalType = 'and' | 'or' | 'not';

export interface ILogical {
  type: TLogicalType;
  logicals?: ILogical[];
  conditions?: ICondition[];
}

export type TConditionType = void | '=' | '>' | '>=' | '<' | '<=' | '<>' | 'is' | 'in';
export type TConditionValues = IFetch[][];

export interface ICondition {
  type?: TConditionType;
  values: TConditionValues;
}

export interface ISelect {
  what: IProjection[];
  from: TFrom;
  let?: ILet;
  where?: ILogical;
}

export type TFrom = TKey | TRid | TRid[];

export class Query {
  wrap(wrap: IWrap): string {
    const values = _.map(wrap.values, v => this.fetch(v));
    switch (wrap.type) {
      case 'first': return `first(${values})`;
    }
  }
  public paramsData = [];
  addData(data: string): string {
    return `:param${this.paramsData.push(data) - 1}`;
  }
  data(data: TData): string {
    if (typeof data === 'boolean') return `${data}`;
    if (typeof data === 'number') return `${data}`;
    if (typeof data === 'string') return this.addData(data);
  }
  rid(rid: TRid): string {
    if (!rid.match(/^#[0-9]+:[0-9]+$/i)) {
      throw new Error('Field not matched as Trid.');
    }
    return rid;
  }
  key(key: TKey): string {
    if (!key.match(/^[A-Za-z0-9]+$/i)) {
      throw new Error('Field not matched as TKey.');
    }
    return key;
  }
  field(field: string): string {
    return `['${this.key(field)}']`;
  }
  fetch(fetch: IFetch): string {
    switch (fetch.type) {
      case 'data': return _.map(fetch.values, v => this.data(v));
      case 'field': return _.map(fetch.values, v => this.field(v));
    }

    throw new Error(`Unexpected fetch strategy ${fetch.type}`);
  }
  fetches(fetches: IFetch[]): string {
    let fetch = '@this';
    let f;

    for (f in fetches) {
      if (fetches[f].type === 'data') {
        fetch = this.fetch(fetches[f]);
        break;
      } else fetch += this.fetch(fetches[f]);
    }

    return fetch;
  }
  projection(projection: IProjection): string {
    const fetch = this.fetches(projection.fetch);
    if (projection.as) return `${fetch} as ${this.key(projection.as)}`;
    return `${fetch}`;
  }
  from(from: TFrom|any): string {
    if (_.isArray(from)) {
      return `[${_.map(from, f => this.rid(f))}]`;
    }
    
    if (from.match(/^#[0-9]+:[0-9]+$/i) || from.match(/^[A-Za-z0-9]+$/i)) return from;

    throw new Error(`From not matched as TKey, TRid or TRid[]`);
  }
  select(select: ISelect): string {
    let result = `select ${
      _.map(select.what, w => this.projection(w))
    } from ${
      this.from(select.from)
    }`;

    if (select.where) {
      result += ` where ${this.logical(select.where)}`;
    }

    return result;
  }
  let(lets: ILet): string {
    const results = [];
    let l;
    for (l in lets) {
      results.push(`$_${this.key(l)} = (${this.select(lets[l])})`);
    }
    return results.toString();
  }

  public logcalTypes = ['and', 'or', 'not'];

  logical(logical: ILogical): string {
    if (!_.includes(this.logcalTypes, logical.type)) {
      throw new Error(`Unexpected logical type ${logical.type}`);
    }
    return [
      ..._.map(logical.logicals, l => `(${this.logical(l)})`),
      ..._.map(logical.conditions, c => `(${this.condition(c)})`),
    ].join(` ${logical.type} `);
  }

  public conditionSimpleTypes = ['=', '>', '>=', '<', '<=', '<>', 'is', 'in'];

  condition(condition: ICondition): string {
    if (!condition.type) {
      if (condition.values.length !== 1) {
        throw new Error(`Conditionless condition must have one value but ${
          condition.values.length
        }.`);
      }
      return this.fetches(condition.values[0]);
    }
    if (_.includes(this.conditionSimpleTypes, condition.type)) {
      if (condition.values.length !== 2) {
        throw new Error(`Conditionless condition must have two values but ${
          condition.values.length
        }.`);
      }
      return `${
        this.fetches(condition.values[0])
      } ${condition.type} ${
        this.fetches(condition.values[1])
      }`;
    }
    throw new Error(`Unexpected logical type ${condition.type}`);
  }
}

export const logic = (
  type: TLogicalType,
  conditions: ICondition[],
  logicals?: ILogical[],
): ILogical => {
  return {
    type,
    conditions,
    logicals,
  };
};

export const cond = (
  type: TConditionType,
  ...values: TConditionValues,
): ICondition => {
  return {
    type,
    values,
  };
};

export const fetch = (
  type: TFetchType,
  ...values: TData[],
): IFetch => {
  return {
    type,
    values,
  };
};

export const fields = (
  ...values: TData[],
): IFetch[] => {
  return _.map(values, v => ({ type: 'field', values: [v] }));
};

export const data = (
  value: TData,
): IFetch[] => {
  return [{ type: 'data', values: [value] }];
};
