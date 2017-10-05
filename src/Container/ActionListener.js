import { ReduceHandler } from '../Blueprint/ReduceHandler';

export class ActionListener {
    constructor({ containerRepository }){
        this.listeners = [];
        this.containerRepository = containerRepository;
    }
    addListener(listener){
        this.listeners.push(listener);
        return this.listeners.length-1;
    }
    removeListener(index){
        this.listeners.splice(index, 1);
    }
    notify({ action }){
        if (typeof action.id !== 'undefined'){
            let container = this.containerRepository.get(action.id);
            if(container !== null){
                let state = container.getState();
                if(ReduceHandler.allowReduce({ state, action }))
                    this.listeners.forEach((listener) => listener({ container, action }));
            }
        }
    }
}
