import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useTheme, makeStyles } from '@material-ui/core/styles';
// import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import moment from 'moment';
import Indicator from '../Indicator';
import numeric from '../../libs/numeric';

const useStyles = makeStyles((theme) => ({
  chart: {
    width: '100%',
    height: 'calc(100vh - 150px)',
  },
  'd3-tip': {
    lineHeight: 1,
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    borderRadius: '2px',
  }
}));
 
const MultilineChart = ({ data }) => {
  const svgRef = useRef(null);
  const theme = useTheme();
  const classes = useStyles();

  const tooltip = (d) => ReactDOMServer.renderToStaticMarkup(
    <React.Fragment>
      <p>{moment.utc(d.date).format('DD/MM/YYYY')}</p>
      <p>Cotação: {d.value}</p>
      <p>Preço Médio: {numeric.currency(d.position)}</p>
      <Indicator value={(d.value / d.position - 1) * 100} />
    </React.Fragment>
  );

  const build = async () => {
    const svgWidth = svgRef.current.offsetWidth;
    const svgHeight = svgRef.current.offsetHeight;
    const margin = { top: 10, right: 0, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const d3 = await import('d3');

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        // .attr("viewBox", `0 0 ${svgHeight} ${svgWidth}`)
        // .attr('preserveAspectRatio', "xMinYMin meet")
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, (d: any) => new Date(d.date)))
      .range([0, width]);
    
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .style("font-family", "Roboto, Helvetica, Arial, sans-serif")
      .call(d3.axisBottom(x));

    const min = d3.min(data, (d: any) => d.position && d.position < d.value ? +d.position : +d.value) - data[0].value * 0.05;
    const max = d3.max(data, (d: any) => d.position && d.position > d.value ? +d.position : +d.value) + data[0].value * 0.05;
    
    const y = d3.scaleLinear()
      .domain([min, max])
      .range([height, 0]);
    
    svg.append('g')
      .style("font-family", "Roboto, Helvetica, Arial, sans-serif")
      .call(d3.axisLeft(y));

    const tip = d3Tip()
      .attr('class', classes['d3-tip'])
      // .html((_event: any, d: any) => `<p>${d.value}</p>`);
      .html((_event: any, d: any) => tooltip(d));
    svg.call(tip);
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', theme.palette.primary.main)
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x((d: any) => x(d.date))
        .y((d: any) => y(d.value))
      )

    svg.append('path')
      .datum(data)
      .attr('fill', theme.palette.primary.main)
      .attr('opacity', 0.2)
      .attr('d', d3.area()
        .x((d: any) => x(d.date))
        .y0(height)
        .y1((d: any) => y(d.value))
      )

    svg.append('path')
      .datum(data.filter(x => x.position))
      .attr('fill', 'none')
      .attr('stroke', theme.palette.info.main)
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x((d: any) => x(d.date))
        .y((d: any) => y(d.position))
      )

    svg.selectAll("dots")
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => x(d.date))
      .attr('cy', (d: any) => y(d.value))
      .attr('r', 3)
      .attr('fill', theme.palette.primary.main)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  }
 
  useEffect(() => {
    build();
  }, [data]);
 
  return (
    <div ref={svgRef} className={classes.chart} />
  );
};
 
export default MultilineChart;
