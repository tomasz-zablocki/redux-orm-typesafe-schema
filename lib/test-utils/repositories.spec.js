"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fixtures_1 = require("./fixtures");
describe('foo', function () {
    it('bar', function () {
        var Vod = fixtures_1.schema.Vod;
        Vod.create({ links: { self: 'selflink' }, id: 'vod-1', title: 'title-1' });
        expect(Vod.withId('vod-1')).toBeDefined();
        expect(Vod.withId('vod-1').title).toBeDefined();
        expect(Vod.withId('vod-1').title).toEqual('title-1');
    });
});
//# sourceMappingURL=repositories.spec.js.map