import Database from "better-sqlite3";
const db = Database("./db/data.db", { verbose: console.log });

const museums = [
    {
        name:"Vatican Museum",
        city:"Vatican City"
    },
    {
        name:"Van Gogh",
        city:"Amsterdam"
    },
    {
        name:"Acropolis",
        city:"Athens"
    },
    {
        name:"Albertina",
        city:"Vienna"
    }
]


const works = [
    {
        name:"The Creation of Adam",
        pictures:"theCreationOfAdam.jpg",
        museumId:1
    },
    {
        name:"Statue of Laocoon and His Sons",
        pictures:"laocoon.jpg",
        museumId:1
    },
    {
        name:"Self-Portreit",
        pictures:"vincente.jpg",
        museumId:2
    },
    {    
        name:"The Starry Night",
        pictures:"starrynight.jpg",
        museumId:2
    },
    {
        name:"Persian",
        pictures:"persian.jpg",
        museumId:3
    },
    {
        name:"Women In Green Hat",
        pictures:"greenhat.jpg",
        museumId:4
    }
]

const dropAllWorks = db.prepare(`
DROP TABLE IF EXISTS works `);
dropAllWorks.run()

const dropAllMuseum = db.prepare(`
DROP TABLE IF  EXISTS museums`)
dropAllMuseum.run()

const createMuseumsTable = db.prepare(`
 CREATE TABLE IF NOT EXISTS museums (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    PRIMARY KEY (id)

 );
`);

createMuseumsTable.run()

const creatMuseum = db.prepare(`
INSERT INTO museums (name,city) VALUES (@name, @city)`)

for (let museum of museums){
    creatMuseum.run(museum)
}


const createWorksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS works (
    id INTEGER NOT NULL ,
    name TEXT NOT NULL,
    pictures TEXT ,
    museumId INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (museumId) REFERENCES museums (id)
)`
);

createWorksTable.run()

const createWork = db.prepare(`
INSERT INTO works (name, pictures,museumId) VALUES(@name,@pictures,@museumId)`)

for (let work of works){
    createWork.run(work)
}