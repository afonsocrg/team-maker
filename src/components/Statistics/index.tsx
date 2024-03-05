import "./styles.css";
import { Typography } from "antd";
import HeatMap from "@components/HeatMap";
const { Text } = Typography;

export default function Statistics({ statistics }) {
  return (
    <div className="statistics-container">
      {statistics.map((statistic) => {
        return (
          <div key={statistic.title}>
            <HeatMap
              data={statistic.dist}
              cellHeight={25}
              cellWidth={50}
              tooltipMessge={(x: string, y: string, value: number) =>
                `(${x}, ${y}): ${value} members`
              }
            />
            <div className='subtitle'>
              <Text type="secondary">{statistic.title}</Text>
            </div>
          </div>
        );
      })}
    </div>
  );
}
