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
    mutationFn: (voteData: any) =>{
      console.log("Submitting vote:", voteData);
      return axios.post("http://localhost:3000/vote", voteData)
    }});

 const handleVote = () => {
    if (!voterName.trim()) {
      alert("Proszę podać swoje imię");
      return;
    }
    const payload = {
      eventId: id,
      voterName,
      votes: Object.entries(votes).map(([date, response]) => ({
        date,
        response,
      })),
    };
    voteMutation.mutate(payload, {
      onSuccess: () => {
        alert("Głos został zapisany pomyślnie!");
      },
      onError: () => {
        alert("Wystąpił błąd podczas zapisywania głosu");
      },
    });
  };

  if (isLoading) return <p>Ładowanie...</p>;
  if (!data) return <p>Nie znaleziono wydarzenia</p>;

   return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="text-center px-8 pt-8 pb-2">
            <div className="mb-2">
              <h2 className="text-2xl font-bold">{data.name}</h2>
            </div>
            <p className="text-base text-gray-600 mb-3">{data.description}</p>
          </div>
          <div className="px-8 pb-8 space-y-6">
            {data.imageUrl && (
              <div className="flex justify-center">
                <img
                  src={data.imageUrl}
                  alt="Ilustracja"
                  className="rounded-lg shadow-md max-w-full h-auto"
                  style={{ maxHeight: 250 }}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="voter-name"
                className="block font-medium text-gray-700 mb-1"
              >
                Twoje imię
              </label>
              <input
                id="voter-name"
                placeholder="Wpisz swoje imię..."
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                className="block border border-gray-300 rounded-md p-2 max-w-md w-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Dostępne terminy</h3>
              <div className="rounded-md border overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="font-semibold p-2 border-b text-left">Data i godzina</th>
                      <th className="font-semibold p-2 border-b text-left">Twój głos</th>
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
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleVote}
                disabled={voteMutation.isPending || !voterName.trim()}
                className={`min-w-32 px-5 py-2 rounded-2xl font-semibold text-white shadow transition ${
                  voteMutation.isPending || !voterName.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {voteMutation.isPending ? "Zapisywanie..." : "Zapisz głos"}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Twoje głosy zostaną zapisane i będą widoczne dla organizatora.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
