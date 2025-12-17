function MessageCard({ title, message }) {
  return (
    <div style={styles.card}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "12px 0",
    width: "300px"
  }
};

export default MessageCard;
