/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 * This module can be used both on nodeJs server and http client. 
 *
 * It defines some json manipulation operations
 */
var httpquery = require("@pdulvp/httpquery");
 
let _index = {
	index : null,
	
	getTag: function(index, tagId) {
		return index.tags.find(x => (x.id == tagId));
	},
	getFunction: function(index, functionId) {
		return index.functions[functionId];
	},
	getChart: function(index, chartType) {
		return index.charts.find(x => (x.type == chartType));
	},
	getPage: function(index, pageId) {
		return index.pages.find(x => (x.id == pageId));
	},
	getRenderList: function(index, renderType) {
		return index.renderList.find(x => (x.id == renderType));
	},
	getIndex: function () {
		return new Promise((resolve, reject) => {
			if (_index.index == null) {
				httpquery.get("/data/index.json").then( 
					function( json  ) {
						_index.index = _index.adapt(json); //JSON.parse(json);
						resolve(_index.index);
					});
			} else {
				resolve(_index.index);
			}
		});
	}, 
	
	adaptLanguage: function(obj, language) {
		if (language != undefined) {
			if (obj["name_"+language]) {
				obj["name"]=obj["name_"+language];
			}
			if (obj["description_"+language]) {
				obj["description"]=obj["description_"+language];
			}
			if (obj["title_"+language]) {
				obj["title"]=obj["title_"+language];
			}
		}
	},

	adapt: function(index) {
		let language = "fr";
		if (typeof document !== 'undefined' && document) {
			if (document.location.host.startsWith("fr.")) {
				language = "fr";
			}
			if (document.location.host.startsWith("en.")) {
				language = "en";
			}
		}
		console.log("Set language to: "+language);
		for (let i in index.mainSections) {
			if (index.mainSections[i].icon == undefined && index.mainSections[i].tags != undefined) {
				index.mainSections[i].icon = _index.getTag(index, index.mainSections[i].tags[0]).icon;
			}
			if (index.mainSections[i].tint == undefined && index.mainSections[i].tags != undefined) {
				index.mainSections[i].tint = _index.getTag(index, index.mainSections[i].tags[0]).tint;
			}
			if (index.mainSections[i].page == undefined) {
				index.mainSections[i].page = "mainSection-links";
			}
			_index.adaptLanguage(index.mainSections[i], language);
		}
		for (let i in index.tags) {
			if (index.tags[i].href == undefined ) {
				index.tags[i].href = "/"+index.tags[i].id;
			}
			_index.adaptLanguage(index.tags[i], language);
		}
		
		//Remove invisible articles
		index.data = index.data.filter(function (a) { return a.visible === undefined || a.visible === true } );

		let articles = index.data;
		for (i in articles) {
			let article = articles[i];

			if (article.visible === false) {
				index.data.splice(i, 1);
			}
			if (article.id == undefined) {
				article.id = Utils.uuid();
			}
			if (article.tags == undefined) {
				article.tags = [];
			}
			if (article.icon == undefined && article.tags.length>0) {
				article.icon = _index.getTag(index, article.tags[0]).icon;
			}
			if (article.tint == undefined && article.tags.length>0) {
				article.tint = _index.getTag(index, article.tags[0]).tint;
			}
			if (article.page == undefined) {
				article.page = "simple-article";
			}
			
			_index.adaptLanguage(article, language);
			//article.charts.push({ "id": "source", "type" : "source", "style": "icon-book", "options": [ { "id": "info", "data": [ "" ] } ]});
			
			if (article.charts == undefined) {
				article.charts = [];
			}
			for (c in article.charts) {
				if (article.charts[c].id == undefined) {
					article.charts[c].id = article.charts[c].type;
				}
				let chart = _index.getChart(index, article.charts[c].type);
				
				if (article.charts[c].name == undefined) {
					if (chart != null && chart.name != undefined) {
						article.charts[c].name = chart.name; 
					} 
				}
				if (article.charts[c].displayTitle == undefined) {
					if (chart != null && chart.displayTitle != undefined) {
						article.charts[c].displayTitle = chart.displayTitle; 
					} else {
						article.charts[c].displayTitle = true;
					}
				}
				if (article.charts[c].icon == undefined) {
					if (chart != null && chart.icon != undefined) {
						article.charts[c].icon = chart.icon; 
					}
				}
				if (article.charts[c].module == undefined) {
					if (chart != null && chart.module != undefined) {
						article.charts[c].module = chart.module; 
					}
				}
				if (article.charts[c].options == undefined) {
					article.charts[c].options = [];
				}
				for (o in article.charts[c].options) {
					let opt = article.charts[c].options[o];
					if (opt.function != undefined) {
						console.log("option:"+opt.id);
						
						let fct = _index.getFunction(index, opt.function.id);
						let newOp = JSON.stringify(fct.operations);
						for (p in fct.parameters) {
							let param = fct.parameters[p];
							let value = opt.function.parameters[param];
							newOp = newOp.replace(new RegExp(param, 'g'),value);
						}
						newOp = JSON.parse(newOp);
						let newId = `${opt.source}__function_${opt.function.id}`;
						let newsource = { "sources": [ opt.source ], "operations": newOp, "baseFunction": opt.function.id };
						index.sources[newId]=newsource;
						opt.source = newId;
					}
				}
			}
		}
		
		//add some computed tags
		

		//Les deux articles les plus récents
		articles.sort(function (a,b) { return a.lastUpdated < b.lastUpdated; });
		articles = articles.map(a => a.id);
		
		let news = articles.slice(0,2);
		index.data.filter(a => news.includes(a.id)).forEach(a => a.tags.push("%news%"));
		
		//Prend les autres articles
		let randArticles = articles.slice(2);
		
		//Article du jour. Pick one from random according to today date
		var date1 = new Date();
		date1 = date1.getDay()+date1.getMonth()+date1.getFullYear();
		let iday = (date1+6) % randArticles.length;
		let dayArticle = randArticles.splice(iday, 1);
		
		index.data.filter(a => dayArticle.includes(a.id)).forEach(a => a.tags.push("%daily%"));
		
		/*
		//sort randomly the array of random article, based on today date
		for (i=0; i<randArticles.length; i++) {
			let aday = (date1+i*7) % randArticles.length;
			let bday = (date1+i*13) % randArticles.length;
			var b = randArticles[bday];
			randArticles[bday] = randArticles[aday];
			randArticles[aday] = b;
		}
		*/
		
		console.log(index);
		return index;
	}
};

//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = _index;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/index", _index);
}
