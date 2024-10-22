import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING)
    .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userService.getUsers(name, job)
        .then(usersList => {
            res.send({ users_list: usersList });
        })
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];

    userService.findUserById(id)
        .then(user => {
            if (user) {
                res.send(user);
            } else {
                res.status(404).send("Resource not found.");
            }
        })

});

app.post('/users', (req, res) => {
    const userToAdd = req.body;

    if (!userToAdd.name || !userToAdd.job) {
        return res.status(400).send({ error: 'Name and job are required' });
    }

    userService.addUser(userToAdd)
        .then(newUser => {
            res.status(201).send(newUser);
        })
});

app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    const deletedUser = await userService.findUserByIdAndDelete(id);

    if (!deletedUser) {
        console.log(`User with ID ${id} not found.`);
        return res.status(404).send("User not found.");
    }

    res.status(204).send();
});