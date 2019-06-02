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
}
