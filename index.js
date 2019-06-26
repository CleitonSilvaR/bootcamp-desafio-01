const express = require("express");

const server = express();
server.use(express.json());

const projects = new Array();

let numberOfRequests = 0;

function logRequests(req, res, next) {
  console.log(`Ja foram realizadas ${++numberOfRequests} requisicoes!`);

  return next();
}

function chechProjectExists(req, res, next) {
  const { id } = req.params;
  if (!projects.find(p => p.id === id)) {
    return res.status(400).json({ message: "Projeto nao encontrado!" });
  }

  return next();
}

server.post("/projects", logRequests, (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

server.get("/projects", logRequests, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", logRequests, chechProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", logRequests, chechProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);

  return res.json(projects);
});

server.post(
  "/projects/:id/tasks",
  logRequests,
  chechProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.tasks.push(title);

    return res.json(project);
  }
);

server.listen(3000);
