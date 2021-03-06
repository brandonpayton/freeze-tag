import asyncActions from '../lib/async-actions';
import { combineReducers } from 'redux';
import { handleAction, handleActions } from 'redux-actions';
import reduceReducers from 'reduce-reducers';
import { routerStateReducer } from 'redux-router';
import undoable from 'redux-undo';
import Map from '../lib/Map';

import {
  LIST_MAPS,
	LOAD_MAP,
	SAVE_MAP,
  NEW_MAP,
  START_PROPOSED_WALL,
  END_PROPOSED_WALL,
  COMMIT_PROPOSED_WALL,
  ABORT_PROPOSED_WALL,
	UNDO,
	REDO,
  SHOW_GRID,
  SELECT_TOOL,
  REFLECT_WINDOW_SIZE
} from './actions';

function normalizeProposedWall(wallPoints) {
  let { start, end } = wallPoints;
  return {
    start,
    end,
    normalizedStart: {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y)
    },
    normalizedEnd: {
      x: Math.max(start.x, end.x),
      y: Math.max(start.y, end.y)
    }
  }
}

const LOAD_MAP_FULFILLED = asyncActions.toFulfilledActionType(LOAD_MAP);

export default combineReducers({
  router: routerStateReducer,
  environment: combineReducers({
    window: handleActions({
      [REFLECT_WINDOW_SIZE]: (state, action) => action.payload
    }, {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    })
  }),
  mapsResource: asyncActions.createReducer(LIST_MAPS),
  mapResource: reduceReducers(
    // Clear the resource state when the route changes so it is reinitialized to the resource default
    handleActions({
      '@@reduxReactRouter/routerDidChange': () => undefined
    }),
    asyncActions.createReducer(LOAD_MAP, {
      data: handleActions({
        [SAVE_MAP]: (state, action) => {
        }
      })
    })
  ),
  workingCopy: undoable(
    handleActions({
      [LOAD_MAP_FULFILLED]: (state, action) => action.payload,
      [NEW_MAP]: (state, action) => new Map(action.payload),
      [COMMIT_PROPOSED_WALL]: (state, action) => {
        // TODO: Move to TypeScript so the contract between payload and updateTiles argument is explicit and checked by the compiler
        let proposal = action.payload;
        return state.updateTiles({
          startPoint: proposal.normalizedStart,
          endPoint: proposal.normalizedEnd,
          tileType: proposal.tileType
        });
      }
    }, null), {
      initTypes: [ '@@redux/INIT', '@@INIT', LOAD_MAP_FULFILLED ],
      filter: (action) => action.type === COMMIT_PROPOSED_WALL,
      undoType: UNDO,
      redoType: REDO
    }
  ),
  proposedWall: handleActions({
    [START_PROPOSED_WALL]: (state, action) => {
      let start = action.payload;
      return normalizeProposedWall({
        start,
        end: start
      });
    },
    [END_PROPOSED_WALL]: (state, action) => {
      let { start } = state;
      return normalizeProposedWall({
        start: start,
        end: action.payload
      });
    },
    [COMMIT_PROPOSED_WALL]: () => null,
    [ABORT_PROPOSED_WALL]: () => null
  }, null),
  view: combineReducers({
    edit: combineReducers({
      gridShown: handleActions({
        [SHOW_GRID]: (state, action) => action.payload
      }, true),
      tool: handleActions({
        [SELECT_TOOL]: (state, action) => action.payload
      }, Map.tileTypes.WALLED_TILE)
    })
  }),
  i18n: handleActions({
    // TODO: Sort out how to actually approach i18n
  }, {
    grid: 'Grid',
    EMPTY_TILE: 'Empty tile',
    WALLED_TILE: 'Wall tile',
    undo: 'Undo',
    redo: 'Redo',
    save: 'Save'
  })
});