import { InteractionData } from "./Heatmap";
import styles from "./styles.css";
import { Tooltip as AntdTooltip } from "antd";

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
  tooltipMessage?: (x: string, y: string, value: number) => string;
};

export default function Tooltip({
  interactionData,
  tooltipMessage = null,
}: TooltipProps) {
  if (!interactionData) {
    return;
  }
  if (!tooltipMessage) {
    return;
  }

  return (
    // Wrapper div: a rect on top of the viz area
    <div
      style={{
        // width,
        // height,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <AntdTooltip
        open={interactionData !== null}
        placement="bottom"
        title={tooltipMessage(
          interactionData?.xLabel,
          interactionData?.yLabel,
          interactionData?.value || 0
        )}
      >
        {/* The actual box with white background */}
        <div
          style={{
            position: "absolute",
            left: interactionData?.xPos,
            top: interactionData?.yPos,
            backgroundColor: "red",
          }}
          // className=".tooltip"
        />
      </AntdTooltip>
    </div>
  );
}
