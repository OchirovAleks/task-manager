
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


    return {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
        getTasksByProjectId
    }
}

module.exports = { createTaskStore };