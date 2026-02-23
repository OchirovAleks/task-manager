function ProjectsPanel({
    projects,
    projectName,
    setProjectName,
    createProject,
    loadProjects,
    selectedProjectId,
    setSelectedProjectId
}) {
    return (
        <div>
            <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
            />
            <button onClick={createProject}>Create project</button>
            <button onClick={loadProjects}>Load projects</button>

            <h3>Projects</h3>
            <ul>
                {projects.map(p => (
                    <li onClick={() => {
                        setSelectedProjectId(p.id);
                    }} key={p.id}>{p.id === selectedProjectId ? "👉 " : ""}{p.name}</li>
                ))}
            </ul>

        </div>
    )
}

export default ProjectsPanel;