export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-accent/10 p-4" aria-hidden="true">
        <svg className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-text">Analytics</h1>
      <p className="mt-2 max-w-md text-text-muted">
        Detailed analytics dashboard with time-series charts, predictions, and STL trend decomposition will be available in Phase 4&ndash;5.
      </p>
    </div>
  );
}
