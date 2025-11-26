const express = require("express");
const app = express();
const port =  process.env.PORT || 3001;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));
const allRoutes = require("./routes/allRoutes.js");
const addUserRoutes = require("./routes/addUser.js");

// auto refresh to apply static file changes CSS, JS, IMG...

//const path = require("path");
//const livereload = require("livereload");
//const liveReloadServer = livereload.createServer();
//liveReloadServer.watch(path.join(__dirname, 'public'));

//const connectLivereload = require("connect-livereload");
//app.use(connectLivereload());

//liveReloadServer.server.once("connection", () => {
//setTimeout(() => {
//liveReloadServer.refresh("/");
// }, 100);
//});


// Database part
mongoose
  .connect(
    "mongodb+srv://yousrike13_db_user:n9dgHsnEiJNT0xP0@cluster0.wezwbsz.mongodb.net/all-data?appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


  app.use(allRoutes);
  app.use("/user/add.html",addUserRoutes);