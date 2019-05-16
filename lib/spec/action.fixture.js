"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesafe_actions_1 = require("typesafe-actions");
exports.insertVod = typesafe_actions_1.createStandardAction('INSERT_VOD').map(function (vod) { return ({ payload: vod }); });
exports.insertSource = typesafe_actions_1.createStandardAction('INSERT_SOURCE').map(function (source) { return ({ payload: source }); });
exports.deleteSource = typesafe_actions_1.createStandardAction('DELETE_SOURCE').map(function (sourceId) { return ({ payload: sourceId }); });
exports.updateVod = typesafe_actions_1.createStandardAction('UPDATE_VOD').map(function (vod) { return ({ payload: vod }); });
//# sourceMappingURL=action.fixture.js.map