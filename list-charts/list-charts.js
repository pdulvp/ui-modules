/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	
	isFull: true,
	value: undefined,
	
	htmlCharts: function(div, person, flat, value, displayTitle) {
		let uid = Utils.uuid();
		var result = "";
		
		if (person.charts.length>0) {
			let subowner = `chart_${person.id}_${uid}`;
			
			if (!flat) { //we create a toolbar
				let toolbar = ``;
				if (person.charts.length > 1) {
					for (i in person.charts) {
						toolbar += createButton(person, person.charts[i], subowner);
					}
					result += `<div class="text-center">${toolbar}</div>`;
				}
				result += `<div id="${subowner}"></div>`;
				
			} else { // we create all charts
				result += `<div id="${subowner}" class="">`;
				
				let style = "";
				for (i in person.charts) {
					let uid2 = Utils.uuid();
					if (value != undefined && !value.includes(person.charts[i].id)) {
						continue;
					}
					if (flat) {
						style = person.charts[i].style != undefined ? person.charts[i].style : (style != "" ? "" : "bg-white");
					}
					subowner = `chart_${person.id}_${person.charts[i].id}_${uid}_${i}`;
					
					result += `<div id="box_${subowner}" class="${style} p-3 main-section" >`;
					
					if (person.charts[i].type != "source" && person.charts[i].displayTitle) {
						result += createSimpleHeader(person.charts[i].name);
					}
					if (person.charts[i].hideWithoutFieldValues) {
						result += "Cette section est interactive. Cliquez sur un département pour le voir figurer ici."
					}
						
					result += createOption(person, person.charts[i], subowner);

					result += `<div id="${subowner}"></div>`;
					result += `</div>`; 
				}
				
				result += `</div>`;
			}
			
			div.innerHTML += result;
			
			for (i in person.charts) {
				let btn = getButton(person, person.charts[i], null);
				if (btn != null && btn.tagName.toLowerCase() == "button") {
					btn.onclick = onClickButton;
				}
				if (btn != null) console.log(btn.tagName );
				if (btn != null && btn.tagName.toLowerCase()  == "select") {
					btn.onchange = onClickButton;
				}
				for (o in person.charts[i].options) {
					btn = getButton(person, person.charts[i], person.charts[i].options[o]);
					if (btn != null && btn.tagName.toLowerCase()  == "button") {
						btn.onclick = onClickButton;
					}
				}
			}
			
			//Rendering of the first option for displayed charts. It shall be information or a quick one.
			if (flat) {
				for (i in person.charts) {
					if (value != undefined && !value.includes(person.charts[i].id)) {
						continue;
					}
					subowner = `chart_${person.id}_${person.charts[i].id}_${uid}_${i}`;
					createChart(person, person.charts[i], person.charts[i].options[0], subowner);
				}
			} else {
				var chart = person.charts[0];
				if (chart != undefined) {
					createChart(person, chart, chart.options[0], subowner);
				}
			}
			
			updatePopovers();
		}
	},
	
	setValue: function(value) {
		renderer.value = value;
	},
	
	render: function(index, articles, owner) {
		return new Promise((resolve, reject) => {
			for (i in articles) {
				renderer.htmlCharts(document.getElementById(owner), articles[i], true, renderer.value, true);
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
	modules.register("@pdulvp/list-charts", renderer);
}

})();