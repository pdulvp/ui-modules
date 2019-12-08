/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 *
 * This module can be used both on nodeJs server and http client. It defined a http module with GET access
 * based on existing components. 
 * 
 * On NodeJS, it use the http module.
 * On JQuery, it use $.ajax
 */

if (typeof require !== "undefined" && typeof exports === 'object' && typeof module === 'object') { 

	var http = require("http");

	var httpquery = {
		
		getHttp: function(file) {
			return httpquery.request(file.host, file.path, "html");
		},
		
		getFile: function(file) {
			let type = file.type ? file.type : "json";
			return httpquery.request(file.host, file.path, type);
		},
		
		get: function(host, path) {
			return httpquery.request(host, path, "json");
		},
		
		postJson: function(host, path, object) {
			return httpquery.request(host, path, "json", object);
		},
		
		request: function(host, path, kind, object) {
			if (host.startsWith("http://")) {
				host = host.substring(7);
			}
			if (host.startsWith("https://")) {
				host = host.substring(8);
			}
			return new Promise((resolve, reject) => {
				
				var data = undefined; 
				if (object != undefined) {
					data = JSON.stringify(object); //querystring.stringify();
				}
				var options = {
					host: host,
					port: 80,
					path: path,
					method: (data == undefined ? 'GET': 'POST'),
					headers: { }
				};
				if (data != undefined) {
					options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
					options.headers['Content-Length'] = Buffer.byteLength(data);
				}
				
				var req = http.request(options, function(res) {
				    let body = '';
				    res.on('data', function(chunk) {
				    	body += chunk;
				    });
				    res.on('end', function() {
						if (kind == "json") {
							result = JSON.parse(body);
						} else {
							result = body;
						}
						resolve(result);
				    });
					
				}).on('error', function(e) {
					console.log("Got error: " + e.message);
					reject(e);
				});

				if (data != undefined) {
					req.write(data);
				}
				req.end();
			});
		}
	};

	//export to nodeJs
	if(typeof exports === 'object' && typeof module === 'object') {
		module.exports = httpquery;
	}
	
} else if (typeof $ !== "undefined") {
	
	let httpquery = {
		getFile: function(file) {
			return httpquery.get(file.host, file.path);
		},
		
		get: function(host, path) {
			if (host === undefined) {
				host = window.location.origin;
			}
			if (path === undefined && !host.startsWith("http")) {
				path = host;
				host = window.location.origin;
			}
			return new Promise((resolve, reject) => {
				$.ajax({
				  url: `${host}/${path}`,
				  data: null,
				  success: function( result ) {
					resolve(result);
				  },
				  error: function( result ) {
					reject(result);
				  }
				});
			});
		}, 
		post: function(host, path, data) {
			if (host === undefined) {
				host = window.location.origin;
			}
			if (path === undefined && !host.startsWith("http")) {
				path = host;
				host = window.location.origin;
			}
			return new Promise((resolve, reject) => {
				$.ajax({
				  type: "POST",
				  dataType: "json",
				  contentType:"application/json",
				  url: `${host}/${path}`,
				  data: data,
				  success: function( result ) {
					resolve(result);
				  },
				  error: function( result ) {
					reject(result);
				  }
				});
			});
		}
	};

	if (typeof modules === 'object') {
		modules.register("@pdulvp/httpquery", httpquery);
	}
	
} else {
	console.error("module httpquery can't be initialized");
}
