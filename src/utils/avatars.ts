export function getAvatarSrc(gender: string, seed: number): string {
  if (gender === "M") {
    return `https://api.dicebear.com/5.x/avataaars/svg?top=dreads01,dreads02,eyepatch,frizzle,shortCurly,shortFlat,shortRound,shortWaved,sides,theCaesar,theCaesarAndSidePart,turban&seed=${seed}`;
  } else if (gender === "F") {
    return `https://api.dicebear.com/5.x/avataaars/svg?facialHairProbability=0&top=bigHair,bob,bun,curly,curvy,dreads,frida,fro,hijab,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,straightAndStrand,straight01,straight02&seed=${seed}`;
  } else {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  }
}
