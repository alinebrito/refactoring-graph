import React from 'react';
import './App.css';
import './style.css';
import RefGraphComponent from "./components/RefGraphComponent.js";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
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
                  <Route path="/:owner/:project/:id" component={RefGraphComponent}/>
                  <Redirect from="/" exact to="/test/test/1"/>
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
