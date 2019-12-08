/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	render: function(index, person, chart, opt, owner, fieldValues) {
		return new Promise((resolve, reject) => {
			opt = (opt == undefined? opt = {}: opt);
			chart = (chart == undefined? chart = {}: chart);
			
			let result = ``; 
			var icon = `<span class="mr-3 ${person.icon} icon-3x" style="width:32px; height:32px;"></span>`;
			result +=  `<h5 class="alert-heading">${icon}${person.name}</h5>`;
			if (person.abstract != undefined) {
				result += `<p class="article-abstract">${person.abstract}</p>`;
			}
			if (person.description != undefined && person.abstract != person.description) {
				result += `<p class="article-description">${person.description}</p>`;
			}

			let array = [chart.title, chart.description, opt.description, opt.source].filter(x => x != undefined);
			if (array.length > 0) {
				let collapsedDescription = `chart_sub_${person.id}_${person.charts[i].id}`;
				result += `<hr/><button class="btn btn-link btn-block dropdown-toggle" type="button" data-toggle="collapse" style="text-align: left;" 
										data-target="#${collapsedDescription}" aria-expanded="false">Plus de détails sur l'article</button>`;
				result += `<div id="${collapsedDescription}" class="collapse">`;
			
				if (chart.title) {
					result += `<h6 class="mb-0 lh-100">${chart.title}</h6>`
				}
				if (chart.description) {
					if (Array.isArray(chart.description)) {
						let r = chart.description.join("\n");
						result += `<p><small>${r}</small></p>`;
						
					} else {
						result += `<p><small>${chart.description}</small></p>`;
					}
				}
				if (opt.description) {
					if (Array.isArray(opt.description)) {
						let r = opt.description.join("\n");
						result += `<p><small>${r}</small></p>`;
						
					} else {
						result += `<p><small>${opt.description}</small></p>`;
					}
				}
				if (opt.source) {
					Sources.getSource(index, opt.source).then( function(json) {
						var div = `${json.data}`;
						$( `#${collapsedDescription}`).append( div );
						goUp(person, chart, owner);
					});
				}
				result += `</div>`;
			}
			
			$( `#${owner}`).append( result );
			resolve();
		});
	}
};

//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = renderer;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/chart-information", renderer);
}

})();