const router = require("express").Router();
var bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.get("/secret", (req, res) => {
  if (req.headers.authorization) {
    bcrypt.hash(req.headers.authorization, 8, (err, hash) => {
      if (err) {
        return res.status(500).json({ oops: "it broke" });
      } else {
        return res.status(200).json({ hash });
      }
    });
  } else {
    return status(400).json({ error: "missing header" });
  }
});

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(req.body.password, 8);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
