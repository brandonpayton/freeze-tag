import React from 'react';
import { listMaps } from '../actions';
import { pushState } from 'redux-router';
import MapList from '../components/MapList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(state => ({ maps: state.maps }))
export default class Index extends React.Component {

  componentWillMount() {
    this.props.dispatch(listMaps());
  }

  render() {
    const { maps, dispatch } = this.props;
    const actionCreators = bindActionCreators({
      selectMap: id => pushState(null, `/map/${id}`)
    }, dispatch);

    if (maps.isPending) {
      return (
        <div>Loading...</div>
      );
    }
    else if (maps.data) {
      return (
        <div>
          <MapList
            maps={ maps.data }
            selectMap={ id => dispatch(pushState(null, `/map/${id}`)) }
            />
          <button type="button"
            onClick={ () => dispatch(pushState(null, '/map')) }
            >New Map</button>
        </div>
      );
    }
    else if (maps.error) {
      let error = maps.error;

      return (
        <div>Error: {error}</div>
      );
    }
    else {
      return <div />;
    }
  }
}
