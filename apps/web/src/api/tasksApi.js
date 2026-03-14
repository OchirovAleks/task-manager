import { API_BASE_URL } from "./config";

export async function loadTasks(projectId) {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`);
    if (!res.ok) return null
    return await res.json();
};


export async function createTaskInProject(projectId, title) {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });
    if (!res.ok) return null;
    return await res.json();
}

export async function updateTask(taskId, title) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    })
    if (!res.ok) return null;
    return await res.json();
};

export async function deleteTask(taskId) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, { method: "DELETE" });
    if (!res.ok) return false;
    return true;
};