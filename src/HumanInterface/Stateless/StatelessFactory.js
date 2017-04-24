import { Stateless } from './Stateless';

export class StatelessFactory {
    constructor({ containerRepository, statelessRepository }){
        this.containerRepository = containerRepository;
        this.statelessRepository = statelessRepository;
    }
    createStateless({ id, component }){
        return new Stateless({
            id,
            'component': component({
                'containerRepository': this.containerRepository,
                'statelessRepository': this.statelessRepository
            })
        });
    }
}
