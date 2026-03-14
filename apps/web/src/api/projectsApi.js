import { API_BASE_URL } from "./config";

export async function loadProjects(){
    const res = await fetch(`${API_BASE_URL}/projects`);
    if(!res.ok) return null;
    return await res.json();
};

export async function createProject(name){
    const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) return null;
    return await res.json();
};

export async function deleteProject(projectId){
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, { method: "DELETE" });
    if(!res.ok) return false;
    return true;
}

export async function updateProject(projectId, name){
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    })
    if(!res.ok) return null;
    return await res.json();
}