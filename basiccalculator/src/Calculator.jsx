import { useState } from "react";

function Calculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("add");
  const [results, setResults] = useState([]);

  const handleCalculate = () => {
    if (num1 === "" || num2 === "") return;

    const a = Number(num1);
    const b = Number(num2);
    let result;

    if (operation === "add") {
      result = a + b;
    } else if (operation === "subtract") {
      result = a - b;
    } else if (operation === "multiply") {
      result = a * b;
    }

    setResults([...results, result]);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "12px" }}>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter number 1"
          style={{ marginRight: "8px" }}
        />

        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Enter number 2"
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
        </select>
      </div>

      <button onClick={handleCalculate}>
        Perform Action
      </button>

      <div style={{ marginTop: "16px" }}>
        {results.map((res, index) => (
          <div key={index}>Result: {res}</div>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
