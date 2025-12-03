const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

var { requireAuth } = require("../middleware/middleware");
const { checkIfUser } = require("../middleware/middleware");
const { check, validationResult } = require("express-validator");
const authController = require("../controllers/authController");

// Level 2

router.get("*", checkIfUser);

router.get("/signout", authController.get_signout);

router.get("/login", authController.get_login);

router.get("/signup", authController.get_signup);

router.get("/", authController.get_welcome);
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
  authController.post_signup
);

router.post("/login", authController.post_login);
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
