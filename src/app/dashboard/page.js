"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchTasks = async () => {
        const res = await axios.get("/api/tasks");
        setTasks(res.data);
      };
      fetchTasks();
    }
  }, [status]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const res = await axios.post("/api/tasks", { title: newTask });
    setTasks((prev) => [res.data, ...prev]);
    setNewTask("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks?id=${id}`);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center border px-4 py-2 rounded">
            <span>{task.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/edit/${task.id}`)}
                className="text-blue-500"
              >
                ✏️
              </button>
              <button onClick={() => deleteTask(task.id)} className="text-red-500">
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
