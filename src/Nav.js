import React from 'react';
import logo from './logo.svg';

export default () => {
  return (
    <header className="navbar navbar-dark bg-dark" >
      <a className="navbar-brand" href="/#">
        <img src={logo} width="40" height="40" alt=""/>
      </a>
      <div className="justify-content-end">
          <a href="https://github.com/alinebrito/refactoring-graph">
            <img
              alt="GitHub stars"
              src="https://img.shields.io/github/stars/alinebrito/refactoring-graph?logo=github&style=social"
            />
          </a>
      </div>
    </header>
  );
};