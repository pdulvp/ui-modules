/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	render: function(index, person, chart, opt, owner, fieldValues) {
		return new Promise((resolve, reject) => {
			Sources.getSource(index, opt.source).then( function(json) {
				updateWait(person, chart, "création du graphique");
				console.log("createHorizontalChart");
				
				var fields = opt.fields.length == undefined ? [opt.fields]: opt.fields;		
				var labelFormat = opt.labelFormat;
				var labelItem = opt.labelItem == undefined ? "name": opt.labelItem;
				var data = json.data;
				var order = 1;
				var keys = data.map(x => x[labelItem]);
				var dataset = [];
				
				for (f in fields) {
					var values = data.map(x => x[fields[f]]);
					var initColor = getTint(person);
					var hslColor = Colors.rgbToHsl(initColor[0], initColor[1], initColor[2]);
					hslColor[0] = (hslColor[0]*360 + (f >= 1 ? f * (360 / fields.length) : 0)) / 360;
					initColor = Colors.hslToRgb(hslColor[0], hslColor[1], hslColor[2]);
					
					var labColor = Colors.rgb2lab(initColor);
					var colors = [];
					var bcolors = [];
					var ite = (100-labColor[0]) / values.length;
					for (i=0; i<values.length; i++) {
						//rgb based, var color = [ initColor[0]+i*ite, initColor[1]+i*ite, initColor[2]+i*ite];
						//rgb based, var bcolor = [ initColor[0], initColor[1], initColor[2]];
						var color = Colors.lab2rgb([ order == 1 ? (labColor[0]+i*ite) : 100 - labColor[0]-i*ite, labColor[1], labColor[2]]);
						var bcolor = Colors.lab2rgb([ 30, labColor[1], labColor[2]]);
						
						colors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`);
						bcolors.push(`rgba(${bcolor[0]}, ${bcolor[1]}, ${bcolor[2]}, 0.6)`);
					}
					
					dataset.push({
							label: fields[f],
							data: values,
							backgroundColor: colors,
							borderColor: bcolors,
							borderWidth: 2
						});
				}
				var toto = {
					type: 'horizontalBar',
					data: {
						labels: keys,
						datasets: dataset
					},
					options: {
						animation: false,
						legend: {
							position: "bottom"
						},
						maintainAspectRatio: false,
						tooltips: {
							enabled: true,
							mode: 'single',
							callbacks: {
								label: function(tooltipItems, data) { 
									var format = formatLabel(labelFormat, tooltipItems.xLabel);
									return format;
								}
							}
						},	
						scales: {
							xAxes: [{
									stacked: true,
								ticks: {
									beginAtZero:true,
									autoSkip: false,
									maxRotation: 90,
									minRotation: 90,
									callback: function(value, index, values) {
										return formatLabel(labelFormat, value);
									}
								}
							}], 
							yAxes: [{
									stacked: true,
								ticks: {
									reverse: true, 
									fontSize: 9,
									callback: function(value, index, values) {
										return value; //formatLabel(labelFormat, value);
									}
								}, 
		
							}]
						}, 
						layout: {
							padding: {
								left: 0,
								right: 0,
								top: 0,
								bottom: 0
							}
						}
					}
					};
					
					var canvas = `<div class="chart-container" style="position: relative; height:100vh;"><canvas id="chart_canvas_${person.id}_${chart.id}"></canvas></div>`;
					$( `#${owner}`).append( canvas );
					var ctx = document.getElementById(`chart_canvas_${person.id}_${chart.id}`).getContext('2d');
					var myChart = new Chart(ctx, toto);
					
					goUp(person, chart, owner);
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
	modules.register("@pdulvp/chart-hbar", renderer);
}

})();