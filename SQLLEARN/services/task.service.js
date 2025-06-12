export const taskService = {
  async create(data) {
    await prisma.task.create({
      data: data,
    });
  },
};
