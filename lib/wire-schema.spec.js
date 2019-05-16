"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_fixture_1 = require("@spec/schema.fixture");
describe('Typed Repository specs', function () {
    var Vod = schema_fixture_1.schema.Vod;
    describe('Vod repository', function () {
        it('should insert and fetch expected vods', function () {
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
    });
});
//# sourceMappingURL=wire-schema.spec.js.map