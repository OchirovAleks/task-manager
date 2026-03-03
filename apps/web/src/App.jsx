import { useState, useEffect } from 'react';
import { useProjects } from "./hooks/useProjects";
import { useTasks } from "./hooks/useTasks"
import TasksPanel from "./components/TasksPanel"
import ProjectsPanel from "./components/ProjectsPanel";
import './App.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const projectsState = useProjects();
  const tasksState = useTasks(selectedProjectId);



  const selectedProject = projectsState.projects.find(
    p => p.id === selectedProjectId
  );

  const handleProjectDelete = async (projectId) => {
    const ok = await projectsState.deleteProject(projectId);
    if (!ok) return;

    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  useEffect(() => { projectsState.loadProjects(); }, []);
  return (
    <div >
      <div >
        <div >
          <div>
            <h1 >Task Manager</h1>
            <p >Projects & Tasks MVP</p>
          </div>

          <div >
            {selectedProjectId === null
              ? "No project selected"
              : `Selected: ${selectedProject?.name}`}
          </div>
        </div>

        <div >
          <section >
            <ProjectsPanel
              projects={projectsState.projects}
              projectName={projectsState.projectName}
              setProjectName={projectsState.setProjectName}
              createProject={projectsState.createProject}
              loadProjects={projectsState.loadProjects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              editingName={projectsState.editingName}
              setEditingName={projectsState.setEditingName}
              editingProjectId={projectsState.editingProjectId}
              setEditingProjectId={projectsState.setEditingProjectId}
              deleteProject={projectsState.deleteProject}
              updateProject={projectsState.updateProject}
              handleProjectDelete={handleProjectDelete}
            />
          </section>

          <section >
            <TasksPanel
              selectedProjectId={selectedProjectId}
              tasks={tasksState.tasks}
              taskTitle={tasksState.taskTitle}
              setTaskTitle={tasksState.setTaskTitle}
              createTaskInProject={tasksState.createTaskInProject}
              editingTaskId={tasksState.editingTaskId}
              setEditingTaskId={tasksState.setEditingTaskId}
              editingTitle={tasksState.editingTitle}
              setEditingTitle={tasksState.setEditingTitle}
              updateTask={tasksState.updateTask}
              deleteTask={tasksState.deleteTask}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App
