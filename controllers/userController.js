const AuthUser = require("../models/userSchema");
var moment = require("moment");
var jwt = require("jsonwebtoken");

const user_index_get = (req, res) => {
  // result ==> array of objects
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
      res.render("index", { arr: result.customerInfo, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_post = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  console.log("*******************************");
  console.log(req.body);
  AuthUser.updateOne({ _id: decoded.id }, { $push: { customerInfo: req.body } })
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_view_get = (req, res) => {
  // result ==> object
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      console.log("===============================");
      console.log(result);
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });

      res.render("user/view", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_edit_get = (req, res) => {
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/edit", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};



const user_delete = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  AuthUser.updateOne(
    { "customerInfo._id": req.params.id },
    { $pull: { customerInfo: { _id: req.params.id } } },
  )
    .then((result) => {
      res.redirect("/home");
      console.log(result);
    })
    // User.deleteOne({ _id: req.params.id })
    // .then((result) => {
    // res.redirect("/home");
    // console.log(result);
    //})
    .catch((err) => {
      console.log(err);
    });
};

const user_add_get = (req, res) => {
  res.render("user/add");
};


const user_put = (req, res) => {
  AuthUser.updateOne({ "customerInfo._id": req.params.id }, {"customerInfo.$": req.body })
    .then((result) => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_search_post = (req, res) => {
  console.log("*******************************");

  const searchText = req.body.searchText.trim();
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
        const searchCustomers=result.customerInfo.filter((item) => {
        return (item.firstName.includes(searchText) || item.lastName.includes(searchText))
      });
      res.render("user/search", { arr: searchCustomers, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  user_index_get,
  user_edit_get,
  user_view_get,
  user_search_post,
  user_delete,
  user_put,
  user_add_get,
  user_post,
};
