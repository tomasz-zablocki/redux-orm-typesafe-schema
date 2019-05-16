"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_orm_1 = require("./types/redux-orm");
exports.createReducer = redux_orm_1.createReducer;
exports.TypedModel = redux_orm_1.TypedModel;
function register(orm, entitySchema) {
    var _a;
    var ormSchema = {};
    for (var k in entitySchema) {
        if (entitySchema.hasOwnProperty(k)) {
            var entity = new entitySchema[k]();
            ormSchema = tslib_1.__assign({}, ormSchema, (_a = {}, _a[k] = createModelClass(entity), _a));
        }
    }
    orm.register.apply(orm, Object.values(ormSchema));
    return sessionRepositories(entitySchema, orm.session(orm.getEmptyState()));
}
exports.register = register;
function isField(value) {
    return (typeof value[1] === 'object' &&
        'fieldType' in value[1] &&
        'virtual' in value[1] &&
        !value[1]['virtual']);
}
function createOrmDescriptor(field) {
    var attr = redux_orm_1.OrmFields.attr, oneToOne = redux_orm_1.OrmFields.oneToOne, fk = redux_orm_1.OrmFields.fk, many = redux_orm_1.OrmFields.many;
    switch (field.fieldType) {
        case 'Attribute':
            return attr({ getDefault: field.supplier });
        case 'OneToOne':
            return oneToOne(new field.to().modelName, field.reverseField);
        case 'ManyToOne':
            return fk(new field.to().modelName, field.reverseField);
        case 'ManyToMany':
            return many({
                to: new field.to().modelName,
                relatedName: field.reverseField,
                through: new field.through().modelName
            });
        default:
            throw Error("undefined redux-orm descriptor for field: " + JSON.stringify(field));
    }
}
function createModelClass(entity) {
    var _a;
    var typedModel = (_a = (function (_super) {
            tslib_1.__extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return class_1;
        }(redux_orm_1.TypedModel)),
        _a.modelName = entity.modelName,
        _a);
    var fields = {};
    Object.entries(entity)
        .filter(isField)
        .filter(function (_a) {
        var field = _a[1];
        return !field.virtual;
    })
        .forEach(function (_a) {
        var key = _a[0], field = _a[1];
        return (fields[key] = createOrmDescriptor(field));
    });
    typedModel.fields = fields;
    typedModel.reducer = function (action, modelClass, session) {
        return entity.reduce(action, modelRepository(entity.entityClass(), modelClass), session);
    };
    return typedModel;
}
function modelRepository(entityClass, modelClass) {
    return modelClass;
}
function sessionRepositories(entitySchema, session) {
    return session;
}
function createSelector(orm, ormSelector) {
    return redux_orm_1.createOrmSelector(orm, ormSelector);
}
exports.createSelector = createSelector;
//# sourceMappingURL=lib.js.map