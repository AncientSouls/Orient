"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.logic = (type, conditions, logicals) => {
    return {
        type,
        conditions,
        logicals,
    };
};
exports.cond = (type, ...values) => {
    return {
        type,
        values,
    };
};
exports.fetch = (type, ...values) => {
    return {
        type,
        values,
    };
};
exports.fields = (...values) => {
    return _.map(values, v => ({ type: 'field', values: [v] }));
};
exports.data = (value) => {
    return [{ type: 'data', values: [value] }];
};
//# sourceMappingURL=language.js.map