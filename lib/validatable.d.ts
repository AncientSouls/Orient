import { TClass, IInstance } from 'ancient-mixins/lib/mixins';
import { IQuery } from '../lib/query';
export declare function mixin<T extends TClass<IInstance>>(superClass: T): any;
export declare const MixedValidatableQuery: TClass<IQuery>;
export declare class ValidatableQuery extends MixedValidatableQuery {
}
