"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_devtools_extension_1 = require("redux-devtools-extension");
var redux_logger_1 = require("redux-logger");
function configureStore(rootReducer) {
    var logger;
    var stateTransformer = function (state) { return JSON.stringify(state, null, 2); };
    var noopLogger = {
        logger: {
            log: function () { }
        }
    };
    var REDUX_LOGGER = process.env.REDUX_LOGGER;
    logger =
        REDUX_LOGGER === 'OFF'
            ? redux_logger_1.createLogger(noopLogger)
            : redux_logger_1.createLogger({ stateTransformer: stateTransformer });
    var composedEnhancer = redux_devtools_extension_1.composeWithDevTools(redux_1.applyMiddleware(logger));
    return redux_1.createStore(rootReducer, composedEnhancer);
}
exports.configureStore = configureStore;
//# sourceMappingURL=create-reducer.js.map