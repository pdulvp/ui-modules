var httpquery = require("./httpquery");

httpquery.get("/data/index.json").then(function(e) {
	console.log(e);
});
