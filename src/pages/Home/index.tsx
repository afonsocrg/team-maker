import "./styles.css";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button, List, Typography } from "antd";
import { CoffeeOutlined, DownloadOutlined } from "@ant-design/icons";
import type { Person } from "@types";
import ParticipantList from "@components/ParticipantList";
import TeamCard from "@components/TeamCard";
import FileLoader from "@components/FileLoader";
import { unparseCsvContent } from "@utils/csv";
import Statistics from "@components/Statistics";

function get_feature_distribution(
  participants: Person[],
  nTeams: number,
  property: string
) {
  const teams = new Set<number>();
  const values = new Set();
  const data = new Map<string, number>();
  for (const p of participants) {
    const team = p.team;
    const featureValue = p[property];
    if (team === undefined) continue;
    if (featureValue === undefined) continue;
    teams.add(team);
    values.add(featureValue);
    const mapKey = JSON.stringify([featureValue, team]);
    data.set(mapKey, (data.get(mapKey) || 0) + 1);
  }

  const result = [];
  for (let team = 0; team < nTeams; team++) {
    for (const value of values) {
      result.push({
        y: `Team ${team + 1}`,
        x: value,
        value: data.get(JSON.stringify([value, team])) || 0,
      });
    }
  }

  return result;
}

function get_size_distribution(participants: Person[], nTeams: number) {
  const result = [];
  for (let team = 0; team < nTeams; team++) {
    result.push({
      y: `Team ${team + 1}`,
      x: "Size",
      value: participants.filter((p) => p.team === team).length,
    });
  }
  return result;
}

export default function Home() {
  const [participants, setParticipants] = useLocalStorage<Person[]>(
    "participants",
    []
  );
  const [nTeams, setNTeams] = useLocalStorage<number>("teams", 4);

  const teams = Array.from(Array(nTeams).keys()).map((teamId) =>
    participants.filter((p) => p.team === teamId)
  );

  const features = new Set();
  participants.forEach((p) => {
    for (const feature in p) {
      features.add(feature);
    }
  });
  // console.log(features);

  const statistics = [
    {
      title: "Tamanho",
      dist: get_size_distribution(participants, nTeams),
    },
    {
      title: "Agrupamento",
      dist: get_feature_distribution(participants, nTeams, "group"),
    },
    {
      title: "Género",
      dist: get_feature_distribution(participants, nTeams, "sex"),
    },
    {
      title: '"Força"',
      dist: get_feature_distribution(participants, nTeams, "strength"),
    },
  ];

  const unassignedParticipants = participants.filter(
    (p) => p.team === null || p.team === undefined
  );

  const createTeam = () => {
    setNTeams((prev) => prev + 1);
  };

  const removeTeam = (teamId) => {
    setParticipants((prev) =>
      prev.map((p) => {
        const { team, ...newPerson } = p;
        if (team === undefined || team < teamId) {
          return p;
        } else if (team === teamId) {
          return { ...newPerson };
        } else {
          return { team: team - 1, ...newPerson };
        }
      })
    );
    setNTeams(nTeams - 1);
  };

  const assignParticipant = (
    participantId: number,
    newTeamId: number | undefined
  ) => {
    // console.log(`Assigning participant ${participantId} to team ${newTeamId}`)
    setParticipants((prev) => {
      return prev.map((p) => {
        if (p.id !== participantId) return p;
        const { team, ...newP } = p;
        return { team: newTeamId, ...newP };
      });
    });
  };

  const loadParticipants = (newParticipants) => {
    setParticipants(newParticipants);
    setNTeams(
      Math.max.apply(
        null,
        newParticipants.map((p) => (p.team || 0) + 1)
      )
    );
  };

  const handleExportCsv = () => {
    // Convert participants data to CSV format
    const csv = unparseCsvContent(participants);
    // Create a Blob object to hold the CSV data
    const blob = new Blob([csv], { type: "text/csv" });
    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);
    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "teams.csv");
    // Simulate a click on the link to start the download
    document.body.appendChild(link);
    link.click();
    // Clean up by revoking the temporary URL
    window.URL.revokeObjectURL(url);
    // Remove the link element from the DOM
    document.body.removeChild(link);
  };

  return (
    <div>
      {nTeams > 0 && (
        <div className="statistics-section">
          {/* <Title level={2}>Statistics</Title> */}
          <Statistics statistics={statistics} />
        </div>
      )}
      <div className="action-bar">
        <FileLoader onLoad={loadParticipants} />
        <Button icon={<CoffeeOutlined />}>Generate teams</Button>
        <Button icon={<DownloadOutlined />} onClick={handleExportCsv}>
          Export Teams
        </Button>
      </div>
      <div className="team-manager">
        <div className="participant-list">
          <ParticipantList
            participants={unassignedParticipants}
            id={undefined}
            onMove={assignParticipant}
          />
        </div>
        <div className="team-list">
          <List
            grid={{
              gutter: 16,
              // column: 2,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={teams}
            loadMore={<Button onClick={createTeam}>Add Team</Button>}
            renderItem={(participants, idx) => {
              return (
                <List.Item>
                  <TeamCard
                    participants={participants}
                    id={idx}
                    assignParticipant={assignParticipant}
                    onDelete={() => removeTeam(idx)}
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
