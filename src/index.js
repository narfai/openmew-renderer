import m from 'mithril';
import { Blueprint } from './Blueprint';
import { Container } from './Container';
import { Anchor } from './Stateless/Anchor';
import { AnchorGroup } from './Stateless/AnchorGroup';
import { NamedAnchorGroup } from './Stateless/NamedAnchorGroup';

export class StateRenderer {
    static register(){
        return (next) => (action) => {
            if (action.type !== 'REGISTER_BLUEPRINT'
                || typeof action.blueprint === 'undefined')
                return next(action);

            let blueprint = new Blueprint(action.blueprint);
            Blueprint.add({ blueprint });

            delete action.blueprint;
            return next(action);
        };
    }
    static connect(store){
        return (next) => (action) => {
            if (action.type !== 'CONNECT')
                return next(action);

            let {resource = null, id = null} = store.getState();
            if (!resource || !id)
                return next(action);

            let blueprint = Blueprint.get({resource});

            if (!blueprint) {
                console.warn('blueprint ' + resource + ' is not registered');
                return next(action);
            }

            let container = new Container({
                blueprint,
                store,
                id
            });
            Container.add({container});

            action.onConnect({ container });

            delete action.onConnect;
            return next(action);
        };
    }
    static middlewares(){
        Blueprint.add({ 'blueprint': Anchor });
        Blueprint.add({ 'blueprint': AnchorGroup });
        Blueprint.add({ 'blueprint': NamedAnchorGroup });
        return [
            (store) => StateRenderer.register(store),
            (store) => StateRenderer.connect(store)
        ];
    }
}

export default StateRenderer;
