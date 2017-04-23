import m from 'mithril'; //eslint-disable-line no-unused-vars
export const render =
    (
        { actions, id}, //Module level data
        { name = 'Dummy', text = '', number = 0}, //Specific requested data
        { AnchorGroup } //eslint-disable-line no-unused-vars
    ) => (
        <div className="Hello">
            Hello { name } { text } #{number}
            <button onclick={actions.get('doSetActivePage')} page-name="One" type="button">Page One</button>
            <button onclick={actions.get('doIncrement')} type="button">Increment self {id}</button>
            <button onclick={actions.get('doIncrementChain')} type="button">Increment bubble</button>
            <button onclick={actions.get('doIncrementAll')} type="button">Increment all</button>
            <button onclick={actions.get('doRemoveModule')} type="button">Remove myself</button>
            <button onclick={actions.get('doAddModule')} type="button">Add submodule</button>
            <ul><AnchorGroup id={id} wrapper="li" /></ul>
        </div>
    );

export default render;
