export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} DOST-ASTI. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            AquaNetIO &mdash; Aquaculture Water Quality Monitoring System
          </p>
        </div>
      </div>
    </footer>
  );
}
