/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { ViewHandler } from '../../View/ViewHandler';

export const Anchor = {
    'id': 'Anchor',
    'component': ({ containerRepository }) => {
        return {
            'view': (vnode) => {
                let {id} = vnode.attrs;
                let attributes = Object.assign({}, vnode.attrs),
                    container = containerRepository.get(id);
                if(container === null)
                    return ViewHandler.createDummyElement();

                let component = container.getComponent();
                return ViewHandler.component({
                    component,
                    attributes
                });
            }
        };
    }
};
export default Anchor;
