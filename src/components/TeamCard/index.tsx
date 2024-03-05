import { Card } from "antd";
import ParticipantList from "@components/ParticipantList";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../types";
import { DeleteOutlined } from "@ant-design/icons";
import type { Person } from "@types";

type Props = {
  id: number;
  participants: Person[];
  assignParticipant: (participantId: number, team: number) => void;
  onDelete: () => void;
};
export default function TeamCard({
  id,
  participants,
  assignParticipant,
  onDelete,
}: Props) {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PERSON,
      drop: () => {
        return {
          name: "ParticipantList",
          allowedDropEffect: "move",
          listId: id,
        };
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  return (
    <div ref={drop}>
      <Card
        title={`Team #${id + 1}`}
        extra={
          <div className="pointer danger" onClick={onDelete}>
            <DeleteOutlined />
          </div>
        }
      >
        <ParticipantList
          participants={participants}
          onMove={assignParticipant}
        />
      </Card>
    </div>
  );
}
