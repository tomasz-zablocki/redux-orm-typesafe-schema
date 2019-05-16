"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var schema_fixture_1 = require("@spec/schema.fixture");
var lib_1 = require("./lib");
var redux_orm_1 = require("./types/redux-orm");
var actions = tslib_1.__importStar(require("@spec/action.fixture"));
var redux_1 = require("redux");
var utils_1 = require("@spec/utils");
var registerSchema = function () {
    return lib_1.register(new redux_orm_1.Orm(), {
        Vod: schema_fixture_1.Vod,
        Source: schema_fixture_1.Source,
        VodId: schema_fixture_1.VodId,
        Content: schema_fixture_1.Content,
        VodContent: schema_fixture_1.VodContent
    });
};
describe('Repositories', function () {
    describe('Vod repository', function () {
        it('create with required fields only', function () {
            var Vod = registerSchema().Vod;
            Vod.create({
                links: { self: 'http://api/vods/vod-1.html' },
                id: 'vod-1'
            });
            var vod = Vod.withId('vod-1');
            expect(vod).toBeDefined();
            expect(vod.links.self).toEqual('http://api/vods/vod-1.html');
        });
        it('create with optional attribute fields', function () {
            var Vod = registerSchema().Vod;
            Vod.create({
                links: { self: 'http://api/vods/vod-1.html' },
                id: 'vod-1',
                title: 'title-1'
            });
            var vod = Vod.withId('vod-1');
            expect(vod).toBeDefined();
            expect(vod.title).toBeDefined();
            expect(vod.title).toEqual('title-1');
        });
        it('create with optional one-to-one relation fields', function () {
            var _a = registerSchema(), Vod = _a.Vod, VodId = _a.VodId;
            VodId.create({
                id: 'root-id'
            });
            Vod.create({
                links: { self: 'http://api/vods/vod-1.html' },
                id: 'vod-1',
                vodId: 'root-id'
            });
            var vod = Vod.withId('vod-1');
            expect(vod).toBeDefined();
            expect(vod.vodId).toBeDefined();
            expect(vod.vodId.vod.id).toEqual('vod-1');
        });
        it('create many-to-many relations using models', function () {
            var _a = registerSchema(), Vod = _a.Vod, Content = _a.Content, VodContent = _a.VodContent;
            Vod.create({
                links: { self: 'http://api/vods/vod-1.html' },
                id: 'vod-1',
                vodId: 'root-id'
            });
            Content.create({ id: 'content-1', type: 'MOVIE' });
            Content.create({ id: 'content-2', type: 'PREVIEW' });
            var vod = Vod.withId('vod-1');
            if (!vod)
                throw 'vod missing';
            Content.all()
                .toModelArray()
                .forEach(function (content) { return vod.contents.add(content); });
            var vodContents = VodContent.all();
            expect(vodContents).toBeDefined();
            expect(vodContents.toModelArray()).toHaveLength(2);
        });
        it('create many-to-many relations using id', function () {
            var _a = registerSchema(), Vod = _a.Vod, Content = _a.Content, VodContent = _a.VodContent;
            Vod.create({
                links: { self: 'http://api/vods/vod-1.html' },
                id: 'vod-1',
                vodId: 'root-id'
            });
            Content.create({ id: 'content-1', type: 'MOVIE' });
            Content.create({ id: 'content-2', type: 'PREVIEW' });
            var vod = Vod.withId('vod-1');
            if (!vod)
                throw 'vod missing';
            vod.contents.add('content-1');
            vod.contents.add('content-2');
            var vodContents = VodContent.all();
            expect(vodContents).toBeDefined();
            expect(vodContents.toModelArray()).toHaveLength(2);
        });
    });
});
describe('Selectors', function () {
    it('should select expected data', function () {
        var orm = new redux_orm_1.Orm();
        var session = lib_1.register(orm, {
            Vod: schema_fixture_1.Vod,
            Source: schema_fixture_1.Source,
            VodId: schema_fixture_1.VodId,
            Content: schema_fixture_1.Content,
            VodContent: schema_fixture_1.VodContent
        });
        var insertVod = actions.insertVod, updateVod = actions.updateVod, insertSource = actions.insertSource, deleteSource = actions.deleteSource;
        var reducers = {
            db: lib_1.createReducer(orm)
        };
        var rootReducer = redux_1.combineReducers(reducers);
        var store = utils_1.configureStore(rootReducer);
        var selector = lib_1.createSelector(orm, function (session) {
            return session.Vod.all()
                .toModelArray()
                .map(function (vodModel) { return (tslib_1.__assign({}, vodModel.ref, { sources: vodModel.sources.toRefArray() })); });
        });
        store.dispatch(insertVod({ id: 'vod-1', links: { self: 'v ://vod-1' } }));
        store.dispatch(updateVod({ title: 'title-1' }));
        store.dispatch(insertSource({ id: 'source-1', type: 'MOVIE', vod: 'vod-1' }));
        store.dispatch(insertSource({ id: 'source-2', type: 'MOVIE', vod: 'vod-1' }));
        store.dispatch(insertSource({ id: 'source-3', type: 'MOVIE', vod: 'vod-1' }));
        store.dispatch(deleteSource('source-1'));
        var selectResult = selector(store.getState().db);
        expect(selectResult).toBeDefined();
        expect(selectResult).toHaveLength(1);
        expect(selectResult[0].links.self).toEqual('v ://vod-1');
        expect(selectResult[0].sources).toHaveLength(2);
    });
});
//# sourceMappingURL=lib.spec.js.map