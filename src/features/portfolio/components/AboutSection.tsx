import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { ProfileSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { useProfile } from '../hooks/usePortfolioData';

const META_ROWS = [
  { key: 'name',       value: 'Said Medjahed Alaeddine' },
  { key: 'brand',      value: 'AlaeDev' },
  { key: 'location',   value: 'Tlemcen, Algeria' },
  { key: 'education',  value: 'B.Sc. Information Systems · 2025' },
  { key: 'freelance',  value: '2024 — Present' },
  { key: 'target',     value: "M.Sc. Artificial Intelligence · Saudi Arabia" },
];

export function AboutSection() {
  const { data: profile, isLoading, isError } = useProfile();

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="px-6">
        <SectionHeader
          index="01"
          label="IDENTITY"
          command="cat identity.md"
        />

        {isLoading && <ProfileSkeleton />}
        {isError   && <ErrorState message="Could not load profile." />}

        {!isLoading && !isError && (
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Metadata table — terminal file output */}
            <div className="border border-ln bg-s1 rounded-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-ln bg-s2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-mint/50" />
                <span className="ml-2 font-mono text-xs text-f3">identity.md</span>
              </div>
              <div className="p-5 space-y-3">
                {META_ROWS.map(({ key, value }) => (
                  <div key={key} className="flex gap-4 font-mono text-sm">
                    <span className="text-f3 shrink-0 w-20">{key}:</span>
                    <span className="text-f1">{value}</span>
                  </div>
                ))}
                {profile?.email && (
                  <div className="flex gap-4 font-mono text-sm">
                    <span className="text-f3 shrink-0 w-20">email:</span>
                    <a href={`mailto:${profile.email}`} className="text-mint hover:underline underline-offset-4">
                      {profile.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col justify-center space-y-5">
              <p className="text-f1 text-base leading-relaxed">
                {profile?.bio ?? 'Information Systems graduate from Abou Bekr Belkaid University of Tlemcen (2025), freelance software developer since 2024 building web applications, mobile apps, and backend systems for clients across Algeria and Saudi Arabia.'}
              </p>
              <p className="text-f2 text-sm leading-relaxed">
                Passionate about artificial intelligence and intelligent digital systems. Currently targeting a
                Master&apos;s degree in Artificial Intelligence in Saudi Arabia to deepen expertise in AI/ML and
                contribute to real-world intelligent systems.
              </p>
              <div className="pt-2 space-y-2">
                <div className="font-mono text-xs text-f3 tracking-wider uppercase">Links</div>
                <div className="flex flex-wrap gap-3">
                  {profile?.socialLinks && (
                    <>
                      <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-xs text-f2 hover:text-mint border border-ln px-3 py-1 rounded-sm hover:border-mint/45 transition-all duration-base">
                        ↗ github
                      </a>
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-xs text-f2 hover:text-mint border border-ln px-3 py-1 rounded-sm hover:border-mint/45 transition-all duration-base">
                        ↗ linkedin
                      </a>
                      <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-xs text-f2 hover:text-mint border border-ln px-3 py-1 rounded-sm hover:border-mint/45 transition-all duration-base">
                        ↗ portfolio
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
