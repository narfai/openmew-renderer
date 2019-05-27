/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

export const DEFAULT_VIEWSET = Symbol('DEFAULT_VIEWSET'); //TODO attach to renderer
export const resource_identity = (name, viewset = null) => {
    return {
        name,
        'viewset': viewset === null
            ? DEFAULT_VIEWSET
            : viewset
    };
};

resource_identity.from_string = (potential_string) =>
    typeof potential_string === 'string'
        ? resource_identity(potential_string)
        : potential_string
;

resource_identity.allow = (resource, viewset) =>
    (viewset === null && resource.viewset === DEFAULT_VIEWSET)
    || viewset === resource.viewset
;
