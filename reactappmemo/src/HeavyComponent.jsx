import React from "react";

function HeavyComponent() {
  console.log("🔥 HeavyComponent rendered");

  
  let total = 0;
  for (let i = 0; i < 100000000; i++) {
    total += i;
  }

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
      <h3>Heavy Component</h3>
      <p>This component is heavy and should render only once.</p>
    </div>
  );
}


export default React.memo(HeavyComponent);
