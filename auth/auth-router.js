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
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({
          you: "can checkout any time you like, but you cannot leave"
        });
      } else {
        res.status(200).json({ bye: "thanks for playing" });
      }
    });
  } else {
    res.status(204);
  }
});

module.exports = router;
