export function getFirstLastName(fullName: string) {
  const split = fullName.split(" ");
  const firstName = split[0];
  const lastName = split[split.length - 1];
  return [firstName, lastName]
}
