import React from 'react';
import Router from 'react-router';
// TODO: Why is the .jsx extension required for successful resolution?
import EditorIndex from './EditorIndex.jsx';
import MapEditor from './MapEditor.jsx';

let { DefaultRoute, HashLocation, NotFoundRoute, Route, RouteHandler } = Router;

class Editor extends React.Component {
  render() {
    return (
      <RouteHandler/>
    );
  }
}

let routes = (
  <Route handler={Editor}>
    <DefaultRoute handler={EditorIndex} />
    <Route name="create-map" path="/map" handler={MapEditor} />
    <Route name="edit-map" path="/map/:id" handler={MapEditor} />
  </Route>
);

Router.run(routes, HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});
