import { HumanInterface } from 'Core/HumanInterface';
import { Anchor as hoAnchor } from 'Core/HumanInterface/Stateless/Common/Anchor';
import { AnchorGroup as hoAnchorGroup } from 'Core/HumanInterface/Stateless/Common/AnchorGroup';
import { NamedAnchorGroup as hoNamedAnchorGroup } from 'Core/HumanInterface/Stateless/Common/NamedAnchorGroup';

import { Hello } from './Hello';
import { Main } from './Main';

import { myUi } from '../myUi';
import { myUi2 } from '../myUi2';

import { mock } from './Main/mock';

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
him.mount({ 'id': 'Application.Main', 'element': document.getElementById('app') });

