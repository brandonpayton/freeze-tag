import { createAction, handleAction, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

function toPendingActionType(baseType) {
  return baseType + '/PENDING';
}

function toFulfilledActionType(baseType) {
  return baseType + '/FULFILLED';
}

function toErrorActionType(baseType) {
  return baseType + '/ERROR'
}

function createAsyncActionCreator(baseType, payloadCreator) {
	return function createFetchAction() {
		let args = [].slice.call(arguments);

		return dispatch => {
			let promise = payloadCreator.apply(undefined, args);

			dispatch(createAction(toPendingActionType(baseType))());

			promise.then(
				result => dispatch(
					createAction(toFulfilledActionType(baseType))(result)
				),
				error => dispatch(
					createAction(toErrorActionType(baseType))(error)
				)
			);
		};
	};
}

function createAsyncActionReducer(
  baseType,
  { isPending, data, error } = {},
  defaultData = null
) {
  let isPendingReducer = isPending;
  let dataReducer = data;
  let errorReducer = error;

  let pendingHandler = handleActions({
    [toPendingActionType(baseType)]: state => true,
    [toFulfilledActionType(baseType)]: state => false,
    [toErrorActionType(baseType)]: state => false
  }, false);
  let fulfilledHandler = handleActions({
    [toFulfilledActionType(baseType)]: (state, action) => action.payload
  }, defaultData);
  let errorHandler = handleActions({
    [toErrorActionType(baseType)]: (state, action) => action.payload
  }, null);

  return combineReducers({
    isPending: isPendingReducer ? reduceReducers(pendingHandler, isPendingReducer) : pendingHandler,
    data: dataReducer ? reduceReducers(fulfilledHandler, dataReducer) : fulfilledHandler,
    error: errorReducer ? reduceReducers(errorHandler, errorReducer) : errorHandler
  });
}

// TODO: Optimistic updating version
// TODO: Unit tests

export default {
  toPendingActionType,
  toFulfilledActionType,
  toErrorActionType,
	createCreator: createAsyncActionCreator,
	createReducer: createAsyncActionReducer
};