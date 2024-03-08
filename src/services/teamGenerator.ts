import { Person } from "@types";
import { getFirstLastName } from "@utils/names";
import { message } from "antd";

function allIndicesOf<t>(array: t[], value: t): number[] {
  return array
    .map((v, idx) => (v === value ? idx : null))
    .filter((i) => i !== null);
}

function selectRandom<t>(items: t[]): t {
  const idx = Math.floor(Math.random() * items.length);
  return items[idx];
}

type Filter = {
  feature: string;
  value: any;
};

function searchParticipants(participants: Person[], filters: Filter[]) {
  return participants.filter((p) =>
    filters.every((f) => p[f.feature] === f.value)
  );
}

export function getFeatureHistogram(
  participants: Person[],
  nTeams: number,
  feature: string,
  value: any
) {
  const featureHistogram = new Array(nTeams).fill(0);
  participants.forEach((p) => {
    if (p[feature] === value) {
      featureHistogram[p.team] += 1;
    }
  });
  return featureHistogram;
}

function findWorstDistributedFeature(
  participants: Person[],
  nTeams: number,
  features: string[]
) {
  // Return the feature, value pair with the highest amplitude between min and max in histogram
  const featureValues = {};
  for (const f of features) {
    featureValues[f] = new Set(participants.map((p) => p[f]));
  }
  let worstScore = null;
  let worstFeatureValuePairs = [];
  for (const [f, values] of Object.entries(featureValues)) {
    for (const v of values) {
      const hist = getFeatureHistogram(participants, nTeams, f, v);
      const min = Math.min.apply(null, hist);
      const max = Math.max.apply(null, hist);
      const diff = max - min;
      if (diff < 2) continue;

      if (worstScore === null || diff > worstScore) {
        worstScore = diff;
        worstFeatureValuePairs = [{ feature: f, value: v, histogram: hist }];
      } else if (diff == worstScore) {
        worstScore = diff;
        worstFeatureValuePairs.push({ feature: f, value: v, histogram: hist });
      }
    }
  }

  console.log(worstFeatureValuePairs);
  const result = selectRandom(worstFeatureValuePairs);
  console.log(result);
  return result;
}

function balance(
  participants: Person[],
  nTeams: number,
  feature: string,
  value: any,
  histogram
): Person[] {
  const min = Math.min.apply(null, histogram);
  const max = Math.max.apply(null, histogram);

  if (max - min <= 1) {
    console.log("Balance: Nothing to do");
    return null;
  }

  // Select a random team from the ones with the max value
  // Select a random team from the minimum value
  const minTeams = allIndicesOf(histogram, min);
  const maxTeams = allIndicesOf(histogram, max);

  const toTeam = selectRandom(minTeams);
  const fromTeam = selectRandom(maxTeams);

  // console.log(featureHistogram);
  // console.log("min", min, minTeams, toTeam);
  // console.log("max", max, maxTeams, fromTeam);

  // Select a random player from the max team (that has the given feature)
  // Select a random player from the min team (any)
  const fromParticipants = searchParticipants(participants, [
    { feature: "team", value: fromTeam },
    { feature, value },
  ]);
  const toParticipants = searchParticipants(participants, [
    { feature: "team", value: toTeam },
  ]);

  const selectedFromParticipant = selectRandom(fromParticipants);
  const selectedToParticipant = selectRandom(toParticipants);
  // console.log("from", fromParticipants, selectedFromParticipant);
  // console.log("to", toParticipants, selectedToParticipant);

  selectedFromParticipant.team = toTeam;
  selectedToParticipant.team = fromTeam;

  const [fromFirst, fromLast] = getFirstLastName(selectedFromParticipant.name);
  const [toFirst, toLast] = getFirstLastName(selectedToParticipant.name);

  message.success(
    `Swapping ${fromFirst} ${fromLast} from team ${max} with ${toFirst} ${toLast} from team ${min}`
  );

  return participants;
}

export function generateTeams(
  participants: Person[],
  nTeams,
  features: string[]
) {
  const result = findWorstDistributedFeature(participants, nTeams, features);
  if (result === null) return null;
  const { feature, value, histogram } = result;
  return balance(participants, nTeams, feature, value, histogram);
}

export function randomAssign(participants: Person[], nTeams: number): Person[] {
  return participants.map(({ ...p }, idx) => ({ ...p, team: idx % nTeams }));
}
