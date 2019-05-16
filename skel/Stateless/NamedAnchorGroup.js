/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import m from 'mithril';
import { AnchorGroup } from './AnchorGroup';

export const NamedAnchorGroup = {
    'resource': 'NamedAnchorGroup',
    'view': (vnode) => {
        let attributes = Object.assign(
            { 'filterFn': (container) => container.store.getState().name === vnode.attrs.name },
            vnode.attrs
        );
        return m(AnchorGroup, attributes);
    }
};

export default NamedAnchorGroup;
