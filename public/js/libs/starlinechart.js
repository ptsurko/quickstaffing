(function() {
  if (!d3.starline) {
    d3.starline = {};
  }
  d3.starline.rayChart = function(options) {
    var cfg = {
     radius: 1,
     w: 400,
     h: 400,
     levels: 3,
     maxValue: 0.7,
     radians: 2 * Math.PI,
     color: d3.scale.category20()
    };

    function draw(g) {
      g.each(function() {
        var g = d3.select(this);
        var data = prepareData(g.datum());
        // var axisesData = data.filter(function(item) { return item.$$groupIndex == 0;});
        var total = data.filter(function(item) { return item.$$groupIndex == 0;}).length;
        var radius = Math.min(cfg.w / 2, cfg.h / 2);
        var maxValue = Math.max(cfg.maxValue, d3.max(data, function(o){
          return o.value;
        }) || 0);

        var scale = d3.scale.linear()
          .domain([0, maxValue])
          .range([0, radius]);

        var axisScale = d3.scale.linear()
          .domain([0, maxValue])
          .range([0, -radius]);

        var xAxis = d3.svg.axis()
          .scale(axisScale)
          .orient("right")
          .ticks(3)
          .tickSize(6, 0);

        var axisSelection = g.selectAll(".axis")
          .data(data, function(d) {return d.$$groupIndex + d.axis;});

        var axisEnterSelection = axisSelection.enter()
          .append("g")
          .attr("transform", function(d, i) {
            return d3.svg.transform().translate(cfg.w / 2, cfg.h / 2)();
          })
          .attr("class", "axis");

        axisEnterSelection
          .append("g")
          .attr("class", "axis-line")
          .call(xAxis);

        axisSelection
          .select(".axis-line")
          .call(xAxis)
            .selectAll(".tick")
            .each(function(d, i) {
                if (d ==0) {
                    this.remove();
                }
            });

        axisEnterSelection
          .append("text")
          .attr("class", "legend")
          .text(function(d) {return d.axis;})
          .style("font-family", "sans-serif")
          .style("font-size", "11px")
          .attr("text-anchor", "middle")
          .attr("dy", "1.5em")
          .attr("transform", function(d, i){return "translate(0, -10)"});

        axisSelection.select('.legend')
          .transition()
          .attr("x", function(d, i) {return radius * Math.sin(i * cfg.radians / total) + 40 * Math.sin(i * cfg.radians / total);})
          .attr("y", function(d, i) {return -radius * Math.cos(i * cfg.radians / total) - 20 * Math.cos(i * cfg.radians / total);});

        axisSelection
          .select(".axis-line")
          .transition()
          .attr("transform", function(d, i) {
            return d3.svg.transform()
              .rotate((i * cfg.radians / total) * 180 / Math.PI)();
          });

        axisEnterSelection
          .select(".axis-line")
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("class", "line")
            .style("stroke", function(d) {return cfg.color(d.$$groupIndex);})
            .style("stroke-width", function(d) {return (d.$$groupIndex + 1) * 2 + 'px';});

        axisSelection
          .select(".axis-line")
            .select('.line')
            .transition()
            .attr("x2", 0)
            .attr("y2", function(d, i) {
              return -scale(d.value);
            });

        axisSelection.exit()
          .remove();
      });
    };

    function prepareData(data) {
      return d3.merge(data.map(function(group, groupIndex) {
        return group.map(function(item, index) {
          return {
            axis: item.axis,
            value: item.value,
            $$groupIndex: groupIndex
          };
        });
      }));
    };

    return draw;
  };
}());
