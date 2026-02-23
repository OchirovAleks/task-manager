import * as projectsApi from "../api/projectsApi";
import { useState } from 'react'

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");

    const loadProjects = async () => {
        const data = await projectsApi.loadProjects();
        if (!data) return;
        setProjects(data);
    };

    const createProject = async () => {
        if (!projectName.trim()) return;
        const createdProject = await projectsApi.createProject(projectName);
        if (!createdProject) return;
        setProjects(prev => [...prev, createdProject]);
        setProjectName("");
    };
    return {
        projects,
        projectName,
        setProjectName,
        loadProjects,
        createProject
    }
}