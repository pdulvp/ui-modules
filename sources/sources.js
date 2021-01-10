/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 * This module can be used both on nodeJs server and http client. 
 *
 * It defines some json manipulation operations
 */
var httpquery = require("@pdulvp/httpquery");
var JsonOp = require("@pdulvp/jsonop");

let _sources = {
	complete : {}, //list of all completed fetched resources
	pending : {}, //list of all resources currently fetching. they can be reused if second access to the file while it is currently fetching
	
	verbose: true,
	mLog: function (content) {
		if (_sources.verbose) {
			console.log(content);
		}
	},
	
	getFile : function (index, name) {
		if (_sources.pending[name] !== undefined) {
			_sources.mLog("[file] retrieve from pending:"+name);
			return _sources.pending[name];
		}
		let promise = new Promise((resolve, reject) => {
			if (_sources.complete[name] == undefined) {
				httpquery.getFile(index.sources[name].file).then(
				  function( content ) {
					  if (!content.data) {
						  content = { "data": content };
					  }
					let result = { "id" : name, "data" : content.data }
					_sources.complete[name] = result;
					_sources.mLog("[file] store on cache:"+name);
					_sources.pending[name] = undefined;
					resolve( _sources.complete[name]);
				  }
				);
			} else {
				_sources.mLog("[file] retrieve from cache:"+name);
				_sources.pending[name] = undefined;
				resolve(_sources.complete[name]);
			}
		});
		_sources.pending[name] = promise;
		return promise;
	}, 
	
	getSource: function (index, name, fieldValues) {
		
		var transformation = function (arrayOfFiles, resolve) {
			let json = _sources.transform(index, name, arrayOfFiles, fieldValues);
			let byKey = (json.data.length == undefined);
			let result = { "id" : name, "data" : json.data, "byKey" : byKey };
			_sources.mLog("[source] store on cache:"+name);
			_sources.complete[name] = result;
			_sources.pending[name] = undefined;
			resolve(result);
		};
		
		if (_sources.pending[name] !== undefined) {
			_sources.mLog("[source] retrieve from pending:"+name);
			return _sources.pending[name];
		}
		
		let promise = new Promise((resolve, reject) => {
			_sources.mLog("fetch:"+name);
			
			//clear cache if there is some parameters
			if (fieldValues != undefined) {
				_sources.complete[name] = undefined;
			}
			if (index.sources[name] == undefined) {
				reject(`undefined source: ${name}`);
			}
			//If in cache, reuse it.
			if (_sources.complete[name] != undefined) {
				_sources.mLog("[source] retrieve from cache:"+name);
				_sources.pending[name] = undefined;
				resolve(_sources.complete[name]);
			
			//If source is an external url, download it. do also light transformations like addInlineFields
			} else if (index.sources[name].file != undefined) {
				_sources.getFile(index, name).then(x => transformation([x], resolve));
			
			//If it is a computed one from one or severals sources, compute them then create computed source.
			} else if (index.sources[name].sources != undefined) {
				let childs = index.sources[name].sources.map(x => _sources.getSource(index, x));
				return Promise.all(childs).then(x => transformation(x, resolve));
			}
		});
		_sources.pending[name] = promise;
		return promise;
	}, 
	
	getId(name, fieldValues) {
		let a = name;
		if (fieldValues != undefined) {
			for (i in fieldValues) {
				a+="["+i+":"+fieldValues[i]+"]";
			}
		}
		return a;
	},
	transform: function (index, name, sources, fieldValues) {
		
		sources = JsonOp.changeKey(sources, "id");
		
		for (o in index.sources[name].operations) {
			let operation = index.sources[name].operations[o];
			
			let currentSource = operation.source;
			if (currentSource == undefined) {
				currentSource = name;
				if (o == 0) {
					currentSource = index.sources[name].sources[0];
				}
			}
			let currentTarget = operation.target;
			if (currentTarget == undefined) currentTarget = name;
			
			_sources.mLog(name+"-"+operation.type);
			
			if (operation.type == "addInlineField") {
				JsonOp.addInlineField(sources[currentSource].data, operation.sourceAttribute, operation.targetAttribute, operation.transformation);
			
			} else if (operation.type == "changeKey") {
				let tmp = { "id" : currentTarget, "data" : JsonOp.changeKey(sources[currentSource].data, operation.key) };
				sources[currentTarget] = tmp;
			
			} else if (operation.type == "groupBy") {
				let tmp = { "id" : currentTarget, "data" : JsonOp.groupBy(sources[currentSource].data, operation.key, operation.sums, operation.fields) };
				sources[currentTarget] = tmp;
				
			} else if (operation.type == "mergeWithKey") {
				let tmp = { "id" : currentTarget, "data" : JsonOp.mergeWithKey(sources[operation.left.source].data, sources[operation.right.source].data, operation.left.mergeAttribute, operation.right.fields) };
				sources[currentTarget] = tmp;
				
			} else if (operation.type == "filter") {
				if (operation.fieldValues != undefined){
					fieldValues = operation.fieldValues;
				}
				let tmp = { "id" : currentTarget, "data" : JsonOp.filter(sources[currentSource].data, operation.fields, fieldValues) };
				sources[currentTarget] = tmp;
				
			} else if (operation.type == "order") {
				let tmp = { "id" : currentTarget, "data" : JsonOp.order(sources[currentSource].data, operation.fields) };
				sources[currentTarget] = tmp;
				
			} else if (operation.type == "limit") {
				let tmp = { "id" : currentTarget, "data" : JsonOp.limit(sources[currentSource].data, operation.start, operation.limit) };
				sources[currentTarget] = tmp;
				
			} else if (operation.type == "randomize") { 
				let tmp = { "id" : currentTarget, "data" : JsonOp.randomize(sources[currentSource].data, operation.inline) };
				sources[currentTarget] = tmp;
				
			} else if (operation.type == "toArray") { 
				let tmp = { "id" : currentTarget, "data" : JsonOp.toArray(sources[currentSource].data) };
				sources[currentTarget] = tmp;
			}
		}
		
		
		if (sources[name] == undefined) {
			_sources.mLog("error on "+name);
		}
		let result = { "id" : name, "data" : sources[name].data };
		_sources.mLog(result);
		return result;
	}
};


//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = _sources;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/sources", _sources);
}