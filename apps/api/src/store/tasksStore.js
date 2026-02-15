
function createTaskStore() {
    const tasks = [];
    const getAllTasks = () => [...tasks];

    const createTask = (title, projectId = null) => {
        const newTask = { id: tasks.length + 1, title, projectId};
        tasks.push(newTask);
        return newTask;
    };

    const deleteTask = (id) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index === -1) return false;
        tasks.splice(index, 1);
        return true;
    };

    const updateTask = (id, title) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index === -1) return false;
        if (title) tasks[index].title = title;
        return tasks[index];
    };

    const getTasksByProjectId = (projectId) => {
        return tasks.filter(task => task.projectId === Number(projectId));
    }

    const deleteTasksByProjectId = (projectId) => {
        let removed = 0;
        for(let i = tasks.length-1; i >= 0; i--){
            if(tasks[i].projectId === projectId){
                tasks.splice(i, 1);
                removed++
            }
        }
        return removed;
    }

    return {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
        getTasksByProjectId,
        deleteTasksByProjectId
    }
}

module.exports = { createTaskStore };