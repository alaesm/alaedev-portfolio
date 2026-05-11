import { Reveal } from '@/shared/animations/Reveal';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { SectionSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { useEducation } from '../hooks/usePortfolioData';

export function AcademicTrackSection() {
  const { data: education, isLoading, isError } = useEducation();

  return (
    <section id="academic" className="py-20 md:py-28 border-t border-ln">
      <div className="px-6">
        <SectionHeader
          index="05"
          label="ACADEMIC TRACK"
          command="cat academic.log"
          accent="amber"
        />

        {isLoading && <SectionSkeleton />}
        {isError   && <ErrorState message="Could not load education data." />}

        {!isLoading && !isError && education && (
          <Reveal className="grid md:grid-cols-2 gap-6">
            {/* Completed degree */}
            {education.map((item) => (
              <div key={item.id} className="border border-amber/30 bg-amber/5 p-6 rounded-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <StatusBadge label="COMPLETED" variant="amber" dot />
                  <span className="font-mono text-xs text-f3">
                    {item.startYear} – {item.graduationYear}
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-f0 text-base mb-1">
                  {item.degree}
                </h3>
                <p className="font-mono text-xs text-amber mb-1">{item.field}</p>
                <p className="font-mono text-xs text-f2 mb-4">
                  {item.institution} · {item.location}
                </p>
                <p className="text-f1 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                {item.graduationProject && (
                  <div className="pt-4 border-t border-amber/20">
                    <div className="font-mono text-xs text-f3 mb-1 tracking-wider uppercase">
                      Graduation Project
                    </div>
                    <div className="font-mono text-sm text-amber">{item.graduationProject}</div>
                  </div>
                )}
                {item.achievements.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {item.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 font-mono text-xs text-f2">
                        <span className="text-amber mt-px shrink-0">→</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Target */}
            <div className="border border-ln bg-s1 p-6 rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <StatusBadge label="TARGET" variant="neutral" dot />
                  <span className="font-mono text-xs text-f3">2026+</span>
                </div>
                <h3 className="font-sans font-semibold text-f0 text-base mb-1">
                  Master&apos;s Degree in Artificial Intelligence
                </h3>
                <p className="font-mono text-xs text-amber mb-4">
                  Artificial Intelligence &amp; Intelligent Systems
                </p>
                <p className="text-f1 text-sm leading-relaxed">
                  Targeting a Master&apos;s program in Artificial Intelligence in Saudi Arabia.
                  Motivated by academic excellence, research in AI, and the opportunity to contribute
                  to intelligent digital systems in the region.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ln">
                <div className="font-mono text-xs text-f3 tracking-wider uppercase mb-2">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning', 'Intelligent Systems', 'Natural Language Processing', 'Data Science'].map((area) => (
                    <span key={area}
                      className="font-mono text-xs border border-amber/30 text-amber/80 px-2 py-0.5 rounded-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
