const { createApp } = require("./app");
const { prisma } = require("./prisma");


const app = createApp(prisma);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});