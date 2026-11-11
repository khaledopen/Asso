import { useState } from "react";
import { Heart, ShieldCheck, Sparkles, Users, HandHeart, ExternalLink, Check } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { SectionTitle } from "../components/common/SectionTitle";
import { HELLOASSO_URL, HELLOASSO_DONATION_URL, ASSOCIATION_INFO } from "../data/siteData";

export function Donation() {
  const [amount, setAmount] = useState("25 €");

  return (
    <>
      <PageBanner title="Faire un Don" icon={Heart} />
      <main className="py-16">
        <div className="mx-auto max-w-5xl px-5">
          <SectionTitle
            eyebrow="Soutenez nos actions"
            title="Chaque geste fait grandir un sourire ♡"
            text="Vos dons permettent de financer le matériel adapté, les séances de sport inclusif et les sorties des enfants."
          />

          <div className="card p-6 md:p-10">
            <h2 className="text-xl font-extrabold text-[#73143e] mb-4">
              Choisissez le montant de votre soutien
            </h2>

            <div className="grid gap-3 sm:grid-cols-5">
              {["5 €", "10 €", "25 €", "50 €", "Montant libre"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`donation-option ${amount === a ? "selected" : ""}`}
                >
                  {a}
                </button>
              ))}
            </div>

            {amount === "Montant libre" && (
              <label className="mt-5 block">
                <span className="label">Indiquez votre montant personnalisé (€)</span>
                <input
                  className="input mt-2"
                  inputMode="decimal"
                  placeholder="Ex. 30 €"
                  defaultValue=""
                />
              </label>
            )}

            <div className="mt-7 rounded-2xl border border-pink-200 bg-pink-50 p-6 text-sm leading-6 text-stone-700 space-y-3">
              <div className="flex items-center gap-2 font-bold text-pink-800">
                <ShieldCheck className="text-pink-600" size={22} />
                <span>Collecte 100% sécurisée via HelloAsso</span>
              </div>
              <p>
                L'association <b>{ASSOCIATION_INFO.name}</b> utilise la plateforme officielle <b>HelloAsso</b>, outil solidaire et sécurisé pour les associations loi 1901.
              </p>
              <ul className="text-xs space-y-1 text-stone-600 list-disc list-inside">
                <li>Paiement sécurisé par carte bancaire (3D Secure).</li>
                <li>Aucune coordonnée bancaire n'est stockée sur notre site.</li>
                <li>Reçu fiscal automatique par email si éligible.</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={HELLOASSO_DONATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 justify-center !py-4 text-base"
              >
                <span>Faire mon don sur HelloAsso ({amount})</span>
                <Heart size={18} fill="currentColor" />
                <ExternalLink size={15} />
              </a>

              <a
                href={HELLOASSO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary justify-center !py-4"
              >
                <span>Adhérer à l’association</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              [Sparkles, "Matériel & mallettes adaptés", "Achat de jeux sensoriels et supports pédagogiques spécifiques."],
              [Users, "Activités physiques inclusives", "Organisation de cours de boxe adaptée, zumba et motricité."],
              [HandHeart, "Soutien direct aux familles", "Accompagnement moral, sorties récréatives et répit parental."],
            ].map(([Icon, title, desc]) => (
              <div key={title as string} className="mini-card flex-col items-start p-6 text-left">
                <Icon className="text-pink-600 mb-2" size={28} />
                <b className="text-base text-[#73143e]">{title as string}</b>
                <p className="mt-1 text-xs text-stone-600 leading-5">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

