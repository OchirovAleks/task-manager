export async function loadProjects(){
    const res = await fetch("/api/projects");
    if(!res.ok) return null;
    return await res.json();
};

export async function createProject(name){
    const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) return null;
    return await res.json();
};

export async function deleteProject(projectId){
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if(!res.ok) return false;
    return true;
}

export async function updateProject(projectId, name){
    const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    })
    if(!res.ok) return null;
    return await res.json();
}