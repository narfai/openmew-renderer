import m from 'mithril';

export class ViewHandler {
    static createDummyView(){
        return () => ViewHandler.createDummyElement();
    }
    static createDummyElement(){
        return m('#');
    }
    static redraw(){
        m.redraw();
    }
    static mount({ element, component }){
        m.mount(element, component);
    }
    static component({ component, attributes = {}, childs = [] }){
        if(!component) {
            console.warn('Falsy component', component);
            component = '';
        }

        return m(component, attributes, childs);
    }
}

export default ViewHandler;
