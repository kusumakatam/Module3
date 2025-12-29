import React, { useReducer } from "react";

const initialState = {
  step: 1,
  isSubmitted: false,
  formData: {
    name: "",
    email: "",
    username: "",
    password: ""
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
      };

    case "NEXT_STEP":
      return { ...state, step: state.step + 1 };

    case "PREVIOUS_STEP":
      return { ...state, step: state.step - 1 };

    case "SUBMIT_FORM":
      return { ...state, isSubmitted: true };

    case "RESET_FORM":
      return initialState;

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, formData, isSubmitted } = state;

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div>
        <h2>Form Submitted</h2>
        <button onClick={() => dispatch({ type: "RESET_FORM" })}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Step {step} of 3</h3>

      {step === 1 && (
        <>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <br />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </>
      )}

      {step === 2 && (
        <>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </>
      )}

      {step === 3 && (
        <>
          <p>Name: {formData.name}</p>
          <p>Email: {formData.email}</p>
          <p>Username: {formData.username}</p>
          <p>Password: {formData.password}</p>
        </>
      )}

      <br />

      {step > 1 && (
        <button onClick={() => dispatch({ type: "PREVIOUS_STEP" })}>
          Back
        </button>
      )}

      {step < 3 && (
        <button onClick={() => dispatch({ type: "NEXT_STEP" })}>
          Next
        </button>
      )}

      {step === 3 && (
        <button onClick={() => dispatch({ type: "SUBMIT_FORM" })}>
          Submit
        </button>
      )}
    </div>
  );
}
