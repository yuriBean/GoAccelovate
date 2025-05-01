"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id;

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/tasks?id=${taskId}`);
        setTitle(res.data.title);
        setLoading(false);
      } catch (err) {
        setError("Failed to load task.");
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const updateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.put(`/api/tasks`, { id: taskId, title });
      router.push("/dashboard");
    } catch {
      setError("Failed to update task.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={updateTask} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          placeholder="Task title"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}
