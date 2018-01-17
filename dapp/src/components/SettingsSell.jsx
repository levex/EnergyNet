import React from "react";

class SettingsSell extends React.Component {

  constructor(props) {
    super(props);
    const contracts = props.contracts;
    const bonds = props.bonds;
    this.state = {
      show: "auto",
    };
  }

  render() {
    const autoBtnClass = this.state.show === "auto" ? "btn btn-primary btn-lg" : "btn btn-default btn-lg";
    const manualBtnClass = this.state.show === "manual" ? "btn btn-primary btn-lg" : "btn btn-default btn-lg";
    const autoEnabled = this.state.show === "auto";
    const manualEnabled = this.state.show === "manual";

    return (
      <div className="col-lg-6">
        <div className="panel panel-default">
          <div className="panel-body">

            <div className="row" style={{margin: "0px 0px 15px 0px"}}>
              <div className="col-lg-2">
                Set price:
              </div>
              <div className="col-lg-2">
                <a href="#" class={autoBtnClass} role="button" onClick={() => {
                  this.setState({
                    show: "auto"
                  });}}>
                  Auto
                </a>
              </div>
              <div className="col-lg-2">
                <a href="#" class={manualBtnClass} role="button" onClick={() => {
                  this.setState({
                    show: "manual"
                  });
                }}>Manual</a>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-body">

                <div className="row" style={{margin: "0px 0px 15px 0px"}}>
                  <label for="basic-url">Minimum unit price</label>
                  <div className="input-group">
                    <input type="text" class="form-control" id="basic-url" aria-describedby="addon1" disabled={autoEnabled}/>
                    <span class="input-group-addon" id="addon1">$/kWh</span>
                  </div>
                </div>

                <div className="row" style={{margin: "0px 0px 15px 0px"}}>
                  <label for="basic-url">Undershoot others by</label>
                  <div className="input-group">
                    <input type="text" class="form-control" id="basic-url" aria-describedby="addon2" disabled={autoEnabled}/>
                    <span class="input-group-addon" id="addon2">%</span>
                  </div>
                </div>

                <div className="row" style={{margin: "0px 0px 15px 0px"}}>
                  <div className="col-lg-2">
                    Calculate price based on:
                  </div>
                  <div className="col-lg-2">
                    <a href="#" class="btn btn-primary btn-sm active" type="button" disabled={autoEnabled}>Average</a>
                  </div>
                  <div className="col-lg-2">
                    <a href="#" class="btn btn-default btn-sm active" type="button" disabled={autoEnabled}>Median</a>
                  </div>
                </div>

              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-body">
                <div className="row" style={{margin: "0px 0px 15px 0px"}}>
                  <label for="basic-url">Unit price</label>
                  <div className="input-group">
                    <input type="text" class="form-control" id="basic-url" aria-describedby="addon3" disabled={manualEnabled}/>
                    <span class="input-group-addon" id="addon3">$/kWh</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row" style={{margin: "0px 0px 15px 0px"}}>
              <button type="button" class="btn btn-primary">Update configuration</button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default SettingsSell;
