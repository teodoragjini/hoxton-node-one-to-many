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
`);

const creatMuseum = db.prepare(`
INSERT INTO museums (name,city) VALUES (@name, @city)`);

const createWork = db.prepare(`
INSERT INTO works (name, pictures,museumId) VALUES (@name,@pictures,@museumId)`);

const deletWork = db.prepare(`
DELETE FROM works WHERE id = @id
`);

const deleteWorkMuseum = db.prepare(`
 DELETE FROM museums WHERE museumId= @museumId
`);

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

app.post("/museums", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("Name not given or not a string!");
  }

  if (typeof req.body.city !== "string") {
    errors.push("City not given or not a string!");
  }

  if (errors.length === 0) {
    const info = creatMuseum.run(req.body);
    const museum = getMuseumById.get({ id: info.lastInsertRowid });
    const works = getWorksForMuseums.all({ museumId: museum.id });
    museum.works = works;
    res.send(museum);
  } else {
    res.status(400).send({ errors });
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

app.post("/works", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("Name not given or not a string!");
  }

  if (typeof req.body.pictures !== "string") {
    errors.push("Pictures not given or not a string!");
  }

  if (typeof req.body.museumId !== "number") {
    errors.push("MuseumId not given or not a number!");
  }

  if (errors.length === 0) {
    const museum = getMuseumById.get({ id: req.body.museumId });
    if (museum) {
      const info = createWork.run(req.body);
      const work = getWorkById.get({ id: info.lastInsertRowid });

      work.museum = museum;
      res.send(work);
    } else {
      res.status(400).send({
        error: "You are creating a work for an museum that does not exist.",
      });
    }
  } else {
    res.status(400).send({ errors });
  }
});

app.delete("/works/:id", (req, res) => {
  const id = req.params.id;
  deleteWorkMuseum.run(id);
  const info = deletWork.run(id);

  if (info.changes > 0) {
    res.status(404).send({ error: "Work not found!" });
  } else {
    res.send({ message: "Work deleted!" });
  }
});

app.listen(port, () => {
  console.log(`Running: htpp://localhost:${port}`);
});
