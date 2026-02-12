const express = require("express"); 

const tasksRouter = require('./routes/tasks');


const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});