import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapCanvas from '../components/MapCanvas';
import {
  loadMap, newMap, selectTool, showGrid,
  startProposedWall, endProposedWall, commitProposedWall, abortProposedWall,
  undo, redo, saveMap
} from '../actions';
import Map from '../../lib/Map';

@connect(state => ({
  mapResource: state.mapResource,
  workingCopy: state.workingCopy.present,
  proposedWall: state.proposedWall,
  tool: state.view.edit.tool,
  gridShown: state.view.edit.gridShown,
  canUndo: state.workingCopy.history.past.length > 0,
  canRedo: state.workingCopy.history.future.length > 0
}))
export default class Editor extends React.Component {
  componentWillMount() {
    let { dispatch } = this.props;
    // NOTE: Getting mapId from route params seems to circumvent redux but maybe not since routing info is maintained in redux.
    let { mapId } = this.props.params;

    dispatch(
      mapId ? loadMap(mapId) : newMap({ numColumns: 30, numRows: 30 })
    );
  }

  render() {
    let {
      dispatch,
      mapResource,
      workingCopy,
      proposedWall,
      gridShown,
      canUndo,
      canRedo,
      tool
    } = this.props;
    let { mapId } = this.props.params;

    if (workingCopy) {
      let canvasActions = bindActionCreators({
        startProposedWall, endProposedWall, commitProposedWall, abortProposedWall
      }, dispatch);

      let toolNodes = Object.keys(Map.tileTypes).map((typeKey) => {
        let tileType = Map.tileTypes[typeKey];
        let onChange = () => dispatch(selectTool(tileType));
        return (
          <label key={typeKey} style={{ display: 'block' }}>
            <input type="radio" name="tool" value={tileType} checked={ tool === tileType } onChange={onChange} />
            { 'TODO: i18n LABEL: ' + typeKey }
          </label>
        );
      });

      let performSave = () => dispatch(saveMap({
        name: this.refs.name.value,
        data: workingCopy
      }));

      return <div>
        <MapCanvas
          map={workingCopy}
          proposedWall={proposedWall}
          proposedTileType={tool}
          gridShown={gridShown}
          {...canvasActions}
          style={{
            display: 'inline-block'
          }}
        />
        <form style={{
          display: 'inline-block',
          marginLeft: 10,
          verticalAlign: 'top'
        }}>
          <div>
            <input type="text" ref="name" value={mapId} />
          </div>
          <div>
            <label>
              <input type="checkbox"
                checked={gridShown}
                onChange={ (e) => dispatch(showGrid(e.target.checked)) }
              />
              Grid
            </label>
          </div>
          <div>{toolNodes}</div>
          <div>
            <button type="button" disabled={!canUndo} onClick={ () => dispatch(undo()) }>Undo</button>
            <button type="button" disabled={!canRedo} onClick={ () => dispatch(redo()) }>Redo</button>
          </div>
          <div>
            <button type="button"
              disabled={ workingCopy === mapResource.data }
              onClick={ performSave }>Save</button>
          </div>
        </form>
      </div>;
    }
    else if (mapResource.isPending) {
      return <div>Loading...</div>;
    }
    else {
      return <div />;
    }
  }
}
