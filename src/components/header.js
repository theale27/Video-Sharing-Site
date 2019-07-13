import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <header>
        {/*         <img className="logo" /> */}
        <a href="/" className="logo">
          Home
        </a>
        <div className="search">
          <input type="text" placeholder="Search" />
          <button>
            <i className="material-icons md-light">search</i>
          </button>
        </div>
        <div className="menu">
          <button>
            <i className="material-icons md-light">menu</i>
          </button>
        </div>
      </header>
    );
  }
}

export default Header;
