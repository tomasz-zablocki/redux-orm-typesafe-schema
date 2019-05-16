/// <reference types="redux-orm" />
import { EntitySchema } from './types/schema';
import { createReducer, Orm, OrmSelector, OrmState, Repository, Session, TypedModel } from './types/redux-orm';
export { register, createSelector, createReducer, Repository, Session, TypedModel };
declare function register<TEntitySchema extends EntitySchema>(orm: Orm, entitySchema: TEntitySchema): Session<TEntitySchema>;
declare function createSelector<E extends EntitySchema, Result>(orm: Orm, ormSelector: OrmSelector<E, Result>): (state: OrmState) => Result;
