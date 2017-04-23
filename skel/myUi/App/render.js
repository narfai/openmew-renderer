import m from 'mithril';

export const render =
    (
        { id, actions, vm }, //Module level data
        { prefix = '', name = 'Dummy' }, //Specific requested data
        { NamedAnchorGroup, AnchorGroup } //eslint-disable-line no-unused-vars
    ) => (
        <div className="App" style="background-color: red;">
            <ul>
                <li><button onclick={vm.switchUi('myUi2')}>myUid2</button></li>
                <li><button onclick={vm.switchUi('myUi')}>myUi</button></li>
            </ul>
            <h1> UI 1 - {prefix + ' ' + name } </h1>
            <h5>
                <button onclick={actions.get('doAppAwesome')} type="button">Make app awesome</button>
            </h5>
            <h5>
                <button onclick={actions.get('doAddModule')} type="button">Add module</button>
            </h5>
            <div>
                <h2> Zone 1 </h2>
                <NamedAnchorGroup id={id} name="CreepyWorld" optional="this is optional data injected from App" />
            </div>
            <div>
                <h2> Zone 2 </h2>
                <ul>
                    <AnchorGroup id={id} filterFn={(mod) => mod.name !== 'CreepyWorld'} wrapper="li" />
                </ul>
            </div>
        </div>
    );

export default render;
