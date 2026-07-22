export default function MapPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-primary/10 p-4" aria-hidden="true">
        <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-text">Monitoring Map</h1>
      <p className="mt-2 max-w-md text-text-muted">
        Interactive pond map will be available here in Phase 4. Pond locations with color-coded ammonia status pins.
      </p>
    </div>
  );
}
