
function createTaskStore() {
    const tasks = [];
    const getAllTasks = () => [...tasks];

    const createTask = (title) => {
        const newTask = { id: tasks.length + 1, title };
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
    return {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask
    }
}

module.exports = { createTaskStore };