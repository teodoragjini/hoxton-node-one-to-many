import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());

app.use(express.json());

const port = 4566;

const getMuseums = db.prepare(`
 SELECT * FROM museums
`);

const getWorksForMuseums = db.prepare(`
 SELECT * FROM works WHERE museumId = @museumId
`);

const getMuseumById = db.prepare(`
 SELECT * FROM museums WHERE id = @id
`);

const getWorks = db.prepare(`
SELECT * FROM works;
`);

const getWorkById = db.prepare(`
 SELECT * FROM works WHERE id = @id
`)

app.get("/museums", (req, res) => {
  const museums = getMuseums.all();

  for (let museum of museums) {
    const works = getWorksForMuseums.all({ museumId: museum.id });
    museum.works = works;
  }
  res.send(museums);
});

app.get("/museums/:id", (req, res) => {
  const museum = getMuseumById.get(req.params);

  if (museum) {
    const works = getWorksForMuseums.all({ museumId: museum.id });
    museum.work = works;

    res.send(museum);
  } else {
    res.status(404).send({ error: "Museum not found!" });
  }
});

app.get("/works", (req, res) => {
  const works = getWorks.all();

  for (let work of works) {
    const museum = getMuseumById.get({ id: work.museumId });
    work.museum = museum;
  }

  res.send(works);
});

app.get("/works/:id", (req, res) => {
    const work = getWorkById.get(req.params);

    if (work) {
        const museum = getMuseumById.all({ id: work.museumId });
        work.museum = museum;
    
        res.send(work);
      } else {
        res.status(404).send({ error: "Museum not found!" });
      }
});

app.listen(port, () => {
  console.log(`Running: htpp://localhost:${port}`);
});
