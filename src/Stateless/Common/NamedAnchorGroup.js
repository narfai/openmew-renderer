/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { ViewHandler } from '../../View/ViewHandler';

export const NamedAnchorGroup = {
    'id': 'NamedAnchorGroup',
    'component': ({ statelessRepository }) => {
        let AnchorGroup = statelessRepository.get('AnchorGroup').getComponent();
        return {
            'view': (vnode) => {
                let attributes = Object.assign(
                    { 'filterFn': (module) => module.name === vnode.attrs.name },
                    vnode.attrs
                );
                return ViewHandler.component({
                    'component': AnchorGroup,
                    attributes
                });
            }
        };
    }
};

export default NamedAnchorGroup;
