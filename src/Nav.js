import React from 'react';
import logo from './logo.svg';

export default () => {
  return (
   <header>
      <div className="navbar navbar-dark bg-dark" >
        <a className="navbar-brand" href="/#"> 
          Refactoring Graph
        </a>
        <div className="justify-content-end">
            <a href="https://github.com/alinebrito/refactoring-graph">
              <img
                width="90" height="25"
                alt="GitHub stars"
                src="https://img.shields.io/github/stars/alinebrito/refactoring-graph?logo=github&style=social"
              />
            </a>
        </div>
      </div>
      <div className="container ">
          <div className="card-body border-0">
            <p className="lead text-center">Data structure to assess refactoring over time. See <a href='https://github.com/alinebrito/refactoring-graph'target="_blank" rel="noopener noreferrer">refactoring-graph </a> repository for more details.
            </p>
          </div>
          <form className="form-inline justify-content-center">
            <div className="form-group mx-sm-3 mb-2 ">
              <label className="sr-only">Password</label>
              <input type="" className="form-control" id="projectform" placeholder="test/test"/>
            </div>
            <button type="submit" title="Plot a random refactoring subgraph"  className="btn btn-dark mb-2"><i className="fas fa-random"></i></button>
          </form>
      </div>
    </header>
  );
};