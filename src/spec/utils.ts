import { applyMiddleware, createStore, Middleware, Reducer, Store } from 'redux'
import { createLogger, ReduxLoggerOptions } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

export function testType<T>(): T {
  return undefined as any
}

export function configureStore(rootReducer: Reducer): Store<any> {
  let logger: Middleware

  const stateTransformer = (state: any) => JSON.stringify(state, null, 2)

  const noopLogger: ReduxLoggerOptions = {
    logger: {
      log: () => {}
    }
  }

  const { REDUX_LOGGER } = process.env

  logger =
    REDUX_LOGGER === 'OFF'
      ? createLogger(noopLogger)
      : createLogger({ stateTransformer })

  const composedEnhancer = composeWithDevTools(applyMiddleware(logger))

  return createStore(rootReducer, composedEnhancer)
}
