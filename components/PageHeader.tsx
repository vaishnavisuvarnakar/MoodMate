import { Mascot } from "./Mascot";

export function PageHeader({
  title,
  subtitle,
  showMascot = false,
}: {
  title: string;
  subtitle?: string;
  showMascot?: boolean;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 text-on-surface">
        {title}
        {showMascot && <Mascot size={26} expression="happy" />}
      </h1>
      {subtitle && <p className="text-on-surface-variant mt-1 text-sm md:text-base">{subtitle}</p>}
    </header>
  );
}
