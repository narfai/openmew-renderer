import { View } from './View';

export class ViewFactory {
    constructor({ statelessRepository }){
        this.statelessRepository = statelessRepository;
    }
    createView({ id, render, dataDepends = [], statelessDepends = [] }){
        let dependsProvider = this.createDependsProvider({ dataDepends });
        let statelesses = this.getStatelessesComponents({ statelessDepends });
        return new View({
            id,
            render,
            dependsProvider,
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
    createDependsProvider({ dataDepends }){
        return ({ state }) => {
            return ViewFactory.extractDepends(state, dataDepends);
        };
    }
    static extractDepends(state, depends){
        let viewState = {};
        depends.forEach((depend) => {
            if(state.hasOwnProperty(depend))
                viewState[depend] = state[depend];
            else if(state.data.hasOwnProperty(depend))
                viewState[depend] = state.data[depend];
        });
        return viewState;
    }
}

export default View;
