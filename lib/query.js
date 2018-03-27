"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function mixin(superClass) {
    return class Query extends superClass {
        constructor() {
            super(...arguments);
            this.paramsData = [];
            this.orienFieldTypes = ['@rid', '@class', '@version', '@fields', '@type'];
            this.logicalTypes = ['and', 'or', 'not'];
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
                throw new Error(`Invalid TRid ${rid}.`);
            }
            return rid;
        }
        key(key) {
            if (!key.match(/^[A-Za-z0-9]+$/i)) {
                throw new Error(`Invalid TKey ${key}.`);
            }
            return key;
        }
        field(field) {
            if (_.includes(this.orienFieldTypes, field))
                return `.${field}`;
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
        where(where) {
            return this.logical(where);
        }
        lets(lets) {
            if (!lets)
                return '';
            return this.let(lets);
        }
        select(select) {
            let result = `select ${_.map(select.what, w => this.projection(w))} from ${this.from(select.from)}`;
            const lets = this.lets(select.let);
            if (lets)
                result += ` let ${lets}`;
            if (select.where) {
                result += ` where ${this.where(select.where)}`;
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
            if (!_.includes(this.logicalTypes, logical.type)) {
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
    };
}
exports.mixin = mixin;
exports.MixedQuery = mixin(class {
});
class Query extends exports.MixedQuery {
}
exports.Query = Query;
//# sourceMappingURL=query.js.map