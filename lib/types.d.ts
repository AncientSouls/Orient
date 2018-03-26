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
