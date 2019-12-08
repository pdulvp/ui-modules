/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */
var httpquery = require("@pdulvp/httpquery");
var httpcquery = require("@pdulvp/httpcquery");
var fsquery = require("@pdulvp/fsquery");

var an = {
	getPage : function(id) {
		return new Promise((resolve, reject) => {
			httpquery.getHttp( { "host": "www2.assemblee-nationale.fr", "path": `/deputes/fiche/OMC_${id}` } ).then(
				function (e) {
					resolve(e);
				});
		});
	}
};

//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = an;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/an", an);
}

/*
let resourceId = '68d4bb74-a491-4c5d-89ff-4389aa25b48d';
	an.getResource(resourceId).then(function (e) {
	console.log(e);
});
*/
let dataset = an.getPage("PA605036").then(function (e) {
	//console.log(e);
	let r = new RegExp('/static/tribun/(\\d+)/photos/(\\d+.jpg)', 'g');
	var corresp = r.exec(e);
	console.log(corresp[1]);
	console.log(corresp[2]);
});	
