import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import React,{ useState } from "react";


export default function VotePage() {
  const { id } = useParams();
  const [voterName, setVoterName] = useState("");
  const [votes, setVotes] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => axios.get(`http://localhost:3000/events/${id}`).then(res => res.data),
  });

  const voteMutation = useMutation({
    mutationFn: (voteData: any) =>
      axios.post("http://localhost:3000/vote", voteData),
  });

  const handleVote = () => {
    const payload = {
      eventId: id,
      voterName,
      votes: Object.entries(votes).map(([date, response]) => ({
        date,
        response,
      })),
    };
    voteMutation.mutate(payload);
  };

  if (isLoading) return <p>Ładowanie...</p>;
  if (!data) return <p>Nie znaleziono wydarzenia</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
      <p className="mb-4">{data.description}</p>
      {data.imageUrl && <img src={data.imageUrl} alt="" className="mb-4" />}

      <input
        placeholder="Twoje imię"
        value={voterName}
        onChange={(e) => setVoterName(e.target.value)}
        className="input"
      />

      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th className="border p-2">Data</th>
            <th className="border p-2">Twój głos</th>
          </tr>
        </thead>
        <tbody>
          {data.dates.map((d: any) => (
            <tr key={d.date}>
              <td className="border p-2">{d.date.slice(0, 10)}</td>
              <td className="border p-2">
                <select
                  value={votes[d.date] || ""}
                  onChange={(e) =>
                    setVotes((prev) => ({ ...prev, [d.date]: e.target.value }))
                  }
                  className="input"
                >
                  <option value="">-- wybierz --</option>
                  <option value="yes">Tak</option>
                  <option value="maybe">Może</option>
                  <option value="no">Nie</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleVote} className="btn mt-4">
        Zapisz głos
      </button>
    </div>
  );
}