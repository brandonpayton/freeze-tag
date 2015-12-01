import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapCanvas from '../components/MapCanvas';
import {
  loadMap, newMap, selectTool, startProposedWall, endProposedWall, commitProposedWall, abortProposedWall
} from '../actions';
import Map from '../../lib/Map';

@connect(state => ({
  mapResource: state.mapResource,
  workingCopy: state.workingCopy,
  proposedWall: state.proposedWall,
  tool: state.view.edit.tool
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
    let { dispatch, mapResource, workingCopy, proposedWall, tool } = this.props;
    let { mapId } = this.props.params;

    if (workingCopy) {
      let canvasActions = bindActionCreators({
        startProposedWall, endProposedWall, commitProposedWall, abortProposedWall
      }, dispatch);

      let toolNodes = Object.keys(Map.tileTypes).map((toolName) => {
        let onChange = () => dispatch(selectTool(toolName));
        return (
          <label key={toolName} style={{ display: 'block' }}>
            <input type="radio" name="tool" value={toolName} defaultChecked={ tool === toolName } onChange={onChange} />
            { 'TODO: i18n LABEL: ' + toolName }
          </label>
        );
      });

      return <div>
        <h1>{ mapId }</h1>
        <div>
          <MapCanvas map={workingCopy} proposedWall={proposedWall} proposedTileType={tool} {...canvasActions} style={{
            display: 'inline-block'
          }}/>
          <form style={{
            display: 'inline-block',
            marginLeft: 10,
            verticalAlign: 'top'
          }}>
            <div>{toolNodes}</div>
            <div>
              <button type="button">Undo</button>
              <button type="button">Redo</button>
            </div>
          </form>
        </div>
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
