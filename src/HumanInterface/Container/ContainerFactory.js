import { Container } from './Container';

export class ContainerFactory {
    constructor({ providerManager, viewRepository }){
        this.id = 0;
        this.providerManager = providerManager;
        this.viewRepository = viewRepository;
    }
    createContainer({ blueprint, provider, chain = [], id }){
        id = id || ++this.id;
        chain = [ ...chain, id];
        let view = this.viewRepository.get(blueprint.getId());
        let container = new Container({
            id,
            provider,
            chain
        });
        container.setReducer(blueprint.createReducer({ container }));
        container.setComponent(blueprint.createComponent({ container, view }));
        return container;
    }
    createSubContainer({ blueprint, parent }){
        let id = ++this.id;
        let provider = this.providerManager.createSubProvider({
            id,
            'parent': parent.getProvider(),
            'key': 'modules',
            'discriminator': 'id'
        });
        return this.createContainer({ blueprint, provider, 'chain': parent.getChain(), id });
    }
}

export default ContainerFactory;
