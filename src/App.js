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
          <BrowserRouter>
            <div>
              <div className="container-fluid" id="graph-div">
                <Switch>
                  <HashRouter basename={process.env.PUBLIC_URL}>
                    <Route exact path="/:owner/:project/:id" component={GraphVizComponent} />
                    <Route exact path="/">
                      <Redirect from="/" exact to="/square/okhttp/84"/>
                    </Route>
                  </HashRouter>
                </Switch>
              </div>
            </div>
          </BrowserRouter>
    </div>

  );
}


export default App;
