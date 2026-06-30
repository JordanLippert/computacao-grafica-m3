import { useRef } from "react";
import { useSimulation } from "./hooks/useSimulation";
import { Controls } from "./ui/Controls";
import { Hud } from "./ui/Hud";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stats, controls, defaults } = useSimulation(canvasRef);

  return (
    <div className="flex h-screen">
      <div className="relative flex-1">
        <canvas ref={canvasRef} className="block h-full w-full" />
        <Hud stats={stats} />
      </div>
      <Controls controls={controls} defaults={defaults} />
    </div>
  );
}
