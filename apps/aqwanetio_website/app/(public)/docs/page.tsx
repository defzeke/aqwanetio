export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text">Documentation</h1>
      <p className="mt-2 text-text-muted">
        Science and methodology behind ammonia toxicity monitoring.
      </p>

      <section className="mt-8 space-y-6">
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">What is Ammonia Toxicity?</h2>
          <p className="mt-2 text-text-muted leading-relaxed">
            Ammonia (NH₃) is a toxic waste product excreted by fish and produced by
            decomposition of organic matter in aquaculture ponds. Even at low
            concentrations, it can cause gill damage, reduce growth, and lead to mass
            mortality. The danger depends on water pH and temperature &mdash; higher
            pH and temperature make ammonia more toxic.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">Monitoring Approach</h2>
          <p className="mt-2 text-text-muted leading-relaxed">
            AquaNetIO uses real-time sensor data combined with machine learning models
            (XGBoost/RNN) to predict ammonia levels 6 hours ahead. STL decomposition
            separates the signal into trend, seasonal, and residual components for
            deeper analysis.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">Threshold Guidelines</h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-safe shrink-0" aria-hidden="true" />
              <span className="text-sm text-text-muted"><strong className="text-text">Safe:</strong> Below 0.4 ppm NH₃ &mdash; normal operating range</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-warning shrink-0" aria-hidden="true" />
              <span className="text-sm text-text-muted"><strong className="text-text">Warning:</strong> 0.4&ndash;1.0 ppm NH₃ &mdash; action recommended</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-alert shrink-0" aria-hidden="true" />
              <span className="text-sm text-text-muted"><strong className="text-text">Toxic:</strong> Above 1.0 ppm NH₃ &mdash; immediate intervention required</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
