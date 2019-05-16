"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var create_reducer_1 = require("./create-reducer");
var index_1 = require("./index");
var schema_fixture_1 = require("@spec/schema.fixture");
var actions = tslib_1.__importStar(require("@spec/action.fixture"));
var redux_1 = require("redux");
var orm = new index_1.Orm();
var schema = { Content: schema_fixture_1.Content, Source: schema_fixture_1.Source, Vod: schema_fixture_1.Vod, VodContent: schema_fixture_1.VodContent, VodId: schema_fixture_1.VodId };
var session = index_1.register(orm, schema);
var reducers = {
    db: index_1.createReducer(orm)
};
var rootReducer = redux_1.combineReducers(reducers);
var store = create_reducer_1.configureStore(rootReducer);
var insertVod = actions.insertVod, updateVod = actions.updateVod, insertSource = actions.insertSource, deleteSource = actions.deleteSource;
store.dispatch(insertVod({ id: 'vod-1', links: { self: 'v ://vod-1' } }));
store.dispatch(updateVod({ title: 'title-1' }));
store.dispatch(insertSource({ id: 'source-1', type: 'MOVIE', vod: 'vod-1' }));
store.dispatch(insertSource({ id: 'source-2', type: 'MOVIE', vod: 'vod-1' }));
store.dispatch(deleteSource('source-1'));
var vodWithSourcesSelector = function (session) {
    return session.Vod.all()
        .toModelArray()
        .map(function (vodModel) { return (tslib_1.__assign({}, vodModel.ref, { sources: vodModel.sources.toRefArray() })); });
};
var selector = index_1.createSelector(orm, vodWithSourcesSelector);
var format = function (obj) { return JSON.stringify(obj, null, 2); };
var selectResult = selector(store.getState().db);
console.log('selector result:', format(selectResult));
//# sourceMappingURL=index2.js.map