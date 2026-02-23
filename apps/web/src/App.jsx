import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const inputRef = useRef(null);

  const loadProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  const saveTask = async (taskId) => {
    if (taskId === null || !editingTitle.trim()) return;
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle })
    })
    if (!res.ok) return;
    setTasks(prev => prev.map(t => {
      return t.id === taskId ? { ...t, title: editingTitle } : t;
    }));
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const createProject = async () => {
    if (!projectName.trim()) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName }),
    });
    if (!res.ok) return;
    const createdProject = await res.json();
    setProjects(prev => [...prev, createdProject]);
    setProjectName("");
  };

  const deleteTask = async (taskId) => {
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (!res.ok) return;
    setTasks(prev => prev.filter(t => t.id !== taskId))
  };

  const loadTasks = async () => {
    if (selectedProjectId === null) {
      setTasks([]);
      return;
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
  };

  const createTaskInProject = async () => {
    if (selectedProjectId === null) return;
    if (!taskTitle.trim()) return;

    const res = await fetch(`/api/projects/${selectedProjectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskTitle })
    });
    if (!res.ok) return;
    const createdTask = await res.json();
    if (createdTask.projectId === selectedProjectId) {
      setTasks(prev => [...prev, createdTask]);
    }
    setTaskTitle("");
  }

  useEffect(() => {
    loadTasks();
  }, [selectedProjectId]);

  useEffect(() => {
    if (editingTaskId !== null) {
      inputRef.current?.focus();
    }
  }, [editingTaskId]);


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
                  {t.id !== editingTaskId ? (
                    <>
                      <p>{t.title}</p>
                      <button onClick={() => {
                        setEditingTaskId(t.id);
                        setEditingTitle(t.title);
                      }}>Edit</button>
                    </>
                  ) : (
                    <>
                      <input
                        ref={inputRef}
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTask(t.id);
                          if (e.key === "Escape") {
                            setEditingTaskId(null);
                            setEditingTitle("");
                          }
                        }}
                      ></input>
                      <button onClick={() => {
                        saveTask(t.id)
                      }}
                      >Save</button>
                      <button onClick={() => {
                        setEditingTaskId(null);
                        setEditingTitle("");
                      }}>Cancel</button>
                    </>
                  )}
                  {t.id !== editingTaskId && <button onClick={() => {
                    deleteTask(t.id);
                  }}>Delete task</button>}
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
