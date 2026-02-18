import { useState } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);

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

  const loadTasks = async () => {
    if(!selectedProjectId) return;

    const res = await fetch(`/api/projects/${selectedProjectId}/tasks`);
    const data = await res.json();

    setTasks(data)
  };


  return (
    <div>
      <input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Project name"
      />
      <button onClick={createProject}>Create project</button>
      <button onClick={loadProjects}>Load projects</button>

      <ul>
        {projects.map(p => (
          <li onClick={() => setSelectedProjectId(p.id)} key={p.id}>{p.name}</li>
        ))}
      </ul>
      <p>
        {selectedProjectId === null
          ? "No project selected"
          : `Selected: ${selectedProjectId}`}
      </p>
    </div>
  )
}

export default App
