import { Person } from "@types";
import { Avatar, Descriptions } from "antd";
import "./styles.css";

type Props = {
  participant: Person;
};

function translate(s: string) {
  const dict = {
    clan_years: "Anos de Clã",
    strength: "Ranking",
    group: "Agrupamento",
    sex: "Género",
  };
  return dict[s] || s;
}

export default function ParticipantDetails({ participant }: Props) {
  const items = Object.keys(participant)
    .filter((k) => !["name", "team"].includes(k))
    .map((k) => ({
      key: k,
      label: translate(k),
      children: participant[k],
    }));
  return (
    <div className="details-container">
      <div className="avatar">
        <Avatar
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${participant.id}`}
        />
      </div>
      <div className="details">
        <Descriptions
          title={participant.name}
          items={items}
          column={1}
          size="small"
        />
      </div>
    </div>
  );
}
