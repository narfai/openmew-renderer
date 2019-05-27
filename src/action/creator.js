/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

export class ActionCreator {
    static attach({ resource, initial_state = {} }){
        return {
            'type': 'ATTACH_MODULE',
            resource,
            initial_state
        };
    }

    static detach({ id }){
        return {
            'type': 'DETACH_MODULE',
            id
        };
    }
}
