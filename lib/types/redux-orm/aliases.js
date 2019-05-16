"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_orm_1 = require("redux-orm");
exports.createReducer = redux_orm_1.createReducer;
exports.createOrmSelector = redux_orm_1.createSelector;
exports.OrmModel = redux_orm_1.Model;
exports.Orm = redux_orm_1.ORM;
var OrmFields = {
    attr: redux_orm_1.attr,
    fk: redux_orm_1.fk,
    many: redux_orm_1.many,
    oneToOne: redux_orm_1.oneToOne
};
exports.OrmFields = OrmFields;
//# sourceMappingURL=aliases.js.map