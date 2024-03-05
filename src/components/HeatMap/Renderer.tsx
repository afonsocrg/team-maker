import { useMemo } from "react";
import * as d3 from "d3";
import { InteractionData } from "./Heatmap";
import { MARGIN } from "./constants";
import { Dataset } from "./data";
import styles from "./styles.css";

type RendererProps = {
  width?: number;
  cellWidth?: number;
  height?: number;
  cellHeight?: number;
  data: Dataset;
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
  colorScale: d3.ScaleLinear<string, string, never>;
};

export default function Renderer({
  width,
  cellWidth = 50,
  height,
  cellHeight = 50,
  data,
  setHoveredCell,
  colorScale,
}: RendererProps) {
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(
    () => [...new Set(data.map((d) => String(d.x)))],
    [data]
  );

  if (cellWidth !== undefined) {
    width = cellWidth * allXGroups.length + MARGIN.right + MARGIN.left;
  }
  if (cellHeight !== undefined) {
    height = cellHeight * allYGroups.length + MARGIN.top + MARGIN.bottom;
  }

  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.1);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand<string>()
      .range([0, boundsHeight])
      .domain(allYGroups)
      .padding(0.1);
  }, [data, height]);

  const allRects = data.map((d, i) => {
    const xPos = xScale(String(d.x));
    const yPos = yScale(d.y);
    if (d.value === null || !xPos || !yPos) {
      return;
    }

    return (
      <rect
        key={i}
        x={xPos}
        y={yPos}
        className=".rectangle"
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        fill={d.value ? colorScale(d.value) : "#F8F8F8"}
        onMouseEnter={(e) => {
          setHoveredCell({
            xLabel: String(d.x),
            yLabel: d.y,
            xPos: xPos + xScale.bandwidth() + MARGIN.left,
            yPos: yPos + xScale.bandwidth() / 2 + MARGIN.top,
            value: d.value ? Math.round(d.value * 100) / 100 : null,
          });
        }}
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    if (true || name && Number(name) % 10 === 0) {
      return (
        <text
          key={i}
          x={xScale(name) + 25}
          // y={boundsHeight + 10}
          y={0-5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          stroke="none"
          fill="black"
        >
          {name}
        </text>
      );
    }
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name);
    if (true || yPos && i % 2 === 0) {
      return (
        <text
          key={i}
          x={-5}
          y={yPos + yScale.bandwidth() / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={10}
        >
          {name}
        </text>
      );
    }
  });

  return (
    <svg
      width={width}
      height={height}
      onMouseLeave={() => setHoveredCell(null)}
    >
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
        {xLabels}
        {yLabels}
      </g>
    </svg>
  );
}
