/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { Container } from '../Container';
import { Anchor } from './Anchor';
import m from 'mithril';

export const AnchorGroup = {
    'resource': 'AnchorGroup',
    'view': (vnode) => {
        let { id, wrapper = null, filterFn = () => true } = vnode.attrs;
        let container = Container.get({ id });
        if(typeof container === 'undefined' || !(container instanceof Container))
            return m('#');

        return container.getContainers()
            .filter(filterFn)
            .map(({ 'id': subId }) => {
                    let attributes = Object.assign({}, vnode.attrs);
                    attributes.id = subId;
                    attributes.key = subId;
                     return wrapper !== null
                        ? m(wrapper, {'key': subId}, [m(Anchor, attributes)])
                        : m(Anchor, attributes);
                }
            );
    }
};


export default AnchorGroup;
