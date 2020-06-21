import React from 'react';
import logo from './logo.svg';

export default () => {
  return (
    <header className="navbar navbar-dark bg-dark" >
      <a className="navbar-brand" href="/#">
        <img src={logo} width="45" height="45" alt=""/>
        {/* <i className="fas fa-share-alt"></i> */}
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
    </header>
  );
};