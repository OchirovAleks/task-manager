
function createProjectRepo(prisma) {
    const getAll = (userId) => {
        return prisma.project.findMany({
            where: {userId},
            orderBy: { id: "asc" }
        });
    };

    const create = (name, userId) => {
        return prisma.project.create({
            data: { name, userId},
        })
    };

    const deleteById = (id, userId) => {
      return prisma.project.deleteMany({
        where: { id, userId },
      })
    }
    const updateById = (id, name, userId) => {
      return prisma.project.updateMany({
        where: { id, userId },
        data: { name },
      })
    }
    const findById = (id, userId) => {
      return prisma.project.findFirst({
        where: { id, userId },
      })
    }

    return {
        getAll,
        create,
        deleteById,
        updateById,
        findById
    };
}

module.exports = {createProjectRepo};