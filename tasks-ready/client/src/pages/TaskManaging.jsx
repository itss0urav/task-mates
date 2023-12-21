import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskManaging = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gettask");
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [tasks]);

  const handleComplete = async (taskId, currentStatus) => {
    // try {
    //   const newStatus = !currentStatus;
    //   await axios.put(`http://localhost:5000/api/updatetask/${taskId}`, {
    //     status: newStatus,
    //   });
    //   setTasks((prevTasks) =>
    //     prevTasks.map((task) =>
    //       task._id === taskId ? { ...task, status: newStatus } : task
    //     )
    //   );
    // } catch (error) {
    //   console.error("Error updating task status:", error);
    // }

    //New code

    try {
      const status = !currentStatus;
      axios
        .put(`http://localhost:5000/api/updatetask/${taskId}`, {
          status,
        })
        .then((res) => {
          console.log("first");
        })
        .catch((error) => console.error("Failed Updating", error));
    } catch (error) {
      console.error("Failed Updating", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/deletetask/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setEditedName(task.name);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/updatetask/${editTask._id}`, {
        name: editedName,
      });
      setEditTask(null);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editTask._id ? { ...task, name: editedName } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditTask(null);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              {editTask && editTask._id === task._id ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <p className={task.status ? "line-through" : ""}>
                    {task.name}
                  </p>
                  <p>Type: {task.type}</p>
                  <p>Assignee: {task.assignee}</p>
                </>
              )}
            </div>
            <div>
              <button
                className={`mr-2 ${
                  task.status
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-green-500 hover:bg-green-700"
                } text-white font-bold py-1 px-2 rounded`}
                onClick={() => handleComplete(task._id, task.status)}
              >
                {task.status ? "Pending" : "Complete"}
              </button>
              <button
                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => handleEdit(task)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManaging;
