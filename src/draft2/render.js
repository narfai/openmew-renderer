import m from "mithril";

/**RENDER**/
export const Anchor = {
    'oninit': function({ 'attrs': { provider, id }}){

    },
    'view': (vnode) => {
        // const { id, provider } = vnode.attrs;
        // const container = provider.get(id);

        // if(container === null) return m('#');

        // const attributes = Object.assign({}, vnode.attrs);
        // return m(container.component, attributes);
    }
};


const component_identity = ({ view = null, ...lifecycle }) => ({
    'view': view === null
        ? () => m('#')
        : view,
    ...lifecycle
});

const statefull_component = (provider) => ({ oninit, ...component }) => {
    return {
        ...component,
        'oninit': function(vnode){
            //TODO provide store to the vnode.state ( this )
            oninit.call(this, vnode);
            const { id, chain } = vnode;
            // Object.assign(this, action_creators(id, chain));
            // if(typeof component.oninit !== 'undefined'){
            //     component.oninit.call(this, vnode);
            // }
        }
    };
};

const sender_component = (action_creators) => {
    //TODO add actions to vnode, create if needed
};
