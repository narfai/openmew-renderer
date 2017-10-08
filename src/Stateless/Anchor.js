/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

import { Container } from '../Container';
import m from 'mithril';

export const Anchor = {
    'resource': 'Anchor',
    'view': (vnode) => {
        let {id} = vnode.attrs;
        let attributes = Object.assign({}, vnode.attrs),
            container = Container.get({ id });
        if(container === null)
            return m('#');

        return m(container.component, attributes);
    }
};
export default Anchor;
