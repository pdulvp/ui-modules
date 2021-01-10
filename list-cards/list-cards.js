/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
		
	htmlCard: function(index, article) {
		let d = "";//article.description == undefined ? "": `<p><small>${article.description}</small></p>`;
		let currentSection = index.mainSections.find(x => x.active);
		let local = currentSection && article.tags.some(t => currentSection.tags.includes(t));
		let href = article.href;
		return `<div class="card border-0" style="width: 8rem;">
		  <a href="${href}"><div class="card-img-top p-3 mr-3 ${article.icon} icon-10x" style="text-align:center"></div>
		  <!--img class="card-img-top p-3" src="${article.icon}" alt="Card image cap"-->
		  <div class="card-body text-center p-0">
			<h5 class="card-title">${article.name}</h5>
			${d}
		  </div></a>
		 </div>`;
	},

	htmlCardFlex: function(index, array) {
		let result = `<div class="ml-2 mr-2">`;
		for (i in array) {
			if (i % 5 == 0) {
				result += `<div class="row mt-2 mb-1">`;
			}
			result += `<div class="col">`;
			result += renderer.htmlCard(index, array[i]);
			result += `</div>`;
			if (i % 5 == 4) {
				result += `</div>`;
			}
		}
		result += `</div>`;
		return result;
	},

	render: function(index, articles, owner) {
		return new Promise((resolve, reject) => {
			let result = renderer.htmlCardFlex(index, articles); 
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
	modules.register("@pdulvp/list-cards", renderer);
}

})();