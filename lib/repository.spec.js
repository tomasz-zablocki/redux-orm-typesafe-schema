"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_fixture_1 = require("@spec/schema.fixture");
var wire_schema_1 = require("./wire-schema");
var redux_orm_1 = require("./types/redux-orm");
describe('Repositories', function () {
    var createSchema = function () {
        return wire_schema_1.wireSchema(new redux_orm_1.Orm(), {
            Vod: schema_fixture_1.Vod,
            Source: schema_fixture_1.Source,
            VodId: schema_fixture_1.VodId,
            Content: schema_fixture_1.Content,
            VodContent: schema_fixture_1.VodContent
        });
    };
    describe('Vod repository', function () {
        it('create with required fields only', function () {
            var Vod = createSchema().Vod;
            Vod.create({
                links: { self: 'http://api/vods/vod-1.html' },
                id: 'vod-1'
            });
            var vod = Vod.withId('vod-1');
            expect(vod).toBeDefined();
            expect(vod.links.self).toEqual('http://api/vods/vod-1.html');
        });
        it('create with optional attribute fields', function () {
            var Vod = createSchema().Vod;
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
            var _a = createSchema(), Vod = _a.Vod, VodId = _a.VodId;
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
            var _a = createSchema(), Vod = _a.Vod, Content = _a.Content, VodContent = _a.VodContent;
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
            var _a = createSchema(), Vod = _a.Vod, Content = _a.Content, VodContent = _a.VodContent;
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
//# sourceMappingURL=repository.spec.js.map