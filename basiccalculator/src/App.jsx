import Calculator from "./Calculator";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2>Basic Calculator</h2>
      <Calculator />
    </div>
  );
}

export default App;
