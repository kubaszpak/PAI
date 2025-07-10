import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");

  const createEvent = useMutation({
    mutationFn: (data: any) =>{
      console.log("Creating event with data:", data);
      return axios.post("http://localhost:3000/events", data).then((res) => res.data)
}});

  const handleSubmit = () => {
    createEvent.mutate({
      name: eventName,
      description,
      createdBy: name,
      imageUrl,
      dates,
    });
  };

  return (
    <div className="min-h-screen bg-[#eaf0ff] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Tworzenie wydarzenia</h1>

        <label className="block text-sm font-medium mb-1">Twoje imię *</label>
        <input
          type="text"
          placeholder="Wprowadź swoje imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block text-sm font-medium mb-1">Nazwa wydarzenia *</label>
        <input
          type="text"
          placeholder="Wprowadź nazwę wydarzenia"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block text-sm font-medium mb-1">Opis</label>
        <textarea
          placeholder="Opisz swoje wydarzenie..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded resize-none"
          rows={4}
        />

        <label className="block text-sm font-medium mb-1">Link do zdjęcia</label>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block text-sm font-medium mb-1">Daty wydarzenia *</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={() => {
              if (newDate) {
                setDates([...dates, newDate]);
                setNewDate("");
              }
            }}
            className="px-3 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            +
          </button>
        </div>

        <ul className="mb-4 list-disc list-inside text-sm text-gray-700">
          {dates.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600"
        >
          Utwórz link
        </button>

        {createEvent.data && (
          <div className="mt-4 text-sm text-green-700">
            Twój link do eventu to: <code>{createEvent.data.eventId}</code>
          </div>
        )}
      </div>
    </div>
  );
}
