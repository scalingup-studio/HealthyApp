import React from "react";

export default function DashboardSettings(){
  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Settings</h3>
      <label className="checkbox"><input type="checkbox" defaultChecked /> <span>Enable notifications</span></label>
      <div style={{height:12}} />
      <button className="btn primary" style={{width:220}}>Save changes</button>
    </div>
  );
}


