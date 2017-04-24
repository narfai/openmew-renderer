import m from 'mithril';
export const controller = ({ vm, container }) => {
    let inc = 0;
    container.actions
        .clear()
        .createSelfAction('doAppAwesome', () => ({ 'type': 'AWESOME' }))
        .createSelfAction('doAddModule', () => (
            container.actions.craftAddModuleAction({
                'resource': 'Application.Hello',
                'data': { 'text': 'Houhou' },
                'name': 'NewModule'
            })
        ), (e, data) => {
            data.data.text += (inc? inc : '');
            inc++;
            return data;
        });

    vm.setCurrentViewSet = (viewset) => () => {
        container.setCurrentViewSet({ viewset });
        m.redraw();
    };
    vm.viewSets = container.getViewSets();
};
