import { InteractionData } from "./Heatmap";
import styles from "./styles.css";

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
};

export default function Tooltip({
  interactionData,
  width,
  height,
}: TooltipProps) {
  if (!interactionData) {
    interactionData = { xPos: 0, yPos: 0, yLabel: 'Y test', xLabel: 'X test', value: 100}
  }

  return (
    // Wrapper div: a rect on top of the viz area
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {/* The actual box with white background */}
      <div
        style={{
          position: "absolute",
          left: interactionData.xPos,
          top: interactionData.yPos,
          backgroundColor: 'red'
        }}
        className=".tooltip"
      >
        <span>{interactionData.yLabel}</span>
        <br />
        <span>{interactionData.xLabel}</span>
        <span>: </span>
        <b>{interactionData.value || 0}</b>
      </div>
    </div>
  );
}
