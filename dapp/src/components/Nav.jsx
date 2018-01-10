import React from "react";

class Nav extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (<nav className="navbar navbar-default navbar-static-top" role="navigation" style={{
      marginBottom: 20
    }}>
      <div className="navbar-header">
        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand" href="index.html">EnergyChain beta</a>
      </div>
      {/* /.navbar-header */}

      <ul className="nav navbar-top-links navbar-right">
        Welcome, Daniel
        <li className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#">
            <i className="fa fa-user fa-fw"></i>
            <i className="fa fa-caret-down"></i>
          </a>
          <ul className="dropdown-menu dropdown-user">
            <li>
              <a href="#">
                <i className="fa fa-user fa-fw"></i>
                User Profile</a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-gear fa-fw"></i>
                Settings</a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="login.html">
                <i className="fa fa-sign-out fa-fw"></i>
                Logout</a>
            </li>
          </ul>
          {/* /.dropdown-user */}
        </li>
        {/* /.dropdown */}
      </ul>
      {/* /.navbar-static-side */}
    </nav>);
  }
}

export default Nav;