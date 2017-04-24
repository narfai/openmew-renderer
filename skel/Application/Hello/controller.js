export const controller = ({ vm, container }) => {
    let inc = 0;
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
                'data': { 'text': 'Child of #' + container.id },
                'name': 'NewModule'
            })
        ), (e, data) => {
            data.data.text += (inc? inc : '');
            inc++;
            return data;
        })
        .createSelfAction('doSetActivePage', () => ({ }), (e, data) => {
            data.name = e.target.attrs['page-name'];
            return data;
        });
};

export default controller;
