import { CheckCircle, Send, Loader2 } from 'lucide-react';
import { Reveal } from '@/shared/animations/Reveal';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { cn } from '@/shared/lib/cn';
import { useContactForm } from '../hooks/useContactForm';
import { SITE } from '@/shared/constants/site';

interface FieldProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, id, required = false, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-mono text-xs text-f2 tracking-wide uppercase">
        {label}{required && <span className="text-mint ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-mono text-xs text-rose">{error}</p>
      )}
    </div>
  );
}

const inputBase =
  'w-full bg-s2 border border-ln text-f0 font-mono text-sm px-4 py-3 rounded-sm ' +
  'placeholder:text-f3 ' +
  'focus:outline-none focus:border-mint focus:bg-s3 ' +
  'hover:border-ln2 transition-colors duration-base';

export function ContactSection() {
  const { form, onSubmit, mutation } = useContactForm();
  const { register, formState: { errors } } = form;
  const { isPending, isSuccess, isError, error } = mutation;

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-ln">
      <div className="px-6">
        <SectionHeader
          index="07"
          label="TRANSMISSION"
          command="open transmission.socket"
        />

        <Reveal className="grid md:grid-cols-2 gap-10 lg:gap-20">
          {/* Left — copy */}
          <div className="space-y-6">
            <p className="text-f1 text-base leading-relaxed">
              Transmission open. Available for freelance projects, technical collaborations,
              and academic inquiries. Reply within 24 hours.
            </p>
            <div className="space-y-3">
              <div className="font-mono text-xs text-f3 tracking-wider uppercase">Direct channels</div>
              <a
                href={`mailto:${SITE.email}`}
                className="block font-mono text-sm text-f1 hover:text-mint transition-colors duration-base"
              >
                ↗ {SITE.email}
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-sm text-f1 hover:text-mint transition-colors duration-base"
              >
                ↗ linkedin.com/in/alae-ddine-said-medjahed
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-sm text-f1 hover:text-mint transition-colors duration-base"
              >
                ↗ github.com/alaesm
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {isSuccess ? (
              <div className="border border-mint/30 bg-mint/5 p-6 rounded-sm flex items-start gap-3">
                <CheckCircle size={18} strokeWidth={1.5} className="text-mint shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-sm text-mint mb-1">transmission sent.</div>
                  <p className="text-f1 text-sm">
                    Your message has been received. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Name" id="name" required error={errors.name?.message}>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="your name"
                      className={inputBase}
                      {...register('name')}
                    />
                  </Field>
                  <Field label="Email" id="email" required error={errors.email?.message}>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      className={inputBase}
                      {...register('email')}
                    />
                  </Field>
                </div>
                <Field label="Subject" id="subject" required error={errors.subject?.message}>
                  <input
                    id="subject"
                    type="text"
                    placeholder="project inquiry / collaboration / ..."
                    className={inputBase}
                    {...register('subject')}
                  />
                </Field>
                <Field label="Message" id="message" required error={errors.message?.message}>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="describe your project or inquiry..."
                    className={cn(inputBase, 'resize-none')}
                    {...register('message')}
                  />
                </Field>

                {isError && (
                  <p className="font-mono text-xs text-rose">
                    error: {error instanceof Error ? error.message : 'transmission failed. try again.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    'w-full sm:w-auto flex items-center justify-center gap-2',
                    'font-mono text-sm px-6 py-3 rounded-sm',
                    'bg-mint text-s0 font-medium',
                    'hover:brightness-110 active:translate-y-px transition-all duration-fast',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
                  )}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                      sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} strokeWidth={1.5} />
                      Send Transmission
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
