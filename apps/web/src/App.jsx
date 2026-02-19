import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");

  const loadProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };
  const createProject = async () => {
    if (!projectName.trim()) return;

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName }),
    });

    setProjectName("");
    await loadProjects();
  };

  const deleteTask = async (taskId) => {
    const res = await fetch(`/api/tasks/${taskId}`, {method: "DELETE"});
    if (!res.ok) return;
    await loadTasks();
  };

  const loadTasks = async () => {
    if (selectedProjectId === null) {
      setTasks([]);
      return
    };
    const res = await fetch(`/api/projects/${selectedProjectId}/tasks`);
    if (!res.ok) {
      setTasks([]);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setTasks([]);
    }

    setTasks(data)
  };

  const createTaskInProject = async () => {
    if (selectedProjectId === null) return;
    if (!taskTitle.trim()) return;

    await fetch(`/api/projects/${selectedProjectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskTitle })
    })
    setTaskTitle("");
    await loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, [selectedProjectId]);


  return (
    <div>
      <input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Project name"
      />
      <button onClick={createProject}>Create project</button>
      <button onClick={loadProjects}>Load projects</button>

      <ul><h3>Projects</h3>
        {projects.map(p => (
          <li onClick={() => {
            setSelectedProjectId(p.id);
          }} key={p.id}>{p.id === selectedProjectId ? "👉 " : ""}{p.name}</li>
        ))}
      </ul>
      <p>
        {selectedProjectId === null
          ? "No project selected"
          : `Selected: ${selectedProjectId}`}
      </p>
      {selectedProjectId !== null &&
        <div>
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder='Task name'
          />
          <button onClick={createTaskInProject}>Create task</button>
        </div>
      }
      <ul>
        <h3>Tasks</h3>
        {selectedProjectId === null && <p>Select a project</p>}
        {selectedProjectId !== null && tasks.length === 0 &&
          <p>No tasks yet</p>
        }
        {selectedProjectId !== null && tasks.length !== 0 &&
          <div>
            <ul>
              {tasks.map(t => (
                <li key={t.id}>
                  #{t.id} — {t.title} <button onClick={() => deleteTask(t.id)}>Delete task</button>
                </li>
              ))}
            </ul>
          </div>
        }
      </ul>
    </div>
  )
}

export default App
