import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-dark text-white px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AquaNetIO
        </h1>
        <p className="mt-4 text-lg text-white/80">
          Real-time aquaculture water quality monitoring and ammonia toxicity prediction system
        </p>
        <p className="mt-2 text-sm text-white/60">
          DOST-Advanced Science and Technology Institute
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/map"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
          >
            View Monitoring Map
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
          >
            Learn About Ammonia
          </Link>
        </div>
      </div>
    </div>
  );
}
