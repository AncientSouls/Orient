# Ancient Orient

:sunny: Tracking, subscribing and restricted queries language for OrientDB.

[![NPM](https://img.shields.io/npm/v/ancient-orient.svg)](https://www.npmjs.com/package/ancient-orient)
[![Build Status](https://travis-ci.org/AncientSouls/Orient.svg?branch=master)](https://travis-ci.org/AncientSouls/Orient)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/59e712651c484fb2a179961c3ee9fc23)](https://www.codacy.com/app/ivansglazunov/Orient?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=AncientSouls/Orient&amp;utm_campaign=Badge_Grade)
[![Read the Docs](https://img.shields.io/readthedocs/pip.svg)](https://ancientsouls.github.io/)

### Query

Restrictable orient sql query generator.

- each fetching is wrappable for restriction purposes
- by default class `Query` is not validate data
- you can mix `Query` class with class `ValidatedQuery` for assertion invalid argument types
- supported constructions
  - [x] `= > >= < <= <> is in`
  - [ ] `between contains containsall`
  - [ ] `containsvalue containskey`
  - [ ] `containstext`
  - [ ] `matches`
  - [ ] `@rid`
  - [ ] `@class`
  - [ ] `@version`
  - [ ] `@fields`
  - [ ] `@type`
  - [x] `data`
    - [x] `boolean`
    - [x] `number`
    - [x] `string`
    - [ ] `date`
  - [x] `field` `['a']`
  - [x] `projection` `@this['a']['b']['c'] as x`
  - [x] `from` `V` `#1:2` `[#1:2,#2:3]`
  - [x] `let`
  - [x] `where`
  - [ ] `group`
  - [ ] `order`
  - [ ] `skip`
  - [ ] `limit`
  - [x] `select`
  - [ ] `insert`
  - [ ] `update`
  - [ ] `delete`
- supported functions
  - [ ] `in`
  - [ ] `out`
  - [ ] `both`
  - [ ] `inE`
  - [ ] `outE`
  - [ ] `bothE`
  - [ ] `inV`
  - [ ] `outV`
  - [x] `first`
  - [ ] `count`
  - [ ] `min`
  - [ ] `max`
  - [ ] `abs`
  - [ ] `avg`
  - [ ] `sum`
  - [ ] `expand`
  - [ ] `distinct`
  - [ ] `union`
  - [ ] `difference`
  - [ ] `symmetricDifference`
  - [ ] `set`
  - [ ] `list`
  - [ ] `map`
  - [ ] `median`
  - [ ] `percentile`
  - [ ] `variance`
  - [ ] `stddev`