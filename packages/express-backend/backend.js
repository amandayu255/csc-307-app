import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        }
    ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    let result = users["users_list"];

    if (name && job) {
        result = result.filter(user => user.name === name && user.job === job);
    } else if (name) {
        result = result.filter(user => user.name === name);
    } else if (job) {
        result = result.filter(user => user.job === job);
    }

    res.send({ users_list: result });
});

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
};

const addUser = (user) => {
    const id = generateRandomId();
    const userWithId = { ...user, id };
    users.users_list.push(userWithId);
    return userWithId;
};

app.post('/users', (req, res) => {
    const userToAdd = req.body; // Get user data from the request body

    // Validate the incoming data
    if (!userToAdd.name || !userToAdd.job) {
        return res.status(400).send({ error: 'Name and job are required' });
    }

    const id = generateRandomId(); // Generate a random ID
    const newUser = { ...userToAdd, id }; // Create a new user object with ID
    users.users_list.push(newUser); // Add the new user to the list
    res.status(201).send(newUser); // Return the new user with ID
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const initialLength = users["users_list"].length;
    users["users_list"] = users["users_list"].filter(user => user.id !== id);
    users["users_list"] = users["users_list"].filter(user => user.job !== job);

    if (users["users_list"].length === initialLength) {
        return res.status(404).send("User not found.");
    }

    res.status(204).send();
});