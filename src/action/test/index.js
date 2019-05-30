/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import describe from 'ospec';
import { Allow } from '../allow';
const assert = describe;

describe('allow', function(){
    const mock = {
        'parent': {
            'resource': 'MockParent',
            'id': 'jw3r0qza',
            'chain': ['jw3r0qza'],
            'getState': () => ({
                'id': 'jw3r0qza',
                'resource': 'MockParent'
            })
        },
        'child': {
            'id': 'jwcloezc',
            'resource': 'MockChild',
            'chain': ['jw3r0qza', 'jwcloezc'],
            'getState': () => ({
                'id': 'jwcloezc',
                'resource': 'MockChild'
            })
        }
    };

    assert(Allow.none()()).equals(false);

    assert(Allow.root(mock.parent)()).equals(true);

    assert(Allow.self(mock.parent)(mock.parent.getState())).equals(true);

    assert(Allow.chain(mock.parent)(mock.parent.getState())).equals(true);

    assert(Allow.parent(mock.child)(mock.parent.getState())).equals(true);

    assert(Allow.resource('MockChild')(mock.child.getState())).equals(true);

    assert(Allow.self_resource(mock.parent)(mock.child.getState())).equals(false);
});
