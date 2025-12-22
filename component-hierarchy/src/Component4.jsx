import Component5 from "./Component5";

function Component4({ c, d, e, f }) {
  return (
    <>
      <h4>This is prop c: {c}</h4>
      <h4>This is prop d: {d}</h4>

      <Component5 e={e} f={f} />
    </>
  );
}

export default Component4;
