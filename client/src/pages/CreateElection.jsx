import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const CreateElection = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["Yes", "No"]);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [error, setError] = useState("");

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const addOption = () => setOptions((prev) => [...prev, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/elections", {
        title,
        description,
        options,
        startsAt,
        endsAt
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create election");
    }
  };

  return (
    <div className="card">
      <h2>Create Election</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Options</label>
        {options.map((opt, index) => (
          <input
            key={index}
            value={opt}
            onChange={(e) => updateOption(index, e.target.value)}
            required
          />
        ))}
        <button type="button" className="secondary" onClick={addOption} style={{ marginBottom: "0.75rem" }}>
          + Add option
        </button>

        <label>Starts At</label>
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />

        <label>Ends At</label>
        <input
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className="primary">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateElection;
