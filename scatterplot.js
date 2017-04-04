d3.custom = {};
 
d3.custom.scatterplot = function module() {
	var margin = {top: 30, right: 40, bottom: 50, left: 30},
    	width = 560,
    	height = 500,
    	xValue ='distance',
    	yValue='vegan',
    	y2Value='raupcrick',
    	xLabel='Pairwise Distance',
    	yLabel = 'Beta Diversity (Vegan)',
    	y2Label='Beta Diversity (Raupcrick)',
    	_index = 0,
    	xlog='log';
    

    
    
    	var svg;
    
    	function exports(_selection) {
			_selection.each(function(_data) {
		
			var x
		
				if(xlog=='log'){
				
					 x = d3.scale.log()
					.range([0, width]);
				}else{
					 x = d3.scale.linear()
					.range([0, width]);
				}

				var y = d3.scale.linear()
					.range([height, 0]);

				var y2 = d3.scale.linear()
					.range([height, 0]);


				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.tickFormat(function (d) {
						return x.tickFormat(4,d3.format(",d"))(d)
					});

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var yAxis2 = d3.svg.axis()
					.scale(y2)
					.orient("right");

		
				if (!svg) {
					 svg = d3.select(this).append('svg');
					 var container = svg.append('g').classed('container-group'+_index, true);

				}
			
				svg.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom);
			
				container
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
				  x.domain(d3.extent(_data, function(d) { return d[xValue]; })).nice();
				  y.domain(d3.extent(_data, function(d) { return d[yValue]; })).nice();
				  //  y.domain([0,1]);
				  y2.domain(d3.extent(_data, function(d) { return d[y2Value]; })).nice();
				 //  y2.domain([100,170]);

				   //x-axis labels
				  container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(0," + height + ")")
					  .call(xAxis)
					  .selectAll("text")	
							.style("text-anchor", "end")
							.attr("dx", "-.8em")
							.attr("dy", ".15em")
							.attr("transform", function(d) {
								return "rotate(-65)" 
							});
   
				   //x-axis title label
					container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(-5," + height + ")")
					  .append("text")
					  .attr("class", "label")
					  .attr("x", width)
					  .attr("y", -6)
					  .style("text-anchor", "end")
					  .text(xLabel);

				 //y-axis title label
				  container.append("g")
					  .attr("class", "y axis")
					  .call(yAxis)
					  .append("text")
					  .attr("class", "label")
					  .attr("transform", "rotate(-90)")
					  .attr("y", 6)
					  .attr("dy", ".71em")
					  .style("text-anchor", "end")
					  .text(yLabel);
				  
					  //y2-axis title label
					  container.append("g")
						  .attr("class", "y axisRed")
						  .attr("transform", "translate( " + width + ", 0 )")
						  .call(yAxis2)
						  .append("text")
						  .attr("class", "label")
						  .attr("transform", "rotate(-90)")
						  .attr("y", -12)
						  .attr("dy", ".71em")
						  .style("text-anchor", "end")
						  .text(y2Label);
					  
					container.selectAll(".dot"+_index)
					  .data(_data)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y(d[yValue]); })
					  .style("fill", '#72A8FF')
					  .style("opacity",0.9);
	  
				  container.selectAll(".dot2"+_index)
					  .data(_data)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y2(d[y2Value]); })
					  .style("fill", '#D65734')
					  .style("opacity",0.9);
	  

					  
					  
					  
					  
					  

					var veganArray = _data.map(function(d){return d['vegan']});
					var raupcrickArray = _data.map(function(d){return d['raupcrick']});

					//get the x and y values for least squares
					var xSeries = _data.map(function(d) { return d['distance'] });
					var ySeriesvegan = veganArray;
					var ySeriesraupcrick = raupcrickArray;
		
		
					var dataArrayVegan=[];
					var dataArrayRaupcrick=[];
		
					for (var i=0;i<xSeries.length;i++){
						var indvArrayVegan = [];
						indvArrayVegan.push(xSeries[i],ySeriesvegan[i]);
						dataArrayVegan.push(indvArrayVegan);
			
						var indvArrayRaupcrick =[];
						indvArrayRaupcrick.push(xSeries[i],ySeriesraupcrick[i]);
						dataArrayRaupcrick.push(indvArrayRaupcrick);
			
						
					}
		
		
					var resultVegan= regression('linear', dataArrayVegan);
					var slopeVegan = resultVegan.equation[0];
					var yInterceptVegan = resultVegan.equation[1];
		
					var resultRaupcrick = regression('linear', dataArrayRaupcrick);
					var slopeRaupcrick= resultRaupcrick.equation[0];
					var yInterceptRaupcrick = resultRaupcrick.equation[1];
		

		
		
					// apply the reults of the least squares regression
		
					var x1Vegan = d3.min(xSeries);
					var y1Vegan= slopeVegan*x1Vegan+ yInterceptVegan;
					var x2Vegan = d3.max(xSeries);
					var y2Vegan = slopeVegan*x2Vegan + yInterceptVegan;
					var trendDataVegan= [[x1Vegan,y1Vegan,x2Vegan,y2Vegan]];
		
					var x1Raupcrick = d3.min(xSeries);
					var y1Raupcrick = slopeRaupcrick*x1Raupcrick + yInterceptRaupcrick;
					var x2Raupcrick  = d3.max(xSeries);
					var y2Raupcrick = slopeRaupcrick*x2Raupcrick + yInterceptRaupcrick;
					var trendDataRaupcrick = [[x1Raupcrick,y1Raupcrick,x2Raupcrick,y2Raupcrick]];
		

		
					console.log(trendDataVegan);
		
					var trendlineVegan = container.selectAll(".trendline"+_index)
						.data(trendDataVegan);
			
					var trendlineRaupcrick= container.selectAll(".trendline2"+_index)
						.data(trendDataRaupcrick);
			

			
					trendlineVegan.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y(d[3]); })
						.attr("stroke", "#72A8FF")
						.attr("stroke-width", 1);
		

					trendlineRaupcrick.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y2(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y2(d[3]); })
						.attr("stroke", "#D65734")
						.attr("stroke-width", 1);
					  
					  
					  
					  

			})
	
		}
		
		exports.xValue = function(value) {
			if (!arguments.length) return xValue;
			xValue = value;
			return this;
		}
		
	
		exports.yValue = function(value) {
			if (!arguments.length) return yValue;
			yValue = value;
			return this;
		}
		
		exports.y2Value = function(value) {
			if (!arguments.length) return y2Value;
			y2Value = value;
			return this;
		}
		
		exports.y3Value = function(value) {
			if (!arguments.length) return y3Value;
			y3Value = value;
			return this;
		}
		
		exports.xLabel = function(value) {
			if (!arguments.length) return xLabel;
			xLabel = value;
			return this;
		}
		
		exports.yLabel = function(value) {
			if (!arguments.length) return yLabel;
			yLabel = value;
			return this;
		}
		
		exports.y2Label = function(value) {
			if (!arguments.length) return y2Label;
			y2Label = value;
			return this;
		}
	
	
		exports._index = function(value) {
			if (!arguments.length) return _index;
			_index = value;
			return this;
		}
		
		exports.xlog = function(value) {
			if (!arguments.length) return xlog;
			xlog = value;
			return this;
		}
	
	
		return exports;

}








  




  

	


