"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loadingId, setLoadingId] = useState(null); 
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchTasks = async () => {
        try {
          setLoadingTasks(true); 
          const res = await axios.get("/api/tasks");
          setTasks(res.data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setLoadingTasks(false);
        }
      };
      fetchTasks();
    }
  }, [status]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setErrorMessage("Task cannot be empty.");
      return; 
    }

    setIsAdding(true);
    setErrorMessage(""); 
    try {
      const res = await axios.post("/api/tasks", { title: newTask });
      setTasks((prev) => [res.data, ...prev]);
      setNewTask("");
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteTask = async (id) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Are you sure you want to delete this task?");
      if (!confirmed) return;
    }

    setLoadingId(id);
    await axios.delete(`/api/tasks?id=${id}`);
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setLoadingId(null);
  };

  const navigateToEdit = (id) => {
    setLoadingId(id);
    router.push(`/edit/${id}`);
  };

  if (status === "loading") return <p className="my-10 text-center">Loading...</p>;

  return (
    <div className="relative z-10 max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome, {session?.user?.name}</h1>

      <form onSubmit={addTask} className="flex md:flex-row flex-col gap-2 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 px-4 py-2 border rounded text-black"
        />
        <button
          className="bg-black border border-white text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          disabled={isAdding}
        >
          {isAdding ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            "Add"
          )}
        </button>
      </form>

      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}


      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
      {loadingTasks ? (
        <div className="flex justify-center items-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-gray-600" />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks to show</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center border px-4 py-2 rounded">
              <span>{task.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateToEdit(task.id)}
                  className="text-blue-500"
                  disabled={loadingId === task.id}
                >
                  {loadingId === task.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="text-gray-500 text-xl" />
                  ) : (
                    <FontAwesomeIcon icon={faEdit} className="text-white text-xl" />
                  )}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500"
                  disabled={loadingId === task.id}
                >
                  {loadingId === task.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="text-red-500 text-xl" />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} className="text-red-600 text-xl" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
