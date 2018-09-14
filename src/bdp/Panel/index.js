import React from 'react';

function Panel(props){
  return (
    <div className="bdp-panel">
      {props.children}
    </div>
  )
}
function PanelHeader(props) {
  return (
    <div className="panel-heading">
      {props.title && <p>{props.title}</p>}
      {props.children}
    </div>
  )
}
function PanelBody(props) {
  return (
    <div className="panel-body">
      {props.children}
    </div>
  )
}
export {Panel,PanelBody,PanelHeader};
