/*DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 Version 2, December 2004

 Copyright (C) 2017 Francois Cadeillan <francois@azsystem.fr>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

 DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

import { HumanInterface } from 'openmew-renderer';
import { Anchor as hoAnchor } from 'openmew-renderer/Stateless/Common/Anchor';
import { AnchorGroup as hoAnchorGroup } from 'openmew-renderer/Stateless/Common/AnchorGroup';
import { NamedAnchorGroup as hoNamedAnchorGroup } from 'openmew-renderer/Stateless/Common/NamedAnchorGroup';

import { Hello } from './Hello';
import { Main } from './Main';

import { myUi } from './myUi';
import { myUi2 } from './myUi2';

import { mock } from './mock';

let him = new HumanInterface(mock);
him.registerStateless(hoAnchor);
him.registerStateless(hoAnchorGroup);
him.registerStateless(hoNamedAnchorGroup);
him.registerViewSet(myUi);
him.registerViewSet(myUi2);
him.registerBlueprint(Hello);
him.registerBlueprint(Main);
him.subscribe(({ container, action }) => {
    console.log('Container ' + container.getId() + ' change with state ', container.getState(), ' after ', action);
});
him.mount({
    'resource': 'Application.Main',
    'element': document.getElementById('app'),
});

