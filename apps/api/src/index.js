const express = require("express"); 

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {

  res.json({ ok: true });

});

const tasks = [
  { id: 1, title: "Learn Express" },
  { id: 2, title: "Build Task Manager" }
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: tasks.length + 1,
    title
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  // Что это: берём id из URL и превращаем в число

  const index = tasks.findIndex(t => t.id === id);
  // Что это: ищем индекс задачи в массиве

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
    // 404 = не найдено
  }

  tasks.splice(index, 1);
  // Что это: удаляем 1 элемент по индексу

  res.status(204).send();
  // 204 = No Content (успешно, но без тела ответа)
});

app.patch('/tasks/:id', (req,res)=>{
    const id = Number(req.params.id);
    const {title} = req.body;


    const index = tasks.findIndex(t => t.id === id);
    
    if(index === -1) {
        return res.status(404).json({ error: "Task not found"});
    }
    if(title){
        tasks[index].title = title;
    }

    res.status(200).json(tasks[index]);
})

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});