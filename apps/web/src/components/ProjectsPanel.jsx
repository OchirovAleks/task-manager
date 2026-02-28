import { useRef, useEffect } from "react"
function ProjectsPanel({
    projects,
    projectName,
    setProjectName,
    createProject,
    loadProjects,
    selectedProjectId,
    setSelectedProjectId,
    editingName,
    setEditingName,
    editingProjectId,
    setEditingProjectId,
    deleteProject,
    updateProject,
    handleProjectDelete
}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (editingProjectId !== null) {
            inputRef.current?.focus();
        }
    }, [editingProjectId]);
    return (
        <div>
            <div>
                <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project name"
                />
                <button onClick={createProject}>Create</button>
                <button onClick={loadProjects}>Reload</button>
            </div>

            <h3>Projects</h3>

            {projects.length === 0 ? (
                <p>No projects yet</p>
            ) : (
                <ul>
                    {projects.map(p => (
                        <li
                            key={p.id}
                            onClick={() => setSelectedProjectId(p.id)}
                        >
                            {p.id !== editingProjectId ? (
                                <>
                                    <span>{p.name}</span>
                                    <span> id: {p.id}</span>

                                    <div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingProjectId(p.id);
                                                setEditingName(p.name);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                handleProjectDelete(p.id);
                                                e.stopPropagation();
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <input
                                        ref={inputRef}
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") updateProject(p.id);
                                            if (e.key === "Escape") {
                                                setEditingProjectId(null);
                                                setEditingName("");
                                            }
                                        }}
                                    />

                                    <div>
                                        <button onClick={() => updateProject(p.id)}>
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingProjectId(null);
                                                setEditingName("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProjectsPanel;