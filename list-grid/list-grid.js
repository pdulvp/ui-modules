/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
		
	htmlElementList: function(icon, title, description) {
		//<img class="mr-3" src="${icon}" height="32px" alt="Card image cap"></img>
		let d = description == undefined ? "": `<p><small>${description}</small></p>`;
		return `<div class="d-flex">
		<div class="font-theme icon-3x ${icon} mr-2"></div>
			<div>
				<div class="lh-100 d-flex">
				  <h6 class="mb-1 lh-100"><b>${title}</b></h6>
				</div>
				${d}
			</div>
		</div>`;
	},

	htmlListFlex: function(array) {
		let result = `<div class="">`;
		for (i in array) {
			if (i % 3 == 0) {
				result += `<div class="row mt-2 mb-1">`;
			}
			result += `<div class="col-sm">`;
			result += renderer.htmlElementList(array[i].icon, array[i].name, array[i].description);
			result += `</div>`;
			if (i % 3 == 2) {
				result += `</div>`;
			}
		}
		result += `</div>`;
		return result;
	},

	render: function(index, articles, owner) {
		return new Promise((resolve, reject) => {
			let result = renderer.htmlListFlex(articles); 
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
	modules.register("@pdulvp/list-grid", renderer);
}

})();