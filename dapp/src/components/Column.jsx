import React from 'react';

const Column = (props) => {
  const panelClass = "panel panel-" + props.color;
  return(
    <div className="col-lg-4 col-md-8">
      <div className={panelClass}>
        <div className="panel-heading">
          <div className="row">
            <div className="col-xs-3">
              <i className={props.icon}/>
            </div>
              {props.content}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Column;