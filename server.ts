import * as Express from "express";

const server = Express();

server.get("/", (request, response) => {
	response.sendFile("static/home.html", {
		root: __dirname,
	});
});

server.get("/beep", (request, response) => {
	response.sendFile("static/beep.html", {
		root: __dirname
	});
});

server.use(Express.static("static"));
server.listen(process.env.PORT || 3000);