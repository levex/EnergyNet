import React from 'react'

export class Nav extends React.Component {
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
        <li className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#">
            <i className="fa fa-tasks fa-fw"></i>
            <i className="fa fa-caret-down"></i>
          </a>
          <ul className="dropdown-menu dropdown-tasks">
            <li>
              <a href="#">
                <div>
                  <p>
                    <strong>Task 1</strong>
                    <span className="pull-right text-muted">40% Complete</span>
                  </p>
                  <div className="progress progress-striped active">
                    <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{
                        width: "40%"
                      }}>
                      <span className="sr-only">40% Complete (success)</span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <div>
                  <p>
                    <strong>Task 2</strong>
                    <span className="pull-right text-muted">20% Complete</span>
                  </p>
                  <div className="progress progress-striped active">
                    <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{
                        width: "20%"
                      }}>
                      <span className="sr-only">20% Complete</span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <div>
                  <p>
                    <strong>Task 3</strong>
                    <span className="pull-right text-muted">60% Complete</span>
                  </p>
                  <div className="progress progress-striped active">
                    <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{
                        width: "60%"
                      }}>
                      <span className="sr-only">60% Complete (warning)</span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <div>
                  <p>
                    <strong>Task 4</strong>
                    <span className="pull-right text-muted">80% Complete</span>
                  </p>
                  <div className="progress progress-striped active">
                    <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{
                        width: "80%"
                      }}>
                      <span className="sr-only">80% Complete (danger)</span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a className="text-center" href="#">
                <strong>See All Tasks</strong>
                <i className="fa fa-angle-right"></i>
              </a>
            </li>
          </ul>
          {/* /.dropdown-tasks */}
        </li>
        {/* /.dropdown */}
        <li className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#">
            <i className="fa fa-bell fa-fw"></i>
            <i className="fa fa-caret-down"></i>
          </a>
          <ul className="dropdown-menu dropdown-alerts">
            <li>
              <a href="#">
                <div>
                  <i className="fa fa-comment fa-fw"></i>
                  New Comment
                  <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <div>
                  <i className="fa fa-twitter fa-fw"></i>
                  3 New Followers
                  <span className="pull-right text-muted small">12 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <div>
                  <i className="fa fa-envelope fa-fw"></i>
                  Message Sent
                  <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <div>
                  <i className="fa fa-tasks fa-fw"></i>
                  New Task
                  <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <div>
                  <i className="fa fa-upload fa-fw"></i>
                  Server Rebooted
                  <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a className="text-center" href="#">
                <strong>See All Alerts</strong>
                <i className="fa fa-angle-right"></i>
              </a>
            </li>
          </ul>
          {/* /.dropdown-alerts */}
        </li>
        {/* /.dropdown */}
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
    </nav>)
  }
}
