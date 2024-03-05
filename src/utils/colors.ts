export function colorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const randomColor = Math.floor(
    Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216)
  ).toString(16);
  return "#" + Array(6 - randomColor.length + 1).join("0") + randomColor;
}

export function getContrastColor(hexColor: string): string {
  const threshold = 130; // threshold for perceived brightness
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > threshold ? "#000000" : "#ffffff"; // black or white text color
}

export function interpolateColor(minStrength, maxStrength, strength) {
  // Define the RGB values for red and golden colors
  const red = [100, 0, 17]; // [R, G, B]
  const golden = [245, 220, 0]; // [R, G, B]

  // Interpolate between red and golden based on the strength value
  const interpolatedColor = red.map((channel, index) => {
    const channelDiff = golden[index] - channel;
    const strengthRatio =
      (strength - minStrength) / (maxStrength - minStrength);
    return Math.round(channel + channelDiff * strengthRatio);
  });

  // Convert interpolated RGB values to hexadecimal color string
  const hexColor = interpolatedColor.reduce((acc, channel) => {
    const hex = channel.toString(16).padStart(2, "0");
    return acc + hex;
  }, "#");

  return hexColor;
}
