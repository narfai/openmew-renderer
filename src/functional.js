/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

export const compose = (...farray) => (...args) =>
    farray.reduce(
        (accumulator, current) => current(accumulator),
        ...args
    );

export const pipe = (...farray) => compose(...farray.reverse());

const stat = {
    'success': 0,
    'failed': 0
};

export function assert(a, message = assert.format(a, ' is true')) { //TODO embed class moved in lib
    if(a === true){
        stat.success += 1;
        return;
    }
    stat.failed += 1;
    throw new Error('Fail to assert that ' + message);
}
assert.format = (...args) => JSON.stringify([...args]);
assert.equals = (a, b) => assert(a === b, assert.format(a, ' equals to ', b));
assert.not_equals = (a, b) => assert(a !== b, assert.format(a, ' not equals to ', b));

export default {
    compose,
    pipe
};