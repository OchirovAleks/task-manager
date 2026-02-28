import { useRef, useEffect } from "react"
function TasksPanel({
    selectedProjectId,
    tasks,
    taskTitle,
    setTaskTitle,
    createTaskInProject,
    editingTaskId,
    setEditingTaskId,
    editingTitle,
    setEditingTitle,
    updateTask,
    deleteTask
}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (editingTaskId !== null) {
            inputRef.current?.focus();
        }
    }, [editingTaskId]);
    return (
        <div>
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
                                        <span>{t.title}</span>
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
                                                if (e.key === "Enter") upodateTask(t.id);
                                                if (e.key === "Escape") {
                                                    setEditingTaskId(null);
                                                    setEditingTitle("");
                                                }
                                            }}
                                        ></input>
                                        <button onClick={() => {
                                            updateTask(t.id)
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

        </div>
    );
};

export default TasksPanel;