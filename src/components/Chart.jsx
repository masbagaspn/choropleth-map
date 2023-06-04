import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

function Chart({ data }) {
  const chart = useRef();

  useEffect(() => {
    const path = d3.geoPath();
    const legendSize = 20;

    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.7;

    const { county, education } = data;

    const geojson = topojson.feature(county, county.objects.counties);

    const projection = d3.geoIdentity().fitSize([width, height], geojson);
    path.projection(projection);
    const counties = geojson.features;

    const svg = d3.select(chart.current);
    const tooltip = d3.select("#tooltip").style("visibility", "hidden");

    const topography = svg.append("g").attr("id", "topography");

    topography
      .selectAll("path")
      .data(counties)
      .join(
        (enter) => enter.append("path"),
        (update) => update.attr("data-updated", "updated"),
        (exit) => exit.remove()
      )
      .classed("county", true)
      .attr("id", (d, i) => `county-${i}`)
      .attr("d", path)
      .attr("fill", (d) => {
        const id = d.id;
        const county = education.find((edu) => edu.fips === id);
        const percentage = county.bachelorsOrHigher;

        if (percentage <= 15) return "rgb(209 250 229)";
        if (percentage <= 30) return "rgb(110 231 183)";
        if (percentage <= 45) return "rgb(16 185 129)";
        return "rgb(4 120 87)";
      })
      .attr("data-fips", (d) => d.id)
      .attr("data-education", (d) => {
        const county = education.find((edu) => edu.fips === d.id);
        return county.bachelorsOrHigher;
      })
      .on("mouseover", (e, d) => {
        const element = document.getElementById(e.target.id);
        element.style.opacity = 0.5;

        const county = education.find((edu) => edu.fips === d.id);

        tooltip.transition().duration(200).style("visibility", "visible");
        tooltip
          .html(
            `<span>${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%</span>`
          )
          .attr("data-education", county.bachelorsOrHigher)
          .style("left", `${e.clientX + 10}px`)
          .style("top", `${e.clientY}px`);
      })
      .on("mouseout", (e, d) => {
        const element = document.getElementById(e.target.id);
        element.style.opacity = 1;

        tooltip.transition().duration(200).style("visibility", "hidden");
      });

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr(
        "transform",
        `translate(${width - width * 0.2}, ${height - (legendSize + 4) * 4})`
      );

    legend
      .selectAll("rect")
      .data([0, 16, 31, 46])
      .enter()
      .append("rect")
      .attr("fill", (d) => {
        if (d <= 15) return "rgb(209 250 229)";
        if (d <= 30) return "rgb(110 231 183)";
        if (d <= 45) return "rgb(16 185 129)";
        return "rgb(4 120 87)";
      })
      .attr("y", (d, i) => i * (legendSize + 4))
      .attr("width", legendSize)
      .attr("height", legendSize);

    legend
      .selectAll("text")
      .data([0, 16, 31, 46])
      .enter()
      .append("text")
      .text((d) => {
        if (d <= 15) return "Less than 15";
        if (d <= 30) return "Less than 30";
        if (d <= 45) return "Less than 45";
        return "More than 45";
      })
      .attr("x", legendSize + 8)
      .attr("y", (d, i) => i * (legendSize + 4) + (legendSize / 2 + 4))
      .attr("font-size", "0.75rem");
  }, []);
  return <svg ref={chart} className="w-[90vw] h-[70vw] "></svg>;
}

export default Chart;
