
function createProjectRepo(prisma) {
    const getAll = () => {
        return prisma.project.findMany({
            orderBy: { id: "asc" }
        });
    };

    const create = (name) => {
        return prisma.project.create({
            data: { name },
        })
    };

    const deleteById = (id) => {
      return prisma.project.delete({
        where: { id },
      })
    }
    const updateById = (id, name) => {
      return prisma.project.update({
        where: { id },
        data: { name },
      })
    }
    const findById = (id) => {
      return prisma.project.findUnique({
        where: { id },
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