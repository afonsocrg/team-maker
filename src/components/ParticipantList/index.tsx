import { Button, List } from "antd";
import type { Person } from "../../types";
import ParticipantItem from "./ParticipantItem";

type Props = {
  id?: number;
  participants: Person[];
  onMove: (participantId: number, team: number) => void;
};
export default function ParticipantList({ participants, onMove }: Props) {
  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={participants}
      rowKey={(p) => p.id}
      renderItem={(item: Person) => {
        return (
          <List.Item>
            <ParticipantItem data={item} onMove={onMove} />
          </List.Item>
        );
      }}
    />
  );
}
