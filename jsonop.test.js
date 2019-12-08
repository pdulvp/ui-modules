var JsonOp = require("./jsonop");

var JsonOpTests = {
	
	addInlineField: function() {
		var array = [ 
			{ "a": 10, "b": "01",  "id": 1}, 
			{ "a": 10, "b": "02", "id": 2 },
			{ "a": 10, "b": "03",  "id": 3 },
			{ "a": 10, "b": "04",  "id": 4 }
		];
		console.log("addInlineField");
		JsonOp.addInlineField(array, "b", "c", "formatValue");
		console.log(array.map(x => x.c).join("") == "1234");
	},
	
	filter: function() {
		var array = [ 
			{ "a": 10, "b": 1,  "id": 1}, 
			{ "a": 10, "b": -1, "id": 2 },
			{ "a": 10, "b": 2,  "id": 3 },
			{ "a": 10, "b": 3,  "id": 4 }
		];
		let result = "";
		console.log("filter");
		result = JsonOp.filter( array, [ { "field":"b", "kind":"positive"} ] );
		console.log(result.map(x => x.id).join("") == "134");
		console.log(array.map(x => x.id).join("") == "1234");
	},
	
	order: function() {
		var array = [ 
			{ "a": 10, "b": 10, "c": 1,  "id": 1}, 
			{ "a": 10, "b": 10, "c": 20, "id": 2 },
			{ "a": 10, "b": 10, "c": 23, "id": 3 },
			{ "a": 10, "b": 9,  "c": 11, "id": 4 },
			{ "a": 10, "b": 11, "c": 10, "id": 5 },
			{ "a": 9,  "b": 10, "c": 10, "id": 6 },
			{ "a": 11, "b": 11, "c": 1,  "id": 7 },
			{ "a": 11, "b": 10, "c": 10, "id": 8 },
			{ "a": 11, "b": 10, "c": 1,  "id": 9 }
		]; 
		console.log("order");
		JsonOp.order( array, [{ "kind": "ascending", "field": "a" }, { "kind": "ascending", "field": "b" }, { "kind": "ascending", "field": "c" }] );
		console.log(array.map(x => x.id).join(", ") === "6, 4, 1, 2, 3, 5, 9, 8, 7" );

		JsonOp.order( array, [{ "kind": "descending", "field": "a" }, { "kind": "ascending", "field": "b" }, { "kind": "ascending", "field": "c" }] );
		console.log(array.map(x => x.id).join(", ") === "9, 8, 7, 4, 1, 2, 3, 5, 6" );

		JsonOp.order( array, [{ "kind": "descending", "field": "a" }, { "kind": "descending", "field": "b" }, { "kind": "ascending", "field": "c" }] );
		console.log(array.map(x => x.id).join(", ") === "7, 9, 8, 5, 1, 2, 3, 4, 6" );

		JsonOp.order( array, [{ "kind": "descending", "field": "a" }, { "kind": "descending", "field": "b" }, { "kind": "descending", "field": "c" }] );
		console.log(array.map(x => x.id).join(", ") === "7, 8, 9, 5, 3, 2, 1, 4, 6" );

		JsonOp.order( array, [{ "kind": "descending", "field": "a" }, { "kind": "ascending", "field": "b" }, { "kind": "descending", "field": "c" }] );
		console.log(array.map(x => x.id).join(", ") === "8, 9, 7, 4, 3, 2, 1, 5, 6" );

		JsonOp.order( array, [{ "kind": "ascending", "field": "a" }, { "kind": "ascending", "field": "b" }, { "kind": "descending", "field": "c" }] );
		console.log(array.map(x => x.id).join(", ") === "6, 4, 3, 2, 1, 5, 8, 9, 7" );
	}, 
	
	limit: function() {
		var array = [ "a", "b", "c", "d", "e", "f" ]; 
		console.log("limit");
		console.log(JsonOp.limit( array, 0, -1 ).join("") === "abcdef" );
		console.log(JsonOp.limit( array, -1, -1 ).join("") === "abcdef" );
		console.log(JsonOp.limit( array, 10, -1 ).join("") === "" );
		console.log(JsonOp.limit( array, 0, 1 ).join("") === "a" );
		console.log(JsonOp.limit( array, 1, 4 ).join("") === "bcde" );
		console.log(JsonOp.limit( array, 1, 10 ).join("") === "bcdef" );
	}
	
};

JsonOpTests.addInlineField();
JsonOpTests.filter();
JsonOpTests.order();
JsonOpTests.limit();
