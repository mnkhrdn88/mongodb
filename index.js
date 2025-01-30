// const express = require("express");

import express from "express";
import { MongoClient } from "mongodb";
const app = express();
const port = 3000;

const url =
  "mongodb+srv://batmnkhrdn:dYlNifuyakxr9jF0@cluster0.c706r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);

const db = await client.db("sample_mflix");
const collection = await db.collection("movies");

app.get("/", async (req, res) => {
  const movies = await collection
    .find({})
    .project({ title: 1, year: 1, _id: 0 })
    .limit(5)
    .toArray();

  res.send(movies);
});

app.get("/task1", async (req, res) => {
  const { title } = req.query;

  const movie = await collection.findOne({
    title: { $eq: title },
  });

  res.send(movie);
});

app.get("/task2", async (req, res) => {
  const { genre, page, limit } = req.query;

  const movie = await collection

    .find({
      genres: { $eq: genre },
    })
    .project({ genres: 1 })
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .toArray();

  res.send(movie);
});

app.listen(port, async () => {
  await client
    .connect()
    .then(() => {
      console.log("connected To DB");
    })
    .catch((err) => console.log("err", err));

  console.log(`Example app listening on port ${port}`);
});

//dYlNifuyakxr9jF0
