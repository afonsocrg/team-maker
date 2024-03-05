import { colorFromString, getContrastColor } from "@utils/colors";
import "./styles.css";

type Props = {
  label: string;
  bgColor?: string;
  textColor?: string;
  onDelete?: () => void;
};

export default function Chip({
  label,
  onDelete = null,
  bgColor = null,
  textColor = null,
}: Props) {
  if (bgColor === null) bgColor = colorFromString(JSON.stringify(label));
  if (textColor === null) textColor = getContrastColor(bgColor);
  return (
    <div
      className="chip"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span className="chip-label">{label}</span>
      {onDelete && (
        <button className="delete-button" onClick={onDelete}>
          &times;
        </button>
      )}
    </div>
  );
}
