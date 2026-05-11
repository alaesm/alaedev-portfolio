import { Reveal } from '@/shared/animations/Reveal';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { TechBadge } from '@/shared/components/ui/TechBadge';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { SectionSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { useExperience } from '../hooks/usePortfolioData';
import { formatDateRange } from '../utils/portfolio.utils';

export function ExperienceSection() {
  const { data: experience, isLoading, isError } = useExperience();

  return (
    <section id="experience" className="py-20 md:py-28 border-t border-ln">
      <div className="px-6">
        <SectionHeader
          index="03"
          label="EXPERIENCE"
          command="cat experience.log"
        />

        {isLoading && <SectionSkeleton />}
        {isError   && <ErrorState message="Could not load experience." />}

        {!isLoading && !isError && experience && (
          <Reveal className="space-y-0">
            {experience.map((item, idx) => (
              <div
                key={item.id}
                className="relative border border-ln bg-s1 p-6 md:p-8 hover:bg-s2 motion-safe:transition-colors motion-safe:duration-base"
                style={{ marginTop: idx > 0 ? '-1px' : 0 }}
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-5">
                  <div>
                    <h3 className="font-sans font-semibold text-f0 text-lg mb-1">
                      {item.title}
                    </h3>
                    <div className="font-mono text-xs text-f2 flex items-center gap-2">
                      <span>{item.location}</span>
                      <span className="text-f3">·</span>
                      <span>{formatDateRange(item.startDate, item.endDate)}</span>
                    </div>
                  </div>
                  <StatusBadge
                    label={item.endDate === 'Present' ? 'CURRENT' : 'PAST'}
                    variant={item.endDate === 'Present' ? 'mint' : 'neutral'}
                    dot
                  />
                </div>

                {/* Description */}
                <p className="text-f1 text-sm leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Highlights */}
                {item.highlights.length > 0 && (
                  <ul className="space-y-1.5 mb-5">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 font-mono text-xs text-f2">
                        <span className="text-mint mt-px shrink-0">→</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Technologies */}
                {item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-ln">
                    {item.technologies.map((tech) => (
                      <TechBadge key={tech} label={tech} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
