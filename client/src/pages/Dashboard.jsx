import ElectionsList from "./ElectionsList";

const Dashboard = () => {
  return (
    <div className="card">
      <h2>Active & Upcoming Elections</h2>
      <p style={{ marginBottom: "1rem" }}>
        Browse elections, cast your vote, and see real-time results.
      </p>
      <ElectionsList />
    </div>
  );
};

export default Dashboard;
