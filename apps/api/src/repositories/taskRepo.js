function createTaskRepo(prisma) {
    const getAll = () => {
        return prisma.task.findMany({
            orderBy: { id: "asc" }
        });
    };

    const createInProject = (title, projectId) => {
        return prisma.task.create({
            data: {
                title,
                project: {
                    connect: { id: projectId }
                }
            }
        })
    };

    const deleteById = (id) => {
        return prisma.task.delete({
            where: { id },
        })
    }
    const updateById = (id, title) => {
        return prisma.task.update({
            where: { id },
            data: { title },
        })
    }
    const findByProject = (projectId) => {
        return prisma.task.findMany({
            where: { projectId },
            orderBy: { id: "asc" }
        });
    };

    return {
        getAll,
        createInProject,
        deleteById,
        updateById,
        findByProject
    };
}

module.exports = { createTaskRepo };