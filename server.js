/* server.js - Express server*/
"use strict";
const log = console.log;
log("Express server");

const express = require("express");
const hbs = require("hbs");

const app = express();
app.use(express.static(__dirname + "/pub"));
app.set("views", (__dirname + "/views"));
app.set("view engine","hbs");
hbs.registerPartials(__dirname + "/views/partials/");
hbs.registerHelper('if_str_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
const layoutDir = "layouts";

app.get("/", (req,res) => {
	res.render(layoutDir + "/main", {layout: "index", title: "MoveIt", css: "main.css", header: false});
});

app.get("/index", (req,res) => {
	res.redirect("/");
});

app.get("/examples", (req, res) => {
	res.render(layoutDir + "/examples", {
		layout: "index",
		title: "MoveIt | Examples",
		css: "examples.css",
		header: true,
		content: req.query.example
	});
});

app.get("/documentation", (req, res) => {
	res.render(layoutDir + "/documentation", {layout: "index", title: "MoveIt | Examples", css: "documentation.css", header: true});
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	log(`Listening on port ${port}...`);
});  // localhost development port 5000  (http://localhost:5000)

