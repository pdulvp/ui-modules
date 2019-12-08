/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */
var httpquery = require("@pdulvp/httpquery");
var httpcquery = require("@pdulvp/httpcquery");
var fsquery = require("@pdulvp/fsquery");

var caf = {
	getDataset : function(dataset) {
		return new Promise((resolve, reject) => {
			httpquery.getFile( { "host": "data.caf.fr", "path": `/api/2/rest/package/${dataset}` } ).then(
				function (e) {
					resolve(e);
				});
		});
	},
	
	getResources: function(dataset) {
		return dataset.resources.filter(r => r.format == "CSV");
	},
	
	getResource: function(dataset, resource) {
		console.log(dataset);
		return new Promise((resolve, reject) => {
			httpquery.postJson("data.caf.fr", "/api/3/action/datastore_search", {"resource_id":resource.id,"filters":{},"limit":1,"offset":0} ).then(
			function (e) {
				let total = e.result.total;
				//resolve(e);
				httpquery.postJson("data.caf.fr", "/api/3/action/datastore_search", {"resource_id":resource.id,"filters":{},"limit":total+1,"offset":0} )
					.then(function (e) {
						let result = { "id": resource.id, "data": e.result.records };
						let uriId = httpcquery.getId({ "path": resource.id+"_file" });
						fsquery.write(uriId, JSON.stringify(result))
						
						result = { "id": resource.id, "data": dataset.notes_rendered };
						uriId = httpcquery.getId({ "path": resource.id+"_description" });
						fsquery.write(uriId, JSON.stringify(result))
						
						
//						resolve(e);
					});
			});
		});
	}
};

//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = caf;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/caf", caf);
}

/*
let resourceId = '68d4bb74-a491-4c5d-89ff-4389aa25b48d';
	caf.getResource(resourceId).then(function (e) {
	console.log(e);
});
*/
let dataset = undefined;

/*
dataset = caf.getDataset("http://data.caf.fr/dataset/foyers-allocataires-percevant-l-allocation-de-soutien-familial-asf-par-caf").then(function (dataset) {
	let resources = caf.getResources(dataset);
	//console.log(resources);
	
	//let resourceId = resources[0].id;
	
	caf.getResource(dataset, resources[0]).then(function (e) {
		//console.log(e);
	});
});


dataset = caf.getDataset("foyers-allocataires-percevant-l-allocation-de-rentree-scolaire-ars-par-caf").then(function (dataset) {
	let resources = caf.getResources(dataset);
	
	caf.getResource(dataset, resources[0]).then(function (e) {
		//console.log(e);
	});
});
*/

/*
dataset = caf.getDataset("foyers-allocataires-percevant-les-allocations-familiales-af-par-caf").then(function (dataset) {
	let resources = _caf.getResources(dataset);
	
	caf.getResource(dataset, resources[0]).then(function (e) {
		//console.log(e);
	});
});
*/

/*dataset = caf.getDataset("foyers-allocataires-percevant-le-complement-familial-cf-par-caf").then(function (dataset) {
	let resources = caf.getResources(dataset);
	
	caf.getResource(dataset, resources[0]).then(function (e) {
		//console.log(e);
	});
});
*/


dataset = caf.getDataset("foyers-allocataires-percevant-l-allocation-d-education-de-l-enfant-handicape-aeeh-par-caf").then(function (dataset) {
	let resources = caf.getResources(dataset);
	
	caf.getResource(dataset, resources[0]).then(function (e) {
		//console.log(e);
	});
});

