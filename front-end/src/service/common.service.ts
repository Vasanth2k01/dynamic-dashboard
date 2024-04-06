export const toStartLetter = (data: string) => {
  return data
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/_/g, " ");
};
