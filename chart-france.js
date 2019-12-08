/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	render: function(index, person, chart, opt, owner, fieldValues) {
		return new Promise((resolve, reject) => {
			Sources.getSource(index, opt.source).then(json => {
		
				$.ajax({
				  url: "/svg/Départements_et_régions_de_France.svg",
				  dataType: 'html', 
				  data: null,
				  success: function( map  ) {
					 
					var div = `<div id="svg_${chart.id}" class="chart-france ${opt.id}">${map}</div>`;
					$( `#${owner}`).append( div );
					
					let field = opt.field;
					var data = json.data;
					
					var maxValue = data.map( el => el[field]).reduce( ( max, cur ) => Math.max( max, cur ), -Infinity );
					
					// Next you need to use the layout script to calculate the placement, rotation and size of each word:
					var initColor = getTint(person); 
					var labColor = Colors.rgb2lab(initColor);
					var minSize = labColor[0];
		
					let paths = document.getElementById(`svg_${chart.id}`).getElementsByTagName("path");
					for (i in paths) {
						if (paths[i].id == undefined) {
							continue;
						}
						let pp = data.find(x => x["depint"]==paths[i].id);
						if (pp == undefined) {
							continue;
						}
						
						var value = pp[field];
						let size = Math.floor(value * 100 / maxValue) / 100;
						let lum = 1 + Math.floor(100-(size*(100-minSize)));
						let color = Colors.lab2rgb([lum, labColor[1], labColor[2]]);
						color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
						let style = paths[i].getAttribute("style");
						style = style.replace("fill:#fff3e3", "fill:"+color);
						
						paths[i].setAttribute("style", style);
						paths[i].setAttribute("tab-index", "0");
					}
				
					let allStates = $(`#svg_${chart.id} svg > *`);
					allStates.on("click", function(e) {
						if ($(e.target).hasClass('on')) { 
							$(e.target).removeClass('on');
						} else {
							$(e.target).addClass('on');
						}
						
						if (opt.action.id == "displayTip") {
							let toto = data.find(x => x["depint"]==e.target.id);
							if (toto != undefined) {
								if ($(e.target).hasClass('on')) {
									let labelValue = formatLabel(opt.action.labelFormat, opt.action.labelFields.map(x => toto[x]));
									let titleValue = formatLabel(opt.action.titleFormat, opt.action.titleFields.map(x => toto[x]));
									e.target.setAttribute("data-container", "body");
									e.target.setAttribute("data-placement", "top");
									e.target.setAttribute("data-trigger", "manual");
									e.target.setAttribute("title", titleValue);
									e.target.setAttribute("data-html", "true");
									e.target.setAttribute("data-toggle", "popover");
									e.target.setAttribute("data-content", labelValue);
									$(e.target).popover('show');
								} else {
									$(e.target).popover('hide');
								}
							}
						}
						
						if (opt.action.id == "chart") {
							let newChart = person.charts.find(c => c.type==opt.action.chart);
							let newOption = newChart.options.find(c => c.id==opt.action.option);
							
							let selectedStates = $(`#svg_${chart.id} .on`);
							let res = [];
							for (i in selectedStates){
								if (selectedStates[i].id != null) {
									res.push(selectedStates[i].id);
								}
							}
							let selt = getButton(person, newChart);
							let btn = getButton(person, newChart, newOption);
							if (res.length > 0) {
								btn.setAttribute("data-fieldValues", JSON.stringify({"depint": res}));
							} else {
								btn.setAttribute("data-fieldValues", JSON.stringify({}));
							}
							selt.value = newOption.id;
							$("#"+selt.id).trigger('change');
						}
					});
					
					updatePopovers();
					goUp(person, chart, owner);
				
				} });
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
	modules.register("@pdulvp/chart-france", renderer);
}

})();
