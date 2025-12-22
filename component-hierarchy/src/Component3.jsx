import Component4 from "./Component4";

function Component3({ a, b, c, d, e, f }) {
  return (
    <>
      <h4>This is prop a: {a}</h4>
      <h4>This is prop b: {b}</h4>

      <Component4 c={c} d={d} e={e} f={f} />
    </>
  );
}

export default Component3;
