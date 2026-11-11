import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowRight, MapPin, ExternalLink, Check } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { InstagramIcon } from "../components/common/InstagramIcon";
import { ASSOCIATION_INFO, INSTAGRAM_URL } from "../data/siteData";

const contactSchema = z.object({
  name: z.string().min(2, "Veuillez indiquer votre nom complet."),
  email: z.string().email("Veuillez saisir une adresse email valide."),
  subject: z.string().min(3, "Veuillez préciser le sujet de votre message."),
  message: z.string().min(10, "Votre message doit contenir au moins 10 caractères."),
  consent: z.literal(true, {
    message: "Votre consentement est requis pour le traitement de votre demande.",
  }),
});

type ContactData = z.infer<typeof contactSchema>;

export function Contact() {
  const [submittedData, setSubmittedData] = useState<ContactData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactData) => {
    setSubmittedData(data);
  };

  return (
    <>
      <PageBanner title="Nous Contacter" icon={Mail} />
      <main className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr]">
          {/* Left info column */}
          <div>
            <p className="eyebrow">Contactez-nous</p>
            <h2 className="section-title !text-left">Une question, un projet, une idée ?</h2>
            <p className="mt-5 leading-7 text-stone-600">
              Que vous soyez une famille en quête d'accompagnement, un bénévole souhaitant agir ou un partenaire local, nous serons ravis d'échanger avec vous.
            </p>

            <div className="mt-8 space-y-4">
              {/* Instagram Card */}
              <div className="rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white">
                    <InstagramIcon size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-pink-900 text-sm">Message direct sur Instagram</h3>
                    <p className="text-xs text-stone-600">Le canal le plus réactif</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-stone-600">
                  Écrivez-nous directement en message privé sur notre compte officiel <b>{ASSOCIATION_INFO.instagram}</b>.
                </p>
                <div className="mt-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-pink-700 hover:text-pink-900"
                  >
                    <span>Ouvrir l'application Instagram</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Siège social */}
              <div className="rounded-2xl bg-stone-50 p-5 border border-stone-200">
                <div className="flex items-start gap-3">
                  <MapPin className="text-pink-600 mt-1 shrink-0" size={20} />
                  <div>
                    <h3 className="font-bold text-[#73143e] text-sm">Siège de l’association</h3>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                      {ASSOCIATION_INFO.name}<br />
                      {ASSOCIATION_INFO.address}<br />
                      {ASSOCIATION_INFO.postalCode} {ASSOCIATION_INFO.city} (Loiret, 45)
                    </p>
                    <p className="mt-2 text-[11px] text-stone-500">
                      RNA : {ASSOCIATION_INFO.rna} • SIREN : {ASSOCIATION_INFO.siren}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 md:p-8" noValidate>
              <div>
                <label className="block">
                  <span className="label">Nom et prénom *</span>
                  <input
                    type="text"
                    className="input mt-2"
                    placeholder="Ex. Marie Dupont"
                    {...register("name")}
                  />
                </label>
                {errors.name && <span className="error">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block">
                  <span className="label">Adresse email *</span>
                  <input
                    type="email"
                    className="input mt-2"
                    placeholder="marie.dupont@example.com"
                    {...register("email")}
                  />
                </label>
                {errors.email && <span className="error">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block">
                  <span className="label">Sujet de votre message *</span>
                  <input
                    type="text"
                    className="input mt-2"
                    placeholder="Ex. Inscription activité, proposition de bénévolat…"
                    {...register("subject")}
                  />
                </label>
                {errors.subject && <span className="error">{errors.subject.message}</span>}
              </div>

              <div>
                <label className="block">
                  <span className="label">Votre message *</span>
                  <textarea
                    rows={5}
                    className="input mt-2 resize-none"
                    placeholder="Expliquez-nous votre demande avec quelques détails…"
                    {...register("message")}
                  />
                </label>
                {errors.message && <span className="error">{errors.message.message}</span>}
              </div>

              <label className="flex items-start gap-3 text-sm text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 accent-pink-600"
                  {...register("consent")}
                />
                <span>
                  J’accepte que les informations saisies soient utilisées par l’association pour répondre à ma demande.
                </span>
              </label>
              {errors.consent && <span className="error">{errors.consent.message}</span>}

              <button className="btn-primary w-full justify-center" type="submit">
                <span>Envoyer le message</span>
                <ArrowRight size={17} />
              </button>

              {submittedData && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Check className="text-emerald-600" size={18} />
                    <span>Merci {submittedData.name}, votre message est prêt !</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Pour l'envoyer immédiatement depuis votre messagerie électronique préférée, vous pouvez cliquer sur le lien ci-dessous :
                  </p>
                  <div>
                    <a
                      href={`mailto:contact@un-sourire-pour-tissem.fr?subject=${encodeURIComponent(
                        submittedData.subject
                      )}&body=${encodeURIComponent(
                        `De: ${submittedData.name} (${submittedData.email})\n\nMessage:\n${submittedData.message}`
                      )}`}
                      className="inline-flex items-center gap-1 font-bold text-emerald-950 underline text-xs"
                    >
                      <span>Ouvrir dans mon logiciel de messagerie</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
