import React from 'react';
import './App.css';
import './style.css';
import GraphVizComponent from "./components/GraphVizComponent.js";
import { BrowserRouter, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import Navbar from './Nav';

function App() { 
  return (
    <div>
      <Navbar />
      <div className="">
        <div className="right">
          <BrowserRouter>
            <div>
              <div id="graphbody">
                <Switch>
                  <HashRouter basename={process.env.PUBLIC_URL}>
                    <Route exact path="/:owner/:project/:id" component={GraphVizComponent} />
                    <Route exact path="/">
                      <Redirect from="/" exact to="/test/test/1"/>
                    </Route>
                  </HashRouter>
                </Switch>
              </div>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </div>

  );
}


export default App;
