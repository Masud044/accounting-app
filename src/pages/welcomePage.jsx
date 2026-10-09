import FarmStatsCards from "./farmstate-card";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <FarmStatsCards />
      </div>
    </div>
  );
}