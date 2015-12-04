import { createAction } from 'redux-actions';
import asyncActions from '../lib/async-actions';
import rest from 'rest';
import mime from 'rest/interceptor/mime';
import Map from '../lib/Map';

let client = rest.wrap(mime);

let fetch = path => client({ path }).then(response => response.entity);
let put = (path, entity) => client({
	method: 'PUT',
	path,
	headers: {
		'Content-Type': 'application/json'
	},
	entity
});

export const LOAD_MAP = 'EDIT_LOAD';
export const LIST_MAPS = 'EDIT_LIST_MAPS';
export const SAVE_MAP = 'EDIT_SAVE';
export const NEW_MAP = 'EDIT_NEW_MAP';

export const START_PROPOSED_WALL = 'EDIT_START_PROPOSED_WALL';
export const END_PROPOSED_WALL = 'EDIT_END_PROPOSED_WALL';
export const COMMIT_PROPOSED_WALL = 'EDIT_COMMIT_PROPOSED_WALL';
export const ABORT_PROPOSED_WALL = 'EDIT_ABORT_PROPOSED_WALL';

export const ADD_WALL = 'EDIT_ADD_WALL';
export const REMOVE_WALL = 'EDIT_REMOVE_WALL';
export const UNDO = 'EDIT_UNDO';
export const REDO = 'EDIT_REDO';

export const SHOW_GRID = 'EDIT_SHOW_GRID';
export const SELECT_TOOL = 'EDIT_SELECT_TOOL';

// TODO: Implement promised map listing
export const listMaps = asyncActions.createCreator(LIST_MAPS, () => {
  return fetch('/api/maps').then(mapsData => mapsData.map(({ name, data }) => ({
    name: name,
    map: new Map(data)
  })));
});

// TODO: Implement promised map load
export const loadMap = asyncActions.createCreator(LOAD_MAP, name => {
  return fetch('/api/maps/' + name).then(mapData => new Map(mapData));
});

// TODO: Implement promised map save
export const saveMap = asyncActions.createCreator(SAVE_MAP, ({ name, data }) => put('/api/maps/' + name, data));

export const newMap = createAction(NEW_MAP);

export const startProposedWall = createAction(START_PROPOSED_WALL);
export const endProposedWall = createAction(END_PROPOSED_WALL);
export const commitProposedWall = createAction(COMMIT_PROPOSED_WALL);
export const abortProposedWall = createAction(ABORT_PROPOSED_WALL);

export const addWall = createAction(ADD_WALL);
export const removeWall = createAction(REMOVE_WALL);
export const undo = createAction(UNDO);
export const redo = createAction(REDO);

export const showGrid = createAction(SHOW_GRID);
export const selectTool = createAction(SELECT_TOOL);