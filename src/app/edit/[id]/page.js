"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id;

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState(""); 

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

    if (!title.trim()) {
      setValidationError("Title cannot be empty.");
      return; 
    }

    setValidationError(""); 
    setUpdating(true);
    try {
      await axios.put(`/api/tasks`, { id: taskId, title });
      router.push("/dashboard");
    } catch {
      setError("Failed to update task.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="py-10 text-center text-white">Loading...</p>;

  return (
    <div className="relative z-10 max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Edit Task</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {validationError && <p className="text-red-500 mb-4">{validationError}</p>}

      <form onSubmit={updateTask} className="flex flex-col space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded text-black"
          placeholder="Task title"
        />
        <button
          type="submit"
          className="bg-black border border-white text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          disabled={updating || !title.trim()} 
        >
          {updating ? (
            <FontAwesomeIcon icon={faSpinner} spin className="text-gray-500 text-xl" />
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
}
