const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const Authuser = require("../models/Authuser");

// Level 2

router.get("/", (req, res) => {
  res.render("welcome");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

/* 
-----old version
router.post("/signup", (req, res) => {
  Authuser.create(req.body)
    .then((result) => {
      console.log(result);
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });   
}); 
*/
// New version with async await
router.post("/signup", async (req, res) => {
  try {
    const result = await Authuser.create(req.body);
    console.log(result);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});
// GET Requst

router.get("/home", userController.user_index_get);

router.get("/edit/:id", userController.user_edit_get);

router.get("/view/:id", userController.user_view_get);

router.post("/search", userController.user_search_post);

// DELETE Request
router.delete("/edit/:id", userController.user_delete);

// PUT Requst
router.put("/edit/:id", userController.user_put);

module.exports = router;
