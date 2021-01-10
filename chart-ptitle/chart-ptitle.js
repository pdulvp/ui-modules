/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	isFull: true,
	render: function(index, person, chart, opt, owner, fieldValues) {
		return new Promise((resolve, reject) => {
			let title = chart.name ? chart.name : person.name;
			let result = `<h4 class="lh-100 mt-0 mb-0">${title}</h4>`;
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
	modules.register("@pdulvp/chart-ptitle", renderer);
}

})();