/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { ViewHandler } from '../../View/ViewHandler';
import Container from '../../Container/Container';

export const AnchorGroup = {
    'id': 'AnchorGroup',
    'component': ({ containerRepository, statelessRepository }) => {
        let Anchor = statelessRepository.get('Anchor').getComponent(); //eslint-disable-line no-unused-vars
        return {
            'view': (vnode) => {
                let { id, wrapper = null, filterFn = () => true } = vnode.attrs;
                let container = containerRepository.get(id);
                if(typeof container === 'undefined' || !(container instanceof Container))
                    return ViewHandler.createDummyElement();

                let { modules = [] } = container.getState();
                return modules
                    .filter(filterFn)
                    .map((module) => {
                            let attributes = Object.assign({}, vnode.attrs);
                            attributes.id = module.id;
                            attributes.key = module.id;
                            return ViewHandler.component(
                                wrapper !== null
                                ? {
                                    'component': wrapper,
                                    'attributes': {'key': module.id},
                                    'childs': [
                                        ViewHandler.component({
                                            'component': Anchor,
                                            attributes
                                        })
                                    ]
                                }
                                : { 'component': Anchor, attributes }
                            );
                        }
                    );
            }
        };
    }
};

export default AnchorGroup;
