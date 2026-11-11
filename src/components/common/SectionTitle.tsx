interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  text?: string;
}

export function SectionTitle({ eyebrow, title, text }: SectionTitleProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {text && <p className="mt-4 text-stone-600">{text}</p>}
    </div>
  );
}

