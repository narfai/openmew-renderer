import { resource, inject, namespace } from 'Core/DependencyInjection/decorators';
import { injectData, useRender } from 'Core/Io/Ux/decorators';
import { UiPart } from 'Core/Io/Ux/Abstract/UiPart';
import { render } from './render';

@resource('App')
@namespace('myUi')
@inject('Managed.AnchorGroup', 'Managed.NamedAnchorGroup')
@useRender(render)
@injectData([
    'prefix',
    'name',
    'modules'
])
export class App extends UiPart {}

export default App;
