const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const Authuser = require("../models/Authuser");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var { requireAuth } = require("../middleware/middleware");
const { checkIfUser } = require("../middleware/middleware");
const { check, validationResult } = require("express-validator");

// Level 2

router.get("*", checkIfUser);

router.get("/signout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});
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
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  async (req, res) => {
    try {
      const objError = validationResult(req);
      if (objError.errors.length > 0) {
        return res.json({ arrValidationError: objError.errors });
      }

      const isCurrentEmail = await Authuser.findOne({ email: req.body.email });
      console.log(isCurrentEmail);
      if (isCurrentEmail) {
        return res.json({ existEmail: "this email already used" });
      }
      const newUser = await Authuser.create(req.body);
      var token = jwt.sign({ id: newUser._id }, "shhhhh");
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({ id: newUser._id });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const loginUser = await Authuser.findOne({ email: req.body.email });
    if (loginUser == null) {
      console.log("this email is not found in DB");
    } else {
      const match = await await bcrypt.compare(
        req.body.password,
        loginUser.password
      );
      if (match) {
        console.log("email found in DB & Password match status:", match);
        var token = jwt.sign({ id: loginUser._id }, "shhhhh");
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.redirect("/home");
      } else {
        console.log("Password match status:", match);
      }
    }
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});
// GET Requst

router.get("/home", requireAuth, userController.user_index_get);

router.get("/edit/:id", requireAuth, userController.user_edit_get);

router.get("/view/:id", requireAuth, userController.user_view_get);

router.post("/search", userController.user_search_post);

// DELETE Request
router.delete("/edit/:id", userController.user_delete);

// PUT Requst
router.put("/edit/:id", userController.user_put);

module.exports = router;
