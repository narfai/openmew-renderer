import { View } from './View';

export class ViewFactory {
    constructor({ statelessRepository }){
        this.statelessRepository = statelessRepository;
    }
    createView({ id, viewset, render, 'depends': { stateless = [], state = [] }}){
        let statelesses = this.getStatelessesComponents({ 'statelessDepends': stateless });
        return new View({
            id,
            viewset,
            render,
            'stateDepends': state,
            statelesses
        });
    }
    getStatelessesComponents({ statelessDepends }){
        let statelesses = {};
        statelessDepends.forEach((statelessId) => {
            statelesses[statelessId] = this.statelessRepository.get(statelessId).getComponent();
        });
        return statelesses;
    }
}

export default View;
