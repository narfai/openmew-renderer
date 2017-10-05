/*
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 Copyright (C) 2017 François Cadeillan <francois@azsystem.fr>
 */

/**
 * This class is a generic store wrapper for getting store data or relay actions
 * It is able to build sub-providers by itself, which handle a slice of store tree selected by given user func
 */
export class StoreProvider {
    constructor(provider, id = ''){
        this.provider = provider;
        this.id = id;
        this.listeners = [];
    }
    getState(){
        return this.provider.getState();
    }
    getListeners(){
        return this.listeners;
    }
    dispatch(action){
        this.provider.dispatch(action);
        this.getListeners().forEach((listen) => listen({ 'id': this.id, action }));
    }
    subscribe(listen){
        this.provider.subscribe(listen);
    }
    localSubscribe(listen){
        this.listeners.push(listen);
    }
}

export class SubStoreProvider extends StoreProvider {
    constructor(provider, select, id = ''){
        super(provider, id);
        this.select = select;
    }
    getState(){
        return this.select(super.getState());
    }
    getListeners(){
        return this.provider.getListeners();
    }
}

export default StoreProvider;