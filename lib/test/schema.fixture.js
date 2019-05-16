"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var schema_1 = require("../types/schema");
var wire_schema_1 = require("../wire-schema");
var redux_orm_1 = require("../types/redux-orm");
var Vod = (function (_super) {
    tslib_1.__extends(Vod, _super);
    function Vod() {
        var _this = _super.call(this, 'Vod') || this;
        _this.id = _this.attribute();
        _this.title = _this.attribute();
        _this.links = _this.attribute();
        _this.sources = _this.oneToMany(Source).ref('vod');
        _this.vodId = _this.oneToOne(VodId).ref('vod');
        _this.contents = _this.manyToMany(Content)
            .through(VodContent)
            .ref('vods', 'vod');
        return _this;
    }
    Vod.prototype.reduce = function (action, repository) { };
    return Vod;
}(schema_1.Entity));
exports.Vod = Vod;
var Source = (function (_super) {
    tslib_1.__extends(Source, _super);
    function Source() {
        var _this = _super.call(this, 'Source') || this;
        _this.type = _this.attribute();
        _this.vod = _this.manyToOne(Vod).ref('sources');
        return _this;
    }
    Source.prototype.reduce = function (action, repository) { };
    return Source;
}(schema_1.Entity));
exports.Source = Source;
var VodId = (function (_super) {
    tslib_1.__extends(VodId, _super);
    function VodId() {
        var _this = _super.call(this, 'VodId') || this;
        _this.vod = _this.oneToOne(Vod).virtualRef('vodId');
        return _this;
    }
    return VodId;
}(schema_1.Entity));
exports.VodId = VodId;
var Content = (function (_super) {
    tslib_1.__extends(Content, _super);
    function Content() {
        var _this = _super.call(this, 'Content') || this;
        _this.vods = _this.manyToMany(Vod)
            .through(VodContent)
            .virtualRef('contents', 'content');
        return _this;
    }
    return Content;
}(schema_1.Entity));
exports.Content = Content;
var VodContent = (function (_super) {
    tslib_1.__extends(VodContent, _super);
    function VodContent() {
        var _this = _super.call(this, 'VodContent') || this;
        _this.vod = _this.manyToOne(Vod).noRef();
        _this.content = _this.manyToOne(Content).noRef();
        return _this;
    }
    return VodContent;
}(schema_1.Entity));
exports.VodContent = VodContent;
var schema = wire_schema_1.wireSchema(new redux_orm_1.Orm(), {
    Vod: Vod,
    Source: Source,
    VodId: VodId,
    Content: Content,
    VodContent: VodContent
});
exports.schema = schema;
//# sourceMappingURL=schema.fixture.js.map