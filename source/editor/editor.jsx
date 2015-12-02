import redux from 'redux';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router';
import { Route } from 'react-router';
// TODO: Why is the .jsx extension required for successful resolution?
import Index from './views/Index.jsx';
import Editor from './views/Editor.jsx';
import DevTools from './components/DevTools.jsx';
import configureStore from './configureStore';

let store = configureStore();

ReactDom.render(
  <div>
    <Provider store={store} >
      <ReduxRouter>
        <Route path="/" component={Index} />
        <Route path="/map" component={Editor} />
        <Route path="/map/:mapId" component={Editor} />
      </ReduxRouter>
    </Provider>
    <Provider store={store}>
      <DevTools />
    </Provider>
  </div>,
  document.getElementById('container')
);
