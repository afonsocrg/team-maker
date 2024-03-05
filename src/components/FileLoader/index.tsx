import { Person } from "@types";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { parseCsvContent } from "@utils/csv";

type Props = {
  onLoad: (newParticipants: Person[]) => void;
};
export default function FileLoader({ onLoad }: Props) {
  const handleFileChange = (file) => {
    if (file) {
      // Use FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // Parse the CSV content using Papaparse
        parseCsvContent(content, onLoad);
      };
      reader.readAsText(file); // Read file as text
    }
  };

  // const parseCsvContent = (content) => {
  //   // Use Papaparse to parse CSV content
  //   Papa.parse(content, {
  //     complete: function (results) {
  //       console.log("Parsed CSV data:", results.data);
  //       onLoad(results.data.map((data, idx) => ({ id: idx, ...data })));
  //       // Here you have access to the parsed CSV data
  //     },
  //     header: true, // If CSV file has a header row
  //     dynamicTyping: true, // Convert numeric values to numbers
  //   });
  // };

  return (
    <Upload
      accept=".csv"
      customRequest={({ file }) => handleFileChange(file)}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Import participants</Button>
    </Upload>
  );
}
