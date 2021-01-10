/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
		
	htmlCarouselItem: function(article) {
		return `<div class="row d-flex">
		  <div class="d-block col-sm-6 ${article.icon} icon-20x p-3" style="height:auto; text-align: center"></div>
		  <!--img class="d-block col-sm-6" style="height:auto" width="640px" height="480px" src="${article.icon}" alt="First slide"-->
		  <div class="card border-0 col-sm-6">
			<div class="card-body p-0">
				<h4 class="card-title text-center">${article.name}</h4>
				<p class="p-3">${article.description}</p>
			  </div>
			</div>
		  </div>`;
	},

	htmlCarousel: function(array) {
		
		let opt = ``;
		let inner = ``;
		for (i in array) {
			let clazz = i == 0 ? "active" : "";
			opt+=`<li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="${clazz}"></li>`;
			inner+= `<div class="carousel-item ${clazz}">`;
			inner+=renderer.htmlCarouselItem(array[i]);
			inner+= `</div>`;
		}
		let result = `<div id="carouselExampleIndicators" class="carousel slide p-3 pb-5" data-ride="carousel">
			  <ol class="carousel-indicators">${opt}</ol>
			  <div class="carousel-inner">${inner}</div>
			  </div>`;
		return result;
	},

	render: function(index, articles, owner) {
		return new Promise((resolve, reject) => {
			let result = renderer.htmlCarousel(articles); 
			$( `#${owner}`).append( result );
			$('.carousel').carousel({
			  interval: 4000
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
	modules.register("@pdulvp/list-carousel", renderer);
}

})();