import m from 'mithril';
export const Main = {
    'id': 'Application.Main',
    'render': (
        { id, actions, vm }, //Module level data
        { prefix = '', name = 'Dummy' }, //Specific requested data
        { AnchorGroup, NamedAnchorGroup } //eslint-disable-line no-unused-vars
    ) => {
        return (<div className="App" style="background-color: blue;">
            <ul>
                {
                    vm.viewSets.map((viewset) => (
                        <li><button onclick={vm.setCurrentViewSet(viewset)}>{viewset}</button></li>
                    ))
                }
            </ul>
            <h1 style="color: green;"> UI 2 - {prefix + ' ' + name } </h1>
            <h5>
                <button onclick={actions.get('doAppAwesome')} type="button">Make app awesome</button>
            </h5>
            <div>
                <h2> Zone 1 </h2>
                <NamedAnchorGroup id={id} name="CreepyWorld" optional="this is optional data injected from App" />
            </div>
            <div>
                <h2> Zone 2 </h2>
                <ul>
                    <AnchorGroup id={id} filterFn={(mod) => mod.name !== 'CreepyWorld'} wrapper="li" />
                    <li> <button onclick={actions.get('doAddModule')} type="button">Add module</button> </li>
                </ul>
            </div>
        </div>);
    },
    'depends': {
        'state': [ 'prefix', 'name', 'modules' ],
        'stateless': ['AnchorGroup', 'NamedAnchorGroup']
    }
};

export default Main;
