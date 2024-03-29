import { Avatar, Popover } from "antd";
import type { DragSourceMonitor } from "react-dnd";
import { useDrag } from "react-dnd";
import type { Person } from "@types";
import { ItemTypes } from "@types";
import ParticipantDetails from "@components/ParticipantDetails";
import Chip from "@components/Chip";
import "./styles.css";
import { useState } from "react";
import { getAvatarSrc } from "@utils/avatars";
import { getFirstLastName } from "@utils/names";

interface DropResult {
  allowedDropEffect: string;
  dropEffect: string;
  name: string;
  listId: number | undefined;
}

type Props = {
  data: Person;
  onMove: (participantId: number, team: number | undefined) => void;
};
export default function ParticipantItem({ data, onMove }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.PERSON,
      item: data,
      end(item, monitor) {
        const dropResult = monitor.getDropResult<DropResult>();

        if (item) {
          if (dropResult === null) {
            onMove(item.id, undefined);
          } else {
            const isDropAllowed =
              dropResult.allowedDropEffect === "any" ||
              dropResult.allowedDropEffect === dropResult.dropEffect;
            if (isDropAllowed) {
              onMove(item.id, dropResult.listId);
            } else {
              alert(
                `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`
              );
            }
          }
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        isDragging: monitor.isDragging(),
      }),
    }),
    [data]
  );
  const [firstName, lastName] = getFirstLastName(data.name)

  return (
    <div ref={drag} className="participant-item unselectable pointer">
      <Popover
        open={!isDragging && showDetails}
        onOpenChange={(value) => setShowDetails(value)}
        trigger="click"
        content={<ParticipantDetails participant={data} />}
      >
        <div className="participant-summary">
          <div className="avatar">
            <Avatar src={getAvatarSrc(data.sex, data.id)} />
          </div>
          <div className="name">{`${firstName} ${lastName}`}</div>
          <div className="tags">
            <Chip label={data.group} />
            <Chip label={data.strength} bgColor="gray" />
          </div>
        </div>
      </Popover>
    </div>
  );
}
