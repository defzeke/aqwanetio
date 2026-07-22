import { readingsService } from "./services";
import ReadingsTable from "./components/ReadingsTable";

export default function Readings({ pondId = "pond-1" }: { pondId?: string }) {
  const readings = readingsService.getByPond(pondId, 12);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text">Latest Sensor Readings</h2>
      <ReadingsTable readings={readings} />
    </div>
  );
}
