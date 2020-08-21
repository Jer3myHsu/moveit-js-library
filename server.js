/* server.js - Express server*/
"use strict";
const log = console.log;
log("Express server");

const express = require("express");
const hbs = require("hbs");

const app = express();
app.enable('trust proxy');
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
	if (!req.query.page) {
		res.redirect("examples?page=style");
	} else if (["style", "group", "action", "cursor", "weight"].includes(req.query.page)) {
		res.render(layoutDir + "/examples", {
			layout: "index",
			title: "MoveIt | Examples",
			css: "examples.css",
			header: true,
			content: req.query.page
		});
	} else {
		res.status(404).render(layoutDir + "/notFound", {
			layout: "index",
			title: "MoveIt | Page Not Found",
			css: "notFound.css",
			header: true
		});
	}
});

app.get("/examples/email", (req, res) => {
	res.render("email", {title: "MoveIt | Email Page Example"});
});

app.get("/download", (req, res) => {
	res.redirect("https://github.com/csc309-summer-2020/js-library-hsuchi");
});

app.get("/documentation", (req, res) => {
	if (!req.query.page) {
		res.redirect("documentation?page=overview");
	} else if (["overview", "api", "tips"].includes(req.query.page)) {
		res.render(layoutDir + "/documentation", {
			layout: "index",
			title: "MoveIt | Get Started",
			css: "documentation.css",
			header: true,
			content: req.query.page
		});
	} else {
		res.status(404).render(layoutDir + "/notFound", {
			layout: "index",
			title: "MoveIt | Page Not Found",
			css: "notFound.css",
			header: true
		});
	}
});

app.use(function(req, res) {
	res.status(404).render(layoutDir + "/notFound", {
		layout: "index",
		title: "MoveIt | Page Not Found",
		header: true,
		url: req.protocol + "://" + req.get('host')
	});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	log(`Listening on port ${port}...`);
});  // localhost development port 5000  (http://localhost:5000)

