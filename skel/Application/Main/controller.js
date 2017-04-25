import m from 'mithril';
export const controller = ({ vm, container }) => {
    let inc = 0;
    vm.moduleText = '';
    vm.moduleName = '';
    container.actions
        .clear()
        .createSelfAction('doAppAwesome', () => ({ 'type': 'AWESOME' }))
        .createSelfAction('doAddModule', () => (
            container.actions.craftAddModuleAction({
                'resource': 'Application.Hello',
                'data': { 'text': 'Houhou' + (inc? ' #' + ++inc : '') },
                'name': 'NewModule2'
            })
        ))
        .createCustomAction('doSetNewModule2Text', () => ({
            'type': 'SET_MODULE_TEXT',
            'text': vm.moduleText
        }), (state) => state.name === vm.moduleName);

    vm.setCurrentViewSet = (viewset) => () => {
        container.setCurrentViewSet({ viewset });
        m.redraw();
    };
    vm.handleModuleTextChange = (event) => {
        vm.moduleText = event.target.value;
    };
    vm.handleModuleNameChange = (event) => {
        vm.moduleName = event.target.value;
    };
    vm.viewSets = container.getViewSets();
};
