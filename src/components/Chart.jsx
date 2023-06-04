import React, { useRef } from "react";

function Chart({ data }) {
  const chart = useRef();
  return <svg ref={chart} className="w-[90vmin] h-[80vmin]"></svg>;
}

export default Chart;
