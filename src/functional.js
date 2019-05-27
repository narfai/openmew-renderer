/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

export class Functional {
    static compose(...farray){
        return (...args) =>
            farray.reduce(
                (accumulator, current) => current(accumulator),
                ...args
            );
    }

    static pipe(...farray){
        return Functional.compose(...farray.reverse());
    }

    static asserter(){
        const stats = {
            'success': 0,
            'failed': 0
        };

        function assert(a, message = assert.format(a, ' is true')){
            if(a === true){
                stats.success += 1;
                return;
            }
            stats.failed += 1;
            throw new Error('Fail to assert that ' + message);
        }
        assert.format = (...args) => JSON.stringify([...args]);
        assert.equals = (a, b) => assert(a === b, assert.format(a, ' equals to ', b));
        assert.not_equals = (a, b) => assert(a !== b, assert.format(a, ' not equals to ', b));
        assert.stats = () => stats;

        return assert;
    }
}
