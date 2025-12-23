import { AppContext } from "./AppContext";
import Component2 from "./Component2";

const Component1 = () => {
  const contextValues = {
    a: "A",
    b: "B",
    c: "C",
    d: "D",
    e: "E",
    f: "F"
  };

  return (
    <AppContext.Provider value={contextValues}>
      <Component2 />
    </AppContext.Provider>
  );
};

export default Component1;
