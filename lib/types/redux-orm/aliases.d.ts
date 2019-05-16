import { attr, createReducer, createSelector, fk, many, Model, ModelFields, oneToOne, ORM, ORMCommonState, Session } from 'redux-orm';
export { OrmFields, ModelFields as OrmModelFields, ORM as Orm, OrmModelClass, ORMCommonState as OrmState, Model as OrmModel, OrmSession, createSelector as createOrmSelector, createReducer };
declare const OrmFields: {
    attr: typeof attr;
    fk: typeof fk;
    many: typeof many;
    oneToOne: typeof oneToOne;
};
declare type OrmSession = Session<ORMCommonState>;
declare type OrmModelClass = typeof Model;
