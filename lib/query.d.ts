import * as t from './types';
import { TClass, IInstance } from 'ancient-mixins/lib/mixins';
export interface IQuery {
    wrap(wrap: t.IWrap): string;
    paramsData: string[];
    addData(data: string): string;
    data(data: t.TData): string;
    rid(rid: t.TRid): string;
    key(key: t.TKey): string;
    field(field: string): string;
    fetch(fetch: t.IFetch): string;
    fetches(fetches: t.IFetch[]): string;
    projection(projection: t.IProjection): string;
    from(from: t.TFrom | any): string;
    where(where: t.ILogical): string;
    lets(lets: t.ILet[] | void): string;
    select(select: t.ISelect): string;
    let(lets: t.ILet): string;
    logicalTypes: string[];
    logical(logical: t.ILogical): string;
    conditionSimpleTypes: string[];
    condition(condition: t.ICondition): string;
}
export declare function mixin<T extends TClass<IInstance>>(superClass: T): any;
export declare const MixedQuery: TClass<IQuery>;
export declare class Query extends MixedQuery {
}
