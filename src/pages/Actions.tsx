import { CalendarDays } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { SectionTitle } from "../components/common/SectionTitle";
import { ActionCard } from "../components/cards/ActionCard";
import { actions } from "../data/siteData";

export function Actions() {
  return (
    <>
      <PageBanner title="Nos Actions" icon={CalendarDays} />
      <main className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle
            eyebrow="Nos initiatives"
            title="Agir concrètement, sourire durablement"
            text="Découvrez l'ensemble de nos projets imaginés pour accompagner les enfants extraordinaires et favoriser leur inclusion."
          />
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => (
              <ActionCard key={action.slug} action={action} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

