import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const { data } = await API.get("/elections");
        setElections(data);
      } catch (error) {
        console.error("Failed to fetch elections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  if (loading) return <p>Loading elections...</p>;

  if (elections.length === 0) return <p>No elections created yet.</p>;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {elections.map((election) => (
        <div key={election._id} className="card">
          <h3>{election.title}</h3>
          <p style={{ margin: "0.5rem 0" }}>{election.description}</p>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            From {new Date(election.startsAt).toLocaleString()} to{" "}
            {new Date(election.endsAt).toLocaleString()}
          </p>
          <Link to={`/elections/${election._id}`}>
            <button className="primary" style={{ marginTop: "0.75rem" }}>
              View & Vote
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ElectionsList;
