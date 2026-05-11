import { GithubIcon, LinkedinIcon } from '@/shared/components/ui/SocialIcons';
import { SITE } from '@/shared/constants/site';

export function FooterSection() {
  return (
    <footer className="border-t border-ln py-8">
      <div className="px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Signature */}
          <p className="font-mono text-xs text-f3 tracking-wide">
            // &copy; {SITE.year} ALAEDEV — built in tlemcen. signal stable.
          </p>

          {/* Links */}
          <div className="flex items-center gap-5">
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-f3 hover:text-mint transition-colors duration-base"
            >
              <GithubIcon size={14} />
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-f3 hover:text-mint transition-colors duration-base"
            >
              <LinkedinIcon size={14} />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono text-xs text-f3 hover:text-mint transition-colors duration-base"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
