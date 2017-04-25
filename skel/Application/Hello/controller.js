export const controller = ({ vm, container }) => {
    let inc = 0;
    //Give values to the view
    //Create virtual methods
    container.actions
        .clear()
        .createSelfAction('doIncrement', () => ({ 'type': 'INCREMENT' }))
        .createChainAction('doIncrementChain', () => ({ 'type': 'INCREMENT' }))
        .createGlobalAction('doIncrementAll', () => ({ 'type': 'INCREMENT' }))
        .createParentAction('doRemoveModule', () => (
            container.actions.craftRemoveModuleAction({ 'id': container.id })
        ))
        .createSelfAction('doAddModule', () => (
            container.actions.craftAddModuleAction({
                'resource': 'Application.Hello',
                'data': { 'text': 'Child of #' + container.id + (inc? ' #' + ++inc : '') },
                'name': 'NewModule'
            })
        ));
};

export default controller;
