import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import { render } from 'react-dom';
import { App } from './app.jsx'

render(
  <BrowserRouter>
    <Switch>
      <Route path="/" component={App}/>
    </Switch>
  </BrowserRouter>
, document.getElementById('app'));
