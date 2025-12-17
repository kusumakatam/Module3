import MessageCard from "./MessageCard";

function App() {
  return (
    <div style={styles.container}>
      <MessageCard
        title="Welcome"
        message="This is your first message card."
      />

      <MessageCard
        title="React Props"
        message="Props help pass data to components."
      />

      <MessageCard
        title="Reusable Components"
        message="Write once, reuse anywhere."
      />

      <MessageCard
        title="Vite + React"
        message="Fast development with modern tooling."
      />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "40px"
  }
};

export default App;
