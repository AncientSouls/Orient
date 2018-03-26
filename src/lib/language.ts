import * as _ from 'lodash';

import {
TLogicalType,
ICondition,
TConditionType,
TConditionValues,
ILogical,
IFetch,
TFetchType,
TData,
} from './types';

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
