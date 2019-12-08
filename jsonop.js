/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 * This module can be used both on nodeJs server and http client. 
 *
 * It defines some json manipulation operations
 */
function formatValue(i) {
	return parseInt(i);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
}
let jsonop = {
	
	changeKey: function (array, key) {
		let result = {};
		for (i in array) {
			let nkey = array[i][key];
			result[nkey] = array[i];
		}
		return result;
	},
	
	groupBy: function (array, key, sums, fields) {
		let result = {};
		for (i in array) {
			let nkey = array[i][key];
			if (result[nkey] == undefined) {
				result[nkey] = { "data": [] };
				result[nkey][key]=nkey;
			}
			result[nkey].data.push(array[i]);
			
			if (sums != undefined) {
				for (s in sums) {
					//if array[i][sumKey] is int
					let sumKey = sums[s];
					if (result[nkey][sumKey] == undefined) {
						result[nkey][sumKey] = 0;
					}
					result[nkey][sumKey] += array[i][sumKey];
				}
			}
			if (fields != undefined) {
				for (s in fields) {
					let fieldKey = fields[s];
					result[nkey][fieldKey] = array[i][fieldKey];
				}
			}
		}
		return result;
	}, 
	
	mergeWithKey: function (left, right, key, rightFields) {
		let result = [];
		for (i in left) {
			let item = Object.assign({}, left[i]); //copy
			let element = right[left[i][key]];
			if (rightFields == undefined) {
				Object.assign(item, element);
			} else {
				for (k in rightFields) {
					item[rightFields[k]] = element[k];
				}
			}
			result.push(item);
		}
		return result;
	}, 
	
	addInlineField: function (array, sourceAttribute, targetAttribute, transformation) {
		for (i in array) {
			if ("formatValue" == transformation) {
				array[i][targetAttribute] = formatValue(array[i][sourceAttribute]);
				
			} else if (transformation == undefined) {
				array[i][targetAttribute] = array[i][sourceAttribute];
			}
		}
		return array;
	}, 
	
	filter: function (array, fields, fieldValues) {
		let result = [];
		for (i in array) {
			for (f in fields) {
				let field = fields[f];
				if ("positive" == field.kind) {
					if (array[i][field.field]>0) {
						result.push(array[i]);
					}
				}
				if ("value" == field.kind) {
					let f = array[i][field.field];
					if (fieldValues != undefined && fieldValues[field.field] != undefined && fieldValues[field.field].includes(f)) {
						result.push(array[i]);
					}
				}
			}
		}
		return result;
	}, 
	
	order: function (array, fields) {
		//order based on fields
		//fields is an array of { "fieldName", "kind": "ascending/descending" }
		array.sort(function (a, b) {
			var aValue = 1;
			var bValue = 1;
			for (f in fields) {
				var sens = fields[f].kind == "ascending" ? 1 : -1;
				var field = fields[f].field;
				
				if (a[field] < b[field]) {
					return -1 * sens;
				} else if (a[field] > b[field]) {
					return 1 * sens;
				}
			}
			return 0;
		});
		return array;
	}, 
	
	limit: function (array, start, length) {
		if (start == undefined || start < 0) {
			start = 0;
		}
		if (start >= array.length) {
			return [];
		}
		if (length == undefined || length == -1) {
			length = array.length;
		}
		array = array.slice(start, start+length);
		return array;
	}, 
	
	randomize: function(array, inline) {
		if (inline === false) {
			let copy = [];
			for (i in array) {
				copy[i]=array[i];
			}
			shuffleArray(copy);
			return copy;
		}
		shuffleArray(array);
		return array;
	}, 
	
	toArray: function(array) {
		return Object.values(array);
	}
};


//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = jsonop;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/jsonop", jsonop);
}