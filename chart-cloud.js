/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

 (() => {
	let renderer = {
		render: function(index, person, chart, opt, owner, fieldValues) {
			return new Promise((resolve, reject) => {
				Sources.getSource(index, opt.source).then( function(json) {
					let data = json.data;
					var labelFormat = opt.labelFormat;
					var labelFields = opt.labelFields;
					var sizeField = opt.sizeField;
					var maxValue = data.map( el => el[sizeField]).reduce( ( max, cur ) => Math.max( max, cur ), -Infinity );
					var maxSize = 16;
					var minSize = 10;
				
					var initColor = getTint(person); 
					var labColor = Colors.rgb2lab(initColor);
					var ite = 5;
					var result = "- ";
					for (let v in data) {
						let size = Math.floor(data[v][sizeField] * maxSize / maxValue + minSize);
						var color = Colors.lab2rgb([labColor[0]-(size-minSize)*ite, labColor[1], labColor[2]]);
						color[0] = Math.floor(color[0]);
						color[1] = Math.floor(color[1]);
						color[2] = Math.floor(color[2]);
						color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`;
						
						var format = formatLabel(labelFormat, labelFields.map(x => data[v][x]));
						
						result += `<a href="javascript://" data-placement="top" 
							style="font-size:${size}px; color:${color}" 
							data-trigger="focus" data-html="true"
							data-toggle="popover" title="${data[v].name}" 
							data-content="${format}">${data[v].name}</a> - `;
					}
					
					$( `#${owner}`).append( `<div class="chart-cloud-tag">${result}</div>` );
					
					updatePopovers();
					goUp(person, chart, owner);
					dismissWait(person, chart, owner);
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
		modules.register("@pdulvp/chart-cloud", renderer);
	}

})();
