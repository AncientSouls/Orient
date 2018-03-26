"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Query {
    constructor() {
        this.paramsData = [];
        this.logcalTypes = ['and', 'or', 'not'];
        this.conditionSimpleTypes = ['=', '>', '>=', '<', '<=', '<>', 'is', 'in'];
    }
    wrap(wrap) {
        const values = _.map(wrap.values, v => this.fetch(v));
        switch (wrap.type) {
            case 'first': return `first(${values})`;
        }
    }
    addData(data) {
        return `:param${this.paramsData.push(data) - 1}`;
    }
    data(data) {
        if (typeof data === 'boolean')
            return `${data}`;
        if (typeof data === 'number')
            return `${data}`;
        if (typeof data === 'string')
            return this.addData(data);
    }
    rid(rid) {
        if (!rid.match(/^#[0-9]+:[0-9]+$/i)) {
            throw new Error('Field not matched as Trid.');
        }
        return rid;
    }
    key(key) {
        if (!key.match(/^[A-Za-z0-9]+$/i)) {
            throw new Error('Field not matched as TKey.');
        }
        return key;
    }
    field(field) {
        return `['${this.key(field)}']`;
    }
    fetch(fetch) {
        switch (fetch.type) {
            case 'data': return _.map(fetch.values, v => this.data(v));
            case 'field': return _.map(fetch.values, v => this.field(v));
        }
        throw new Error(`Unexpected fetch strategy ${fetch.type}`);
    }
    fetches(fetches) {
        let fetch = '@this';
        let f;
        for (f in fetches) {
            if (fetches[f].type === 'data') {
                fetch = this.fetch(fetches[f]);
                break;
            }
            else
                fetch += this.fetch(fetches[f]);
        }
        return fetch;
    }
    projection(projection) {
        const fetch = this.fetches(projection.fetch);
        if (projection.as)
            return `${fetch} as ${this.key(projection.as)}`;
        return `${fetch}`;
    }
    from(from) {
        if (_.isArray(from)) {
            return `[${_.map(from, f => this.rid(f))}]`;
        }
        if (from.match(/^#[0-9]+:[0-9]+$/i) || from.match(/^[A-Za-z0-9]+$/i))
            return from;
        throw new Error(`From not matched as TKey, TRid or TRid[]`);
    }
    select(select) {
        let result = `select ${_.map(select.what, w => this.projection(w))} from ${this.from(select.from)}`;
        if (select.where) {
            result += ` where ${this.logical(select.where)}`;
        }
        return result;
    }
    let(lets) {
        const results = [];
        let l;
        for (l in lets) {
            results.push(`$_${this.key(l)} = (${this.select(lets[l])})`);
        }
        return results.toString();
    }
    logical(logical) {
        if (!_.includes(this.logcalTypes, logical.type)) {
            throw new Error(`Unexpected logical type ${logical.type}`);
        }
        return [
            ..._.map(logical.logicals, l => `(${this.logical(l)})`),
            ..._.map(logical.conditions, c => `(${this.condition(c)})`),
        ].join(` ${logical.type} `);
    }
    condition(condition) {
        if (!condition.type) {
            if (condition.values.length !== 1) {
                throw new Error(`Conditionless condition must have one value but ${condition.values.length}.`);
            }
            return this.fetches(condition.values[0]);
        }
        if (_.includes(this.conditionSimpleTypes, condition.type)) {
            if (condition.values.length !== 2) {
                throw new Error(`Conditionless condition must have two values but ${condition.values.length}.`);
            }
            return `${this.fetches(condition.values[0])} ${condition.type} ${this.fetches(condition.values[1])}`;
        }
        throw new Error(`Unexpected logical type ${condition.type}`);
    }
}
exports.Query = Query;
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