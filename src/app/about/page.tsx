export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">About The Wealth Modeler</h1>
      <p className="text-gray-600">
        The Wealth Modeler was created to make financial planning approachable and transparent. Our calculators are designed for people
        pursuing retirement, Financial Independence, or simply wanting clarity on their investment journey.
      </p>
      <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-card md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Our Approach</h2>
          <p className="text-sm text-gray-600">
            We focus on clean design, clear math, and actionable insights. Everything runs client-side, so your numbers stay private on
            your device.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">What&apos;s Next</h2>
          <p className="text-sm text-gray-600">
            More calculators, scenario comparisons, and data visualizations are on the way. We aim to be the simplest toolkit for FIRE and
            retirement planning.
          </p>
        </div>
      </div>
    </div>
  );
}
