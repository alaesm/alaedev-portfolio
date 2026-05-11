import { Reveal } from '@/shared/animations/Reveal';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { TechBadge } from '@/shared/components/ui/TechBadge';
import { SectionSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { useSkills } from '../hooks/usePortfolioData';

export function TechStackSection() {
  const { data: skills, isLoading, isError } = useSkills();

  return (
    <section id="stack" className="py-20 md:py-28 border-t border-ln">
      <div className="px-6">
        <SectionHeader
          index="02"
          label="STACK"
          command="ls -la ./technologies"
        />

        {isLoading && <SectionSkeleton />}
        {isError   && <ErrorState message="Could not load skills." />}

        {!isLoading && !isError && skills && (
          <Reveal className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-ln border border-ln rounded-sm overflow-hidden">
            {skills.map((group, idx) => (
              <div key={group.id} className="bg-s0 p-6 hover:bg-s1 transition-colors duration-base">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs text-f3">
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>
                  <span className="font-mono text-xs text-mint tracking-widest uppercase">
                    {group.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <TechBadge key={skill} label={skill} />
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
