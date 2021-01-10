var Sources = require("./sources");
var Index = require("../pdulvp-index/index");

var SourcesTest = {

};
Index.getIndex().then(function(index) {
	Sources.verbose = false;
	
	console.log(`Check sources`);
	for (sourceId in index.sources) {
		let source = index.sources[sourceId];
		Sources.getSource(index, sourceId, undefined).then(function(e) {
			if (e.byKey == false) {
				if (e.data == undefined || e.data.length == 0) {
					console.log(`[SOURCE][  ] : ${e.id} (${e.data.length})`);
				} else {
					console.log(`[SOURCE][OK] : ${e.id} (${e.data.length})`);
				}
			} else {
				let i = Object.keys(e.data).length;
				if (e.data == undefined || i == 0) {
					console.log(`[SOURCE][  ] : ${e.id} (key=${e.byKey}) (${i})`);
				} else {
					console.log(`[SOURCE][OK] : ${e.id} (key=${e.byKey}) (${i})`);
				}
			}
		});
	}
	
	console.log(`Check used sources`);
	for (a in index.data) {
		let article = index.data[a];
		for (c in article.charts) {
			let chart = article.charts[c];
			for (o in chart.options) {
				let opt = chart.options[o];
				if (opt.source != undefined) {
					
					Sources.getSource(index, opt.source, opt.fieldValues).then(function(e) {
						if (e.byKey == false) {
							if (e == undefined) {
								console.log(`[USAGES][  ] : ${article.id}-${chart.id}-${opt.id}: (${opt.source})`);
							} else if (e.data.length === 0) {
								console.log(`[USAGES][  ] : ${article.id}-${chart.id}-${opt.id}: (${opt.source})`);
							} else {
								console.log(`[USAGES][OK] : ${article.id}-${chart.id}-${opt.id}: (${e.data.length})`);
							}
						} else {
							let i = Object.keys(e.data).length;
							console.log(`[USAGES][  ] : ${e.id} (key=${e.byKey}) (${i}): a key is used`);
						}
					}).catch(function (e) {
						console.log(`[USAGES][  ] : ${article.id}-${chart.id}-${opt.id}: ${e}`);
					});
					
				} else {
					if (chart.id != "source" && chart.id != "information") {
						console.log(`[USAGES][  ] : ${article.id}-${chart.id}-${opt.id}: no source used`);
					}
				}
			}
		}
	}
});