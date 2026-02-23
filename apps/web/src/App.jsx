import { useState, useEffect, useRef } from 'react';
import { useProjects } from "./hooks/useProjects";
import ProjectsPanel from "./components/ProjectsPanel";
import * as tasksApi from "./api/tasksApi";
import './App.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const inputRef = useRef(null);
  const projectsState = useProjects();


  const loadTasks = async () => {
    if (selectedProjectId === null) {
      setTasks([]);
      return;
    };
    const data = await tasksApi.loadTasks(selectedProjectId);
    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setTasks([]);
    }
  };

  const saveTask = async (taskId) => {
    if (taskId === null || !editingTitle.trim()) return;
    const updatedTask = await tasksApi.saveTask(taskId, editingTitle);
    if (!updatedTask) return;
    setTasks(prev => prev.map(t => {
      return t.id === taskId ? { ...t, title: editingTitle } : t;
    }));
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const deleteTask = async (taskId) => {
    const ok = await tasksApi.deleteTask(taskId);
    if (!ok) return;
    setTasks(prev => prev.filter(t => t.id !== taskId))
  };

  const createTaskInProject = async () => {
    if (selectedProjectId === null) return;
    if (!taskTitle.trim()) return;
    const createdTask = await tasksApi.createTaskInProject(selectedProjectId, taskTitle);
    if (!createdTask) return;
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
      <div>
        <ProjectsPanel
          projects={projectsState.projects}
          projectName={projectsState.projectName}
          setProjectName={projectsState.setProjectName}
          createProject={projectsState.createProject}
          loadProjects={projectsState.loadProjects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
        />
      </div>
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
