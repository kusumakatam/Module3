import Component6 from "./Component6";

function Component5({ e, f }) {
  return (
    <>
      <h4>This is prop f: {f}</h4>

      <Component6 e={e} />
    </>
  );
}

export default Component5;
