/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	render: function(index, person, chart, opt, owner, fieldValues) {
		return new Promise((resolve, reject) => {
			Sources.getSource(index, opt.source, fieldValues).then( function(json) {
				updateWait(person, chart, "création du graphique");
				console.log("createLineChart");
				
				var fields = opt.fields.length == undefined ? [opt.fields]: opt.fields;		
				var labelFormat = opt.labelFormat;
				var labelItem = opt.labelItem == undefined ? "name": opt.labelItem;
				var data = json.data;
				var order = 1;
				var keys = fields;
				var dataset = [];
				
				var backgroundColors = [ "#00ac8e", "#007dac", "#ac0086", "#75ac00", "#ac0055", "#004dac", "#00aca2", "#dfd739", "#399bdf", "#df398f", "#9339df", "#39dfc9", "#dddf39", "#68df39", "#d939df" ];
				
				for (i in data) {
					var values = [];
					for (f in fields) {
						let value = data[i][fields[f]];
						values.push(parseInt(value));
					}
					dataset.push({
						label: data[i][labelItem],
						data: values,
						fill: false,
						//backgroundColor: colors,
						borderColor: backgroundColors[i],
						borderWidth: 2
					});
				}
				
				var toto = {
					type: 'line',
					data: {
						labels: keys,
						datasets: dataset
					},
					options: {
						animation: false,
						legend: {
							position: "top"
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
									stacked: false,
								ticks: {
									beginAtZero:true,
									autoSkip: false,
									maxRotation: 90,
									minRotation: 90,
									callback: function(value, index, values) {
										return formatLabel(labelFormat, values[index]);
									}
								}
							}], 
							yAxes: [{
									stacked: false,
								ticks: {
									reverse: false, 
									fontSize: 9,
									callback: function(value, index, values) {
										return value; //formatLabel(labelFormat, value);
									}
								}, 
		
							}]
						}, 
						layout: {
							padding: { left: 0, right: 0, top: 0, bottom: 0 }
						}
					}
					};
					
					var canvas = `<div class="chart-container" style="position: relative; height:70vh;"><canvas id="chart_canvas_${person.id}_${chart.id}"></canvas></div>`;
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
	modules.register("@pdulvp/chart-line", renderer);
}

})();