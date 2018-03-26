export declare type TData = boolean | number | string;
export declare type TKey = string;
export declare type TRid = string;
export interface IWrap {
    type: 'first';
    values?: IFetch[];
}
export declare type TFetchType = 'data' | 'field';
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
export declare type TLogicalType = 'and' | 'or' | 'not';
export interface ILogical {
    type: TLogicalType;
    logicals?: ILogical[];
    conditions?: ICondition[];
}
export declare type TConditionType = void | '=' | '>' | '>=' | '<' | '<=' | '<>' | 'is' | 'in';
export declare type TConditionValues = IFetch[][];
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
export declare type TFrom = TKey | TRid | TRid[];
export declare class Query {
    wrap(wrap: IWrap): string;
    paramsData: any[];
    addData(data: string): string;
    data(data: TData): string;
    rid(rid: TRid): string;
    key(key: TKey): string;
    field(field: string): string;
    fetch(fetch: IFetch): string;
    fetches(fetches: IFetch[]): string;
    projection(projection: IProjection): string;
    from(from: TFrom | any): string;
    select(select: ISelect): string;
    let(lets: ILet): string;
    logcalTypes: string[];
    logical(logical: ILogical): string;
    conditionSimpleTypes: string[];
    condition(condition: ICondition): string;
}
export declare const logic: (type: TLogicalType, conditions: ICondition[], logicals?: ILogical[]) => ILogical;
export declare const cond: (type: TConditionType, ...values: IFetch[][]) => ICondition;
export declare const fetch: (type: TFetchType, ...values: TData[]) => IFetch;
export declare const fields: (...values: TData[]) => IFetch[];
export declare const data: (value: TData) => IFetch[];
