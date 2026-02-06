import { WelcomeSection } from '@/features/dashboard/components/welcome-section';
import { ModulesGrid } from '@/features/dashboard/components/modules-grid';

export default function Home() {
  return (
    <div className="space-y-6">
      <WelcomeSection />
      <ModulesGrid />
    </div>
  );
}
