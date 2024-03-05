// import { data } from "./data";
import { Heatmap } from "./Heatmap";

export function HeatmapVaccinationDemo({ data, width = 700, height = 400 }) {
  return <Heatmap data={data} width={width} height={height} />;
}
