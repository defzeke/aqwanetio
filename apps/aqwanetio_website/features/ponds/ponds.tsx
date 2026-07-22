import { pondsService } from "./services";
import PondCard from "./components/PondCard";

export default function Ponds() {
  const ponds = pondsService.getAll();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text">Monitored Ponds</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {ponds.map((pond) => (
          <PondCard key={pond.id} pond={pond} />
        ))}
      </div>
    </div>
  );
}
