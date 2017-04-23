import { UserInterfaceManager } from 'UserInterfaceManager';

export class UiPart {
    constructor(injections){
        this.injections = injections;
    }
    render(moduleData, neededData){
        if(typeof this[UserInterfaceManager.useRenderSymbol()] === 'undefined')
            throw new Error('Please specify render method by using @useRender');
        return this[UserInterfaceManager.useRenderSymbol()](moduleData, neededData, this.injections);
    }
    getDataDependencies(){
        if(typeof this[UserInterfaceManager.injectDataSymbol()] === 'undefined')
            return [];
        return this[UserInterfaceManager.injectDataSymbol()];
    }
}
