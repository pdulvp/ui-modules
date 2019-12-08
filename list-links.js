/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	
	createHomeArticleLink: function(article) {
		let description = article.abstract == undefined ? "" : description;
		
		return `
			<a id="accueil_link_${article.id}" class="main-article-link" href="${article.href}"><div id="box_chart_${article.id}" class="d-flex ">
				<div class="mr-3 ${article.icon} icon-2x" style="color:${article.tint}"></div>
				<div id="box_html_${article.id}" class="" style="width:100%">
					<div class="lh-100 d-flex">
					  <h6 class="mb-0 lh-100">${article.name}</h6>
					</div>
					<p><small>${description}</small></p>
					<!--div class="text-right"><small>Voir l'article</small></div-->
				</div>
			</div></a>`; 
	},
	
	createHomeArticleLinks: function(items) {
		if (items.length==0) {
			return "";
		}
		let y = "";
		let tint = "black";
		for (i in items) {
			let article = items[i];
			tint = article.tint;
			let line = i < items.length-1 ? `<hr class="my-separator"/>`:"";
			y+=renderer.createHomeArticleLink(article);
			y+=`${line}`;
		}
		
		return `${y}`;
		  
	},

	render: function(index, articles, owner) {
		return new Promise((resolve, reject) => {
			let result = renderer.createHomeArticleLinks(articles); 
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
	modules.register("@pdulvp/list-links", renderer);
}

})();