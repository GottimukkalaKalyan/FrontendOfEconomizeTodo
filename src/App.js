import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./App.css";
import CreateTask from "./component/taskCreator";

function App() {
  const [UserTask, setUserTask] = useState("");
  const [AllTasks, setAllTasks] = useState([]);
  const [taskAdded, setTaskAdded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://economize-son4.onrender.com/getTodos"
        );
        const result = await response.json();
        console.log(result);
        setAllTasks(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    if (taskAdded) {
      // Reload the page
      window.location.reload();
    }
  }, [taskAdded]);

  const enterUserTask = (event) => {
    setUserTask(event.target.value);
  };

  const deleteTodo = async (task) => {
    console.log(task.id);
    const url = "https://economize-son4.onrender.com/deleteTodo";
    const TaskFromUi = {
      id: task.id,
    };
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(TaskFromUi),
    };
    const result = await fetch(url, options);
    const result2 = await result.json();
    console.log(result2);
    setTaskAdded(true);
  };

  const AddTodo = async () => {
    const url = "https://economize-son4.onrender.com/postTodo";
    const TaskFromUi = {
      id: uuidv4(),
      task: UserTask,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(TaskFromUi),
    };
    if (UserTask !== "") {
      const result = await fetch(url, options);
      const result2 = await result.json();
      console.log(result2);
      setTaskAdded(true);
    } else {
      alert("Please Enter Task");
    }
  };

  return (
    <div className="main-container">
      <di className="content-container">
        <div className="task-content-container">
          <div className="header-container">
            <div className="">
              <p className="header-para day-active-para">Saturday, June 1</p>
              <p className="header-para active-tasks-para">
                {AllTasks.length} Active tasks
              </p>
            </div>
            <p className="header-para incomplte">Incomplete Tasks</p>
            <p className="header-para complete">Completed Tasks</p>
          </div>
          <div className="input-task-container">
            <input
              type="text"
              className="input-field"
              placeholder="Enter a task.."
              onChange={enterUserTask}
            />
            <button type="button" className="add-button" onClick={AddTodo}>
              Add Task
            </button>
          </div>
          <hr />
          <ul className="ul-task-data">
            {AllTasks.map((eachTodo) => (
              <CreateTask
                key={eachTodo.id}
                eachTodo={eachTodo}
                deleteTodo={deleteTodo}
              />
            ))}
          </ul>
          {AllTasks.length === 0 && (
            <h1 className="no-tasks-yet">No Tasks Yet</h1>
          )}
        </div>
      </di>
    </div>
  );
}

export default App;
