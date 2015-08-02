import React from 'react';
import baseRest from 'rest';
import mime from 'rest/interceptor/mime';

let rest = baseRest.wrap(mime);

export default class EditorIndex extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      maps: null
    };
  }

  componentWillMount() {
    rest('maps').then(result => result.entity, error => error).then(mapsOrError => {
      this.setState({ maps: mapsOrError });
    });
  }

  render() {
    let { maps } = this.state;

    if (maps === null) {
      return (
        <div>Loading...</div>
      );
    }
    else if (maps instanceof Error) {
      return (
        <div class="error">{maps.toString()}</div>
      );
    }
    else {
      return (
        <div>This many maps: {maps.length}</div>
      );
    }
  }
}
