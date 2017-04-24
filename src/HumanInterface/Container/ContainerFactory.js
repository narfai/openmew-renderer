import { Container } from './Container';

export class ContainerFactory {
    constructor({ providerManager }){
        this.id = 0;
        this.providerManager = providerManager;
    }
    createContainer({ blueprint, provider, chain = [], id }){
        id = id || ++this.id;
        chain = [ ...chain, id];
        let container = new Container({
            id,
            provider,
            chain,
            blueprint
        });
        container.warmup();
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
