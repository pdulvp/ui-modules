/**
 * Author: pdulvp@laposte.net
 * Licence: CC-BY-NC-SA-4.0
 */

(() => {
let renderer = {
	render: function(index, person, chart, opt, owner, fieldValues) {
		return new Promise((resolve, reject) => {
			Sources.getSource(index, opt.source, fieldValues).then( function(json) {
			
				let format = opt.format;
				if (format == undefined) {
					//convert legacy format to the new one
					let field = opt.field;
					let labelFormat = opt.labelFormat;
					let labelField = opt.labelField == null ? "name": opt.labelField;
					let labelDescription = opt.labelDescription == null ? null: opt.labelDescription;
					format = [ [ { "labelFormat" : "%1", "labelFields": [ labelField ] }, { "labelFormat" : labelFormat, "labelFields": [ field ] } ] ];
				}
				let columns = opt.columns;
				if (columns == undefined) {
					columns = [ { "width": 65}, { "width": 25, "style": "chart-table-cell" }];
				}
				
				//create 'length' buttons, 
				//with one on the step displaying an hand clickable towards 'linkId', 
				//and the previous one, a gray arrow doing nothing
				let getTreeButtons = function(length, step, linkId) {
					let depth = length;
					//we have only (depth-1) buttons on left.
					let params = Array.apply(null, Array(depth-1)).map(function (x, i) { return `<span class="icon-circle-thin cicon-invisible"></span>`; });
					//we add an clickable hand at the 'parent' position
					if (step<params.length) {
						params[step] = `<a data-toggle="collapse" href="${linkId}" role="button" class="icon-right-hand"></a>`;
					}
					//we add an clickable hand at the 'parent-1' position
					if (step>0) {
						params[step-1] = `<span class="icon-level-down cicon-light"></span>`;
					}
					params = params.map(x => `<div class="d-inline-flex chart-table-column-5">${x}</div>`);
					return params.join('');
				};
				
				//handle the unclick on an tree item.
				//it will create a row for each data[i] into proper div #row_x_y_z,
				//and an unfilled-collapsed one for containing childs of each data[i]
				//at uncollapse, we 'unclick' the clicked item.
				let unclick = function(e) {
					
					//return a list of all parent tree item, including current one
					let parents = Object.values($(e.target)).concat(Object.values($(e.target).parents())).filter(x => x.getAttribute != undefined && x.getAttribute("data-id") != undefined).reverse().map(x => x.getAttribute("data-id"));
					
					let rowid = parents.join("_");
					if (parents.length > 0) { 
						rowid = "_"+rowid;
					}
					
					//if already populated, we don't have to repopulate twice
					if (document.getElementById(`row${rowid}`).hasChildNodes()) {
						return;
					}
					
					//go-down to json data tree to the current data child, starting from json
					let reducer = (accumulator, currentValue) => accumulator.data[currentValue];
					let mData = parents.reduce(reducer, json);
	
					for (let v in mData.data) {
						let result =  "";
						let hasChild = mData.data[v].data != undefined;
						
						result += `<div class="d-flex flex-row pt-1 pb-1">`;
						
						result += getTreeButtons(format.length, parents.length, `#row${rowid}_${v}`);
						
						let currentFormat = format[parents.length];
						for (f in currentFormat) {
							let cellText = formatLabel(currentFormat[f].labelFormat, currentFormat[f].labelFields.map(x => mData.data[v][x]));
							let clazz = columns[f].style == undefined ? "" : columns[f].style;
							
							result += `<div class="${clazz} d-inline-flex chart-table-column-${columns[f].width}">${cellText}</div>`;
						}
						
						result += `</div>`;
						
						if (hasChild) {
							result += `<div id="row${rowid}_${v}" data-id="${v}" class="flex-row collapse"></div>`;
						}
						$( `#row${rowid}`).append( result );
						
						$(`#row${rowid}_${v}`).on('show.bs.collapse', function (e) {
								new Promise((resolve, reject) => { unclick(e) });
						});
					}
				};
				
				let div = `<div id="row" class="chart-table"></div>`;
				$( `#${owner}`).append( div );
				//simulate an unclick on the hidden root. it will populate with json.
				unclick( { "target": $( `#row`) });
				goUp(person, chart, owner);
			});


			resolve(); 
		});
	}
	/**
		
	 */
};

//export to nodeJs
if(typeof exports === 'object' && typeof module === 'object') {
	module.exports = renderer;
}

if (typeof modules === 'object') {
	modules.register("@pdulvp/chart-table", renderer);
}

})();