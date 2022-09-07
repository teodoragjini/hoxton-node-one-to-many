import express  from "express";
import cors from 'cors'
import Database from "better-sqlite3";


const db = Database("./db/data.db", { verbose: console.log });
const app = express()
app.use(cors())

app.use(express.json())

const port = 4566

