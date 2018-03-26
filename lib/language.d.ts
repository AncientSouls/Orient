import { TLogicalType, ICondition, TConditionType, ILogical, IFetch, TFetchType, TData } from './types';
export declare const logic: (type: TLogicalType, conditions: ICondition[], logicals?: ILogical[]) => ILogical;
export declare const cond: (type: TConditionType, ...values: IFetch[][]) => ICondition;
export declare const fetch: (type: TFetchType, ...values: TData[]) => IFetch;
export declare const fields: (...values: TData[]) => IFetch[];
export declare const data: (value: TData) => IFetch[];
