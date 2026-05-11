'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project } from '@/features/portfolio/types/portfolio.types';
import { cn } from '@/shared/lib/cn';
import { formatMultilineList, parseMultilineList } from '@/shared/lib/multiline-list';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  technologies: z.string().min(1, 'Add at least one technology'),
  featuresText: z.string().optional(),
  challengesText: z.string().optional(),
  solutionsText: z.string().optional(),
  tagsText: z.string().optional(),
  screenshotsText: z.string().optional(),
  role: z.string().optional(),
  type: z.string().optional(),
  clientType: z.string().optional(),
  year: z.string().optional(),
  status: z.enum(['public', 'private', 'coming-soon']),
  featured: z.boolean().default(false),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  image: z.string().optional(),
  order: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/** Payload sent through admin APIs (URLs normalized to empty-string when blank). */
export type ProjectSubmitData = Omit<
  FormValues,
  | 'technologies'
  | 'featuresText'
  | 'challengesText'
  | 'solutionsText'
  | 'tagsText'
  | 'screenshotsText'
  | 'order'
> & {
  technologies: string[];
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  tags?: string[];
  screenshots?: string[];
  order?: number;
};

interface ProjectFormProps {
  defaultValues?: Partial<Project>;
  onSubmit: (data: ProjectSubmitData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const optionalUrlSchema = z
  .union([z.string().url(), z.literal('')])
  .optional();

const normalizeUrlInput = (u: string | undefined): string | undefined => {
  const t = u?.trim() ?? '';
  if (!t) return undefined;
  const parsed = optionalUrlSchema.safeParse(t);
  return parsed.success ? t : undefined;
};

const parseOrder = (raw: string | undefined): number | undefined => {
  if (raw === undefined || raw === null || raw === '') return undefined;
  const n = Number.parseInt(String(raw).trim(), 10);
  return Number.isFinite(n) ? n : undefined;
};

const inputClass =
  'w-full bg-s3 border border-ln rounded-sm px-3 py-2.5 font-mono text-xs text-f0 placeholder-f3 focus:outline-none focus:border-mint/50 transition-colors';
const labelClass = 'font-mono text-xs text-f3 block mb-1';
const errorClass = 'font-mono text-xs text-rose mt-1';

export function ProjectForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      slug: defaultValues?.slug ?? '',
      category: defaultValues?.category ?? '',
      description: defaultValues?.description ?? '',
      longDescription: defaultValues?.longDescription ?? '',
      technologies: defaultValues?.technologies?.join(', ') ?? '',
      featuresText: formatMultilineList(defaultValues?.features),
      challengesText: formatMultilineList(defaultValues?.challenges),
      solutionsText: formatMultilineList(defaultValues?.solutions),
      tagsText: formatMultilineList(defaultValues?.tags),
      screenshotsText: formatMultilineList(defaultValues?.screenshots),
      role: defaultValues?.role ?? '',
      type: defaultValues?.type ?? '',
      clientType: defaultValues?.clientType ?? '',
      year: defaultValues?.year ?? '',
      status: defaultValues?.status ?? 'public',
      featured: defaultValues?.featured ?? false,
      githubUrl: defaultValues?.githubUrl ?? '',
      liveUrl: defaultValues?.liveUrl ?? '',
      image: defaultValues?.image ?? '',
      order: defaultValues?.order !== undefined && defaultValues.order !== null ? String(defaultValues.order) : '',
    },
  });

  const submit = (values: FormValues) => {
    const technologies = values.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const features = parseMultilineList(values.featuresText);
    const challenges = parseMultilineList(values.challengesText);
    const solutions = parseMultilineList(values.solutionsText);
    const tags = parseMultilineList(values.tagsText);
    const screenshots = parseMultilineList(values.screenshotsText).flatMap((line) =>
      line
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    );

    onSubmit({
      title: values.title,
      slug: values.slug,
      category: values.category,
      description: values.description,
      longDescription: values.longDescription?.trim() || undefined,
      technologies,
      features: features.length ? features : undefined,
      challenges: challenges.length ? challenges : undefined,
      solutions: solutions.length ? solutions : undefined,
      tags: tags.length ? tags : undefined,
      screenshots: screenshots.length ? screenshots : undefined,
      role: values.role?.trim() || undefined,
      type: values.type?.trim() || undefined,
      clientType: values.clientType?.trim() || undefined,
      year: values.year?.trim() || undefined,
      status: values.status,
      featured: values.featured,
      githubUrl: normalizeUrlInput(values.githubUrl),
      liveUrl: normalizeUrlInput(values.liveUrl),
      image: normalizeUrlInput(values.image),
      order: parseOrder(values.order),
    });
  };

  const taClass = cn(inputClass, 'resize-none min-h-[96px] font-mono text-xs');

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 pb-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>title *</label>
          <input className={inputClass} placeholder="My Project" {...register('title')} />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelClass}>slug * (Firestore doc id)</label>
          <input className={inputClass} placeholder="my-project" {...register('slug')} />
          {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>category *</label>
          <input className={inputClass} placeholder="Web App" {...register('category')} />
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>
        <div>
          <label className={labelClass}>status *</label>
          <select className={cn(inputClass, 'cursor-pointer')} {...register('status')}>
            <option value="public">public</option>
            <option value="private">private</option>
            <option value="coming-soon">coming-soon</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>year</label>
          <input className={inputClass} placeholder='e.g. "2025"' {...register('year')} />
        </div>
        <div>
          <label className={labelClass}>order</label>
          <input type="number" className={inputClass} placeholder="sort key" {...register('order')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>type</label>
          <input className={inputClass} {...register('type')} />
        </div>
        <div>
          <label className={labelClass}>client type</label>
          <input className={inputClass} {...register('clientType')} />
        </div>
      </div>

      <div>
        <label className={labelClass}>short description * (cards)</label>
        <textarea
          className={cn(inputClass, 'resize-none h-20')}
          placeholder="Brief summary for cards..."
          {...register('description')}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClass}>long description</label>
        <textarea className={taClass} placeholder="Detail view / editorial copy..." {...register('longDescription')} />
      </div>

      <div>
        <label className={labelClass}>role / contribution</label>
        <textarea className={cn(inputClass, 'resize-none h-16')} {...register('role')} />
      </div>

      <div>
        <label className={labelClass}>technologies (comma-separated) *</label>
        <input
          className={inputClass}
          placeholder="React, TypeScript, Node.js"
          {...register('technologies')}
        />
        {errors.technologies && <p className={errorClass}>{errors.technologies.message}</p>}
      </div>

      <div>
        <label className={labelClass}>features · one bullet per line</label>
        <textarea className={taClass} placeholder="- Multi-tenant SaaS&#10;- Offline POS" {...register('featuresText')} />
      </div>

      <div>
        <label className={labelClass}>challenges · one per line</label>
        <textarea className={taClass} {...register('challengesText')} />
      </div>

      <div>
        <label className={labelClass}>solutions · one per line</label>
        <textarea className={taClass} {...register('solutionsText')} />
      </div>

      <div>
        <label className={labelClass}>tags · one per line</label>
        <textarea className={taClass} {...register('tagsText')} />
      </div>

      <div>
        <label className={labelClass}>screenshot urls · newline or comma</label>
        <textarea className={taClass} {...register('screenshotsText')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>github url</label>
          <input className={inputClass} placeholder="https://github.com/..." {...register('githubUrl')} />
        </div>
        <div>
          <label className={labelClass}>live url</label>
          <input className={inputClass} placeholder="https://..." {...register('liveUrl')} />
        </div>
      </div>

      <div>
        <label className={labelClass}>image url</label>
        <input className={inputClass} {...register('image')} />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" id="featured" className="accent-mint" {...register('featured')} />
        <label htmlFor="featured" className="font-mono text-xs text-f2 cursor-pointer">
          Featured project
        </label>
      </div>

      <div className="pt-2 sticky bottom-0 bg-s2 -mx-1 px-1 pb-1 border-t border-ln mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full bg-mint text-fi font-mono text-xs py-2.5 rounded-sm hover:bg-mint/90 transition-colors',
            isLoading && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
