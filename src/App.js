import React from 'react';
import './App.css';
import './style.css';
import RefGraphComponent from "./components/RefGraphComponent.js";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
                  <Route path="/:owner" component={RefGraphComponent} />
                  <Route path="/:owner/:project" component={RefGraphComponent} />
                  <Route path="/" component={RefGraphComponent} />
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
