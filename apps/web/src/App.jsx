import { useState } from 'react';
import { useProjects } from "./hooks/useProjects";
import { useTasks } from "./hooks/useTasks"
import TasksPanel from "./components/TasksPanel"
import ProjectsPanel from "./components/ProjectsPanel";
import './App.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const projectsState = useProjects();
  const tasksState = useTasks(selectedProjectId);

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
      <div>
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
          saveTask={tasksState.saveTask}
          deleteTask={tasksState.deleteTask}
        />
      </div>
    </div>
  )
}

export default App
