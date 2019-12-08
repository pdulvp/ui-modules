/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	
	isFull: true,
	value: undefined,
	
	setValue: function(value) {
		renderer.value = value;
	},
	
	render: function(index, articles, owner) {
		return new Promise((resolve, reject) => {
			for (i in articles) {
				let page = getPage(index, articles[i].page);
				renderPage(page, { "index": index, "article": articles[i], "mainSection": undefined }, "main");
			}
			resolve();
		});
	}
};

//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = renderer;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/list-pages", renderer);
}

})();