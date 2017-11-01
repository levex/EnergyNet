import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import { render } from 'react-dom';
import { App } from './app.jsx'
import { Trade } from './trade.jsx'

render(
  <BrowserRouter>
    <Switch>
      <Route path="/" component={App}/>
      <Route path="/trade" component={Trade}/>
    </Switch>
  </BrowserRouter>
, document.getElementById('app'));
