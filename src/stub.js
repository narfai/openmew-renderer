/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

/** GIVEN ... **/
const stub = {
    'action': {
        'custom': {
            'type': 'TEST_ACTION',
            'content': 'TEST CONTENT'
        }
    },
    'action_creator': {
        'custom': (spread) => ({
            'test_action': spread(() => (stub.action.custom))(spread.scope.global)
        }),
        'structural': (spread) => ({
            'append': spread.append(() => ({ 'resource': 'MockChild' }))(spread.scope.global),
            'prepend': spread.prepend(() => ({ 'resource': 'MockChild' }))(spread.scope.global),
            'detach': spread.detach(() => ({ 'id': 'jwcloezc' }))(spread.scope.global)
        })
    },
    'store': {
        'parent': {
            'id': 'jw3r0qza',
            'resource': 'MockParent',
            'chain': ['jw3r0qza'],
            'getState': () => ({
                'id': 'jw3r0qza',
                'resource': 'MockParent',
                'children': [
                    {
                        'id': 'jwcloezc',
                        'resource': 'MockChild',
                        'children': []
                    }
                ]
            })
        },
        'child': {
            'id': 'jwcloezc',
            'resource': 'MockChild',
            'chain': ['jw3r0qza', 'jwcloezc'],
            'getState': () => stub.store.parent.getState().children[0]
        }
    }
};

module.exports = stub;
