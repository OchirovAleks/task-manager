
function createProjectStore(){
    const projects = [];

    const getAllProjects = () => [...projects];

    const createProject = (name) => {
        const newProject = {id: projects.length+1, name};
        projects.push(newProject);
        return newProject;
    };

    const deleteProject = (id) => {
        const index = projects.findIndex(project => project.id === id);
        if(index === -1) return false;
        projects.splice(index, 1);
        return true;
    };

    const updateProject = (id, name) => {
        const index = projects.findIndex(project => project.id === id);
        if(index === -1) return false;
        projects[index].name = name;
        return projects[index];
    };

    return {
        getAllProjects,
        createProject,
        deleteProject,
        updateProject
    }
}

module.exports = {createProjectStore};