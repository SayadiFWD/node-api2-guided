const e = require("express");
const express = require("express");
const { OPEN_READWRITE } = require("sqlite3");
const users = require("./users-model");
const router = express.Router();

router.get("/users", (req, res) => {
  users
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error retrieving the users" });
    });
});

router.get("/users/:id", (req, res) => {
  users
    .findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

router.post("/users", (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.json({
      message: "Missing user name or email",
    });
  }
  users.add(req.body).then((user) => {
    res.status(201).json(user);
  });
});

router.put("/users/:id", (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.json({
      message: "Missing user name or eamil ",
    });
  }
  users
    .update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "the user could not be found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating the user" });
    });
});

router.delete("/users/:id", (req, res) => {
  users
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The user has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

// create endpoint that returns all the posts for a user

router.get("/users/:id/posts", (req, res) => {
  users
    .findUserPosts(req.params.id)
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not get user posts",
      });
    });
});

router.get("/users/:userID/posts/:postID", (req, res) => {
  users
    .findUserPostById(req.params.userID, req.params.postID)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "Could not get user post" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Could not get user post" });
    });
});

router.post("/users/:id/posts", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: "Need a value for text" });
  }
  users
    .addUserPost(req.params.id, req.body)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({ message: "Could not create user post" });
    });
});














// create endpoint that returns a single post for a user

module.exports = router;
