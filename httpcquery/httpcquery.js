/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 * 
 * This module do same as httpquery but store and read from cache if necessary.
 * On NodeJS, it use the http module.
 * On JQuery, it use $.ajax
 */

if (typeof require !== "undefined" && typeof exports === 'object' && typeof module === 'object') { 

	var fsquery = require("@pdulvp/fsquery");
	var httpquery = require("@pdulvp/httpquery");

	var httpcquery = {
		
		getId: function (filename, cacheInfo) {
			let id = "";
			if (filename.host != undefined) {
				//id += filename.host;
			}
			if (filename.path != undefined) {
				id += filename.path.substring(filename.path.lastIndexOf("/")+1);
			}
			if (filename.object != undefined) {
				id = filename.object["resource_id"];
			}
			id = id.replace(/\//g, '-');
			id = id.replace(/[^\w-\.]/g, '');
			id = "../../../cache/"+id+".json";
			console.log("id of "+filename.path+"="+id);
			return id;
		},
		
		getFile: function(file) {
			return httpcquery.get(file.host, file.path);
		},
		
		get: function(host, path) {
			return new Promise((resolve, reject) => {
				let uri = host+path;
				let uriId = httpcquery.getId( { "host": host, "path": path } );
				if (fsquery.fileExists(uriId)) {
					console.log("[httpcquery] read from cache: "+uri );
						fsquery.read(uriId).then(function (e) {
							let result = JSON.parse(e);
							resolve(result);
						});
				} else {
					httpquery.get(host, path).then(function(res) {
						fsquery.write(uriId, JSON.stringify(res)).then(function (e) {
							console.log("[httpcquery] write to cache: "+uri );
							resolve(res);
						});
					})
				}
			});
		},
		
		postJson: function(host, path, object) {
			return new Promise((resolve, reject) => {
				let uri = host+path;
				let uriId = httpcquery.getId( { "host": host, "path": path, "object": object } );
				if (fsquery.fileExists(uriId)) {
					console.log("[httpcquery] read from cache: "+uri );
						fsquery.read(uriId).then(function (e) {
							let result = JSON.parse(e);
							resolve(result);
						});
				} else {
					httpquery.postJson(host, path, object).then(function(res) {
						fsquery.write(uriId, JSON.stringify(res)).then(function (e) {
							console.log("[httpcquery] write to cache: "+uri );
							resolve(res);
						});
					}).catch('error', function(e) {
					  console.log("Got error: " + e.message);
					  reject(e);
					});
				}
			});
		}
	};

	//export to nodeJs
	if(typeof exports === 'object' && typeof module === 'object') {
		module.exports = httpcquery;
	}
	
	
} else if (typeof $ !== "undefined") {
	
	var httpquery = require("@pdulvp/httpquery");
	
	let httpcquery = {
		getId: function (filename, cacheInfo) {
			let id = "";
			if (filename.host != undefined) {
				//id += filename.host;
			}
			if (filename.path != undefined) {
				id += filename.path.substring(filename.path.lastIndexOf("/")+1);
			}
			if (filename.object != undefined) {
				id = filename.object["resource_id"];
			}
			id = id.replace(/\//g, '-');
			id = id.replace(/[^\w-\.]/g, '');
			id = "/cache/"+id+".json";
			console.log(id);
			return id;
		},
		
		getFile: function(file) {
			return httpcquery.get(file.host, file.path);
		}, 
		
		get: function(host, path) {
			return new Promise((resolve, reject) => {
				let uri = host+(path == undefined?"":path);
				let uriId = httpcquery.getId( { "host": host, "path": path } );
				console.log("[httpcquery] try retrieve: "+uriId );
				
				httpquery.get(uriId).then(function(res) {
					console.log("[httpcquery] retrieve from cache: "+uri );
					resolve(res);
					
				}).catch(function(r) {
						console.log("[httpcquery] error on retrieve cache: "+uri+", fetch: "+host+" "+path );
						httpquery.get(host, path).then(function(res) {
						resolve(res);
					}).catch(function(er) {
						//shall not occurs, since all shall be in cache
						console.log("[httpcquery] error on retrieve source cache: "+uri+", fetch: "+host+" "+path );
						reject(er);
					});
				});
			});
		}
	};

	if (typeof modules === 'object') {
		modules.register("@pdulvp/httpcquery", httpcquery);
	}
	
} else {
	console.error("module httpcquery can't be initialized");
}

/*
httpcquery.get("nd-live.pdul.org", "/data/index.json").then(function (e) {
	console.log("ok");
});
	*/