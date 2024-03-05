import "./styles.css";
import { Typography } from "antd";
import HeatMap from "@components/HeatMap";
const { Text } = Typography;

export default function Statistics({ statistics }) {
  return (
    <div className="statistics-container">
      {statistics.map((statistic, idx) => {
        return (
          <div key={statistic.title} className="statistic-item">
            <div className="subtitle">
              <p>{statistic.title}</p>
            </div>
            <div className="heatmap-container">
              <HeatMap
                data={statistic.dist}
                cellHeight={25}
                cellWidth={50}
                tooltipMessge={(x: string, y: string, value: number) =>
                  `(${x}, ${y}): ${value} members`
                }
                yLabel={idx === 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
