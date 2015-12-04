import React from 'react';
import { listMaps } from '../actions';
import { pushState } from 'redux-router';
import MapList from '../components/MapList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(state => ({ mapsResource: state.mapsResource }))
export default class Index extends React.Component {

  componentWillMount() {
    this.props.dispatch(listMaps());
  }

  render() {
    const { mapsResource, dispatch } = this.props;
    const actionCreators = bindActionCreators({
      selectMap: id => pushState(null, `/map/${id}`)
    }, dispatch);

    if (mapsResource.isPending) {
      return (
        <div>Loading...</div>
      );
    }
    else if (mapsResource.data) {
      return (
        <div>
          <MapList
            maps={ mapsResource.data }
            selectMap={ id => dispatch(pushState(null, `/map/${id}`)) }
            />
          <button type="button"
            onClick={ () => dispatch(pushState(null, '/map')) }
            >New Map</button>
        </div>
      );
    }
    else if (mapsResource.error) {
      let error = mapsResource.error;

      return (
        <div>Error: {error}</div>
      );
    }
    else {
      return <div />;
    }
  }
}
