import { resource, inject, namespace } from 'Core/DependencyInjection/decorators';
import { injectData, useRender } from 'Core/Io/Ux/decorators';
import { UiPart } from 'Core/Io/Ux/Abstract/UiPart';
import { render } from './render';

@resource('App')
@inject('Managed.AnchorGroup')
@namespace('myUi')
@useRender(render)
@injectData([
    'name',
    'text',
    'number',
    'modules'
])
export class Hello extends UiPart {}

export default Hello;
