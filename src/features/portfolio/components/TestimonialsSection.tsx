import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { SectionSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { useTestimonials } from '../hooks/usePortfolioData';

export function TestimonialsSection() {
  const { data: testimonials, isLoading, isError } = useTestimonials();

  return (
    <section id="testimonials" className="py-20 md:py-28 border-t border-ln">
      <div className="px-6">
        <SectionHeader
          index="06"
          label="CLIENT REPORTS"
          command="ls ./testimonials --verified"
        />

        {isLoading && <SectionSkeleton />}
        {isError   && <ErrorState message="Could not load testimonials." />}

        {!isLoading && !isError && testimonials && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((item) => (
              <div key={item.id} className="border border-ln bg-s1 p-6 rounded-sm flex flex-col">
                {/* Client info */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <div className="font-sans font-medium text-f0 text-sm">{item.clientName}</div>
                    {item.clientTitle && (
                      <div className="font-mono text-xs text-f2 mt-0.5">{item.clientTitle}</div>
                    )}
                    <div className="font-mono text-xs text-f3 mt-0.5">{item.clientLocation}</div>
                  </div>
                  <div className="font-mono text-xs text-f3 shrink-0">{item.date.slice(0, 7)}</div>
                </div>

                {/* Content */}
                <p className="text-f1 text-sm leading-relaxed italic flex-1 mb-5">
                  &ldquo;{item.content}&rdquo;
                </p>

                {/* Footer */}
                <div className="pt-4 border-t border-ln flex items-center justify-between">
                  <span className="font-mono text-xs text-f3">{item.projectType}</span>
                  {!item.approved && (
                    <span className="font-mono text-xs text-f3 border border-ln px-2 py-0.5 rounded-sm">
                      PENDING
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
