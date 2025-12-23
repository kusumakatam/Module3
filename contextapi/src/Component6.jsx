import { useContext } from "react";
import { AppContext } from "./AppContext";

const Component6 = () => {
  const { e } = useContext(AppContext);

  return <h4>This is prop e: {e}</h4>;
};

export default Component6;
