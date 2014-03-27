var width = 600;
var height = 350;
var radius = Math.min(width, height) / 2;

var innerArc = d3.svg.arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

var sliceColors = {
    '0': '#ea0000',
    '1': '#014fbb',
    '2': '#999999',
    '3': '#d9d9d9'
};

var textLabels = {
    '0': '不支持',
    '1': '支持',
    '2': '不表態',
    '3': '尚未表態'
};

function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
        return d.values.length;
    });

function renderPieChart(chart, data) {
    renderPieSlices(chart, data)
    renderTextLabels(chart, data)
    renderTextPolylines(chart, data)
}

function renderPieSlices(chart, data) {
    var slice = chart.select('.slices')
        .selectAll('path.slice')
        .data(pie(data), function (d) { return d.data.key; });

    slice.enter()
        .insert('path')
        .style('fill', function (d) { return sliceColors[d.data.key]; })
        .attr('class', 'slice');

    slice.transition()
        .duration(1000)
        .attrTween('d', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return innerArc(interpolate(t));
            };
        });

    slice.exit().remove();
};

function renderTextLabels(chart, data) {
    var label= chart.select('.labels')
        .selectAll('text')
        .data(pie(data), function (d) { return d.data.key; });

    label.enter()
        .append('text')
        .attr('dy', '.35em')
        .text(function (d) {
            return d.value + ' 席' + textLabels[d.data.key];
        });

    label.transition()
        .duration(1000)
        .attrTween('transform', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            };
        })
        .styleTween('text-anchor', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? 'start' : 'end';
            };
        });

    label.exit().remove();
};

function renderTextPolylines(chart, data) {
    var polyline = chart.select('.lines')
        .selectAll('polyline')
        .data(pie(data), function (d) { return d.data.key; });

    polyline.enter()
        .append('polyline');

    polyline.transition()
        .duration(1000)
        .attrTween('points', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit().remove();
};

function renderLegends(id, labels, colors) {
    var li = { w: 75, h:30, s: 3, r:3 };
    var legend = d3.select(id).append('svg')
        .attr('width', d3.keys(labels).length * (li.w + li.s))
        .attr('height', li.h);

    var legendg = legend.selectAll('g')
        .data(d3.entries(colors))
        .enter().append('g')
        .attr('transform', function (d, i) {
            return 'translate(' + i * (li.w + li.s) + ', 0)';
        });

    legendg.append('rect')
        .attr('rx', li.r)
        .attr('ry', li.r)
        .attr('width', li.w)
        .attr('height', li.h)
        .style('fill', function (d) { return d.value; });

    legendg.append('text')
        .data(d3.entries(labels))
        .attr('x', li.w / 2)
        .attr('y', li.h / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text(function (d) { return d.value; });
}

function getChoice(choiceCode) {
    switch (choiceCode) {
        case '0':
        case '1':
        case '2':
            return choiceCode;
            break;
        default:
            return '3';
            break;
    }
}

function renderChart1(data) {
    var chart1 = d3.select('#chart-1')
        .append('svg')
        .append('g');

    chart1.append('g').attr('class', 'slices');
    chart1.append('g').attr('class', 'labels');
    chart1.append('g').attr('class', 'lines');

    chart1.attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');

    var groupByChoice = d3.nest()
        .key(function (d) {
            d.choice = getChoice(d.choice);
            return d.choice;
        })
        .rollup(function(leaves) {
            return { 'object': leaves, 'length': leaves.length };
        })
        .entries(data)
    renderPieChart(chart1, groupByChoice)
    renderLegends('#legend-chart-1', textLabels, sliceColors);
}
