import Papa from "papaparse";

export async function parseCsvContent(content, onComplete) {
  Papa.parse(content, {
    complete: function (results) {
      const postProcessed = results.data.map((data, idx) => {
        if (data.id === undefined) {
          data.id = idx;
        }
        return data;
      });
      onComplete(postProcessed);
    },
    header: true, // If CSV file has a header row
    dynamicTyping: true, // Convert numeric values to numbers
  });
}

export function unparseCsvContent(content): string {
  return Papa.unparse(content);
}
