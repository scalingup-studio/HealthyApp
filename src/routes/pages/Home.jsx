import React from "react";

export default function DashboardHome(){
  return (
    <div className="grid" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", gap:16}}>
      <div className="card"><h3 style={{marginTop:0}}>Today</h3><p>Steps: 8,214</p><p>Calories: 1,920 kcal</p></div>
      <div className="card"><h3 style={{marginTop:0}}>Sleep</h3><p>7h 45m last night</p></div>
      <div className="card"><h3 style={{marginTop:0}}>Water</h3><p>1.7 L of 2.0 L goal</p></div>
      <div className="card"><h3 style={{marginTop:0}}>Goal</h3><p>Workout 4x/week</p></div>
    </div>
  );
}


