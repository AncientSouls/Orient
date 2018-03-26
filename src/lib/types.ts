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
