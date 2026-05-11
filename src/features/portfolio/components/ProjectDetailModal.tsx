'use client';

import { X } from 'lucide-react';
import type { Project } from '../types/portfolio.types';
import { TechBadge } from '@/shared/components/ui/TechBadge';
import { cn } from '@/shared/lib/cn';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

function BulletBlock({ title, items }: { title: string; items: string[] | undefined }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs text-f3 uppercase tracking-wider">{title}</p>
      <ul className="list-disc pl-5 space-y-1.5 marker:text-mint">
        {items.map((item, idx) => (
          <li key={`${title}-${idx}`} className="text-sm text-f1 leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close project details"
        className="absolute inset-0 bg-s0/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal
        aria-labelledby="project-detail-title"
        className={cn(
          'relative z-[9991] w-full max-h-[92vh] overflow-hidden flex flex-col',
          'max-w-lg sm:max-w-2xl border border-ln bg-s1 rounded-sm shadow-2xl',
        )}
      >
        <header className="flex items-start gap-4 px-5 py-4 border-b border-ln bg-s2">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-mono text-xs text-f3">project.meta</p>
            <h2 id="project-detail-title" className="font-sans font-semibold text-f0 text-base leading-snug">
              {project.title}
            </h2>
            <p className="font-mono text-xs text-f2">{project.category}</p>
            {(project.year || project.type || project.clientType) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-f3 pt-1">
                {project.year && <span>{`year · ${project.year}`}</span>}
                {project.type && <span>{`type · ${project.type}`}</span>}
                {project.clientType && <span>{`client · ${project.clientType}`}</span>}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center text-f3 hover:text-f1 border border-transparent hover:border-ln rounded-sm transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 space-y-6">
          <p className="text-sm text-f2 leading-relaxed">{project.description}</p>

          {project.longDescription && (
            <div className="space-y-1.5">
              <p className="font-mono text-xs text-f3 uppercase tracking-wider">overview</p>
              <p className="text-sm text-f2 leading-relaxed whitespace-pre-wrap">{project.longDescription}</p>
            </div>
          )}

          {project.role && (
            <div className="space-y-1.5 border-l-2 border-mint/40 pl-3">
              <p className="font-mono text-xs text-f3">role</p>
              <p className="text-sm text-f1 leading-relaxed">{project.role}</p>
            </div>
          )}

          {project.technologies?.length ? (
            <div className="space-y-2">
              <p className="font-mono text-xs text-f3 uppercase tracking-wider">technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <TechBadge key={t} label={t} />
                ))}
              </div>
            </div>
          ) : null}

          <BulletBlock title="features" items={project.features} />
          <BulletBlock title="challenges" items={project.challenges} />
          <BulletBlock title="solutions" items={project.solutions} />

          {project.tags?.length ? (
            <div className="space-y-2">
              <p className="font-mono text-xs text-f3 uppercase tracking-wider">tags</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2 py-0.5 border border-ln rounded-sm text-f2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
