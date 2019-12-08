/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	render: function(index, person, chart, opt, owner, fieldValues) {
		return new Promise((resolve, reject) => {
			res = "";
			res += `<button class="btn btn-link btn-block dropdown-toggle" type="button" data-toggle="collapse" style="text-align: left;" data-target="#chart2_${person.id}_${person.charts[i].id}" aria-expanded="false">Informations sur la source de l'article</button>`;
			res += `<div id="chart2_${person.id}_${person.charts[i].id}" class="collapse" ></div>`;
			let div = `<div class="">${res}</div>`; //bd-callout bd-callout-info
			$( `#${owner}`).append(div);
			
			$(`#chart2_${person.id}_${person.charts[i].id}`).on('show.bs.collapse', function (e) {
				
				getSources(person).then(function (sources) {

					let sourceContent = "";
					let p = 1;

					for (s in sources) {
						let source = sources[s];
						
						if (source.source) {
							let suffix = sources.length == 1 ? "" : ` n°${p}`;
							
							sourceContent += `<a class="btn btn-outline-secondary bg-white mr-1" href="${source.source}"><span class="icon-link"></span>Donnée source${suffix}</a>`;
							
							if (source.page) {
								sourceContent += `<a class="btn btn-outline-secondary bg-white mr-1" href="${source.page}"><span class="icon-attach"></span>Page source${suffix}</a>`;
							}
							if (source.licence) {
								sourceContent += `<a class="btn btn-outline-secondary bg-white mr-1" disabled>${source.licence}${suffix}</a>`;
							}
							if (source.date) {
								let year = source.date.substring(0,4);
								let month = source.date.substring(4,6);
								let day = source.date.substring(6,8);
								sourceContent += `<a title="Date de la donnée source${suffix}" class="btn btn-outline-secondary bg-white mr-1" disabled>${day}-${month}-${year}</a>`;
							}
							p++;
						}
						
					}
				
					if (sourceContent.length>0) {
						let div = `<div class="">${sourceContent}</div>`;
						$(`#${e.target.id}`).append(div);
					}
				});
			});
			
			resolve();
		});
	}
};

//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = renderer;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/chart-source", renderer);
}

})();