var httpquery = require('@pdulvp/httpquery');
var Index = require('@pdulvp/index');
var Sources = require('@pdulvp/sources');

let _tip = {
	
	formatValue : function(value) {
		if (value == undefined) return 0;
		value = ""+value;
		let result = parseFloat(value.replace(" ", "").replace(" ", "").replace(" ", "").replace(",", ""));
		if (isNaN(result)) {
			return value;
		}
		return result;
	},

	//Returns the value to the given string format.
	formatLabel : function(labelFormat, value) {
		
		let isNumber = false;
		let v = "";
		if (!Array.isArray(value)) {
			value = [value];
			isNumber = true;
		}
		
		v = labelFormat;
		for (let g in value) {
			let format = value[g]; 
			if (isNumber) {
				format = _tip.numberWithCommas(format);
			}
			if ("Fonctionnement" == format) {
				format = "des frais de fonctionnement";
			}
			let tore = "%"+(parseInt(g)+1);
			v = v.replace(tore, format);
		}

		return v;
	},

	numberWithCommas : function(x) {
	  var parts = x.toString().split(".");
	  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	  return parts.join(".");
	},

	getTip : function(data, opt) {
		let fields = opt.fields;
		let labelFormat = opt.labelFormat;
		let labelDescription = opt.labelDescription == null ? null: opt.labelDescription;
		
		const j = Math.floor(Math.random() * (data.length));
		let res = fields.map(x => _tip.formatValue(data[j][x]));
		let res2 = {};
		for (e in fields) {
			res2[fields[e]]=res[e];
		}
		
		let result = {};
		result.message = _tip.formatLabel(labelFormat, res);
		result.fields = res2;
		return result;
	},

	getTips: function(articleId, count, callback) {
		
		Index.getIndex().then(function (index) { 
			let data = index.data;
			
			let article = null;
			if (articleId != undefined) {
				article = data.filter(c => c.id == articleId)[0];
				
			} else {
				let tipableArticles = data.filter(function (article) {
					return article.charts.filter( c => c.type == "tip").length > 0;
				});
				
				const j = Math.floor(Math.random() * (tipableArticles.length));
				article = tipableArticles[j];
				articleId = article.id;
			}
			
			let chartTip = article.charts.filter( c => c.type == "tip")[0];
			const o = Math.floor(Math.random() * (chartTip.options.length));
			let opt = chartTip.options[o];
			
			
			Sources.getSource(index, opt.source).then( function (json) {
				let values = [];
				for (i = 0; i<count; i++) {
					let value = _tip.getTip(json.data, opt);
					value.articleId = articleId;
					values.push(value);
				}
				callback(values);
			});
		})
	}
};

if (typeof require !== "undefined" && typeof exports === 'object' && typeof module === 'object') {
	Sources.verbose = false;
	exports.handler = function(event, context, callback) {
		var articleId = undefined;
		var count = 1;
		if (event.articleId != undefined) {
			articleId = event.articleId;
		}
		if (event.count != undefined) {
			count = parseInt(event.count);
		}
		_tip.getTips(articleId, count, function(result) {
			var response = {
				"statusCode": 200,
				"result": result,
				"headers": {
					"Content-Type": "application/json"
				},
				"isBase64Encoded": false
			};
			callback(null, response);
		});
	};

	/*exports.handler({"articleId": "allocation-de-soutien-familial"}, null, function(e,r) {
		console.log(r);
	});*/
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/tip", tip);
}