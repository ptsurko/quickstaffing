angular.module('QuickStaffing')
  .directive('radar', [function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var w = 300,
            h = 300;

        //Options for the Radar chart, other than default 
        var mycfg = {
          w: w,
          h: h,
          maxValue: 0.6,
          levels: 6,
          ExtraWidthX: 200
        };

        scope.$watchCollection('ctrl.selectedCandidates', function(selectedCandidates) {
          console.log('candidates selection changed');
          if (!selectedCandidates.length) {
            return
          }
          var data = selectedCandidates.map(function(candidate) {
            return [
              {axis: "English", value: englishRankMap[candidate.english] / englishRankMap.C2, label: candidate.english},
              {axis: "English", value: englishRankMap[candidate.english] / englishRankMap.C2, label: candidate.english},
              {axis: "English", value: englishRankMap[candidate.english] / englishRankMap.C2, label: candidate.english},
              {axis: "English", value: englishRankMap[candidate.english] / englishRankMap.C2, label: candidate.english},
              {axis: "English", value: englishRankMap[candidate.english] / englishRankMap.C2, label: candidate.english},
            ];
          });

          RadarChart.draw(element[0], data, mycfg);

          ////////////////////////////////////////////
          /////////// Initiate legend ////////////////
          ////////////////////////////////////////////
          var colorscale = d3.scale.category10();
          var candidateNames = selectedCandidates.map(function(candidate) {
            return candidate.fullName;
          });
          var svg = d3.select(element[0])
          	.selectAll('svg')
          	.append('svg')
          	.attr("width", w+300)
          	.attr("height", h);

          //Initiate Legend
          var legend = svg.append("g")
          	.attr("class", "legend")
          	.attr("height", 100)
          	.attr("width", 200)
          	.attr('transform', 'translate(90,20)');
          	//Create colour squares
          	legend.selectAll('rect')
          	  .data(candidateNames)
          	  .enter()
          	  .append("rect")
          	  .attr("x", w - 65)
          	  .attr("y", function(d, i){ return i * 20;})
          	  .attr("width", 10)
          	  .attr("height", 10)
          	  .style("fill", function(d, i){ return colorscale(i);});
          	//Create text next to squares
          	legend.selectAll('text')
          	  .data(candidateNames)
          	  .enter()
          	  .append("text")
          	  .attr("x", w - 52)
          	  .attr("y", function(d, i){ return i * 20 + 9;})
          	  .attr("font-size", "11px")
          	  .attr("fill", "#737373")
          	  .text(function(d) { return d; });


        });
      }
    }
  }]);
