/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */
(() => {
let renderer = {
	
	createTags: function(index) {
		let result = ``;
		for (let v in index.mainSections) {
			let m = index.mainSections[v];
			if (m.mainTag) {
				var color = getTint(m);
				var hslColor = Colors.rgbToHsl(color[0], color[1], color[2]);
				hslColor[1] = 0.2;
				hslColor[2] = 0.7;
				color = Colors.hslToRgb(hslColor[0], hslColor[1], hslColor[2]);
				color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
				color = "white"; 
				result += `
				<div class="text-center"> 
					<a class="tag-link" href="${m.href}"><div class="icon-5x ${m.icon}"></div>${m.name}</a>
				</div>`;
			}
		}
		if (result == "") {
			return "";
		}
		let title = "Catégories";
		let titleHeader = createSimpleHeader(title);
		var div = `${titleHeader}<div class="d-flex flex-wrap justify-content-around mt-3">${result}</div>`;
		return div;
	},
	
	render: function(index, articles, owner) {
		return new Promise((resolve, reject) => {
			let result = renderer.createTags(index); 
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
	modules.register("@pdulvp/list-categories", renderer);
}

})();