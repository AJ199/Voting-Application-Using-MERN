import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const ElectionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [election, setElection] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchElection = async () => {
    try {
      const { data } = await API.get(`/elections/${id}`);
      setElection(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchElection();
  }, [id]);

  if (!election) return <div className="card">Loading...</div>;

  const now = new Date();
  const hasStarted = now >= new Date(election.startsAt);
  const hasEnded = now > new Date(election.endsAt);

  const handleVote = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedOption) {
      setError("Please select an option");
      return;
    }

    try {
      const { data } = await API.post(`/votes/${election._id}`, {
        optionId: selectedOption
      });
      setMessage(data.message);
      await fetchElection(); // refresh counts
    } catch (err) {
      setError(err.response?.data?.message || "Vote failed");
    }
  };

  return (
    <div className="card">
      <h2>{election.title}</h2>
      <p style={{ margin: "0.5rem 0 1rem" }}>{election.description}</p>
      <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.75rem" }}>
        From {new Date(election.startsAt).toLocaleString()} to{" "}
        {new Date(election.endsAt).toLocaleString()}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {hasEnded && <p>This election has ended. Final results:</p>}

      <form onSubmit={handleVote}>
        {election.options.map((option) => (
          <div key={option._id} style={{ marginBottom: "0.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {!hasEnded && hasStarted && user && (
                <input
                  type="radio"
                  name="option"
                  value={option._id}
                  checked={selectedOption === option._id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  style={{ width: "auto", margin: 0 }}
                />
              )}
              <span>{option.text}</span>
              <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#4b5563" }}>
                Votes: {option.votesCount}
              </span>
            </label>
          </div>
        ))}

        {!user && <p style={{ marginTop: "0.5rem" }}>Login to cast your vote.</p>}

        {!hasStarted && <p>Election has not started yet.</p>}
        {hasEnded && <p>Voting is closed.</p>}

        {user && hasStarted && !hasEnded && (
          <button type="submit" className="primary" style={{ marginTop: "0.75rem" }}>
            Submit Vote
          </button>
        )}
      </form>
    </div>
  );
};

export default ElectionDetail;
