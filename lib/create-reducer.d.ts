/// <reference types="redux-orm" />
import { OrmState } from './types/redux-orm';
import { Reducer } from 'redux';
import { Store } from 'redux';
export declare function configureStore(rootReducer: Reducer): Store<RootState>;
export declare type RootState = {
    db: OrmState;
};
