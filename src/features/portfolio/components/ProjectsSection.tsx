'use client';

import { useState } from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { TechBadge } from '@/shared/components/ui/TechBadge';
import { SectionSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { useProjects } from '../hooks/usePortfolioData';
import { STATUS_LABELS, STATUS_VARIANTS, getProjectCode } from '../utils/portfolio.utils';
import type { Project } from '../types/portfolio.types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { cn } from '@/shared/lib/cn';

const MAX_TECH_BADGES = 12;

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenDetail: () => void;
}

function ProjectCard({ project, index, onOpenDetail }: ProjectCardProps) {
  const isPrivate = project.status === 'private';
  const statusVariant = STATUS_VARIANTS[project.status];
  const statusLabel = STATUS_LABELS[project.status];
  const tech = project.technologies ?? [];
  const shownTech = tech.slice(0, MAX_TECH_BADGES);
  const techOverflow = Math.max(tech.length - shownTech.length, 0);

  return (
    <div
      className={cn(
        'group relative border bg-s1 p-6 hover:border-ln2 hover:bg-s2 transition-all duration-base rounded-sm flex flex-col',
        project.featured ? 'border-mint/35 shadow-[inset_0_0_0_1px_rgba(124,255,178,0.08)]' : 'border-ln',
      )}
    >
      {project.featured && (
        <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mint">
          ★ featured
        </span>
      )}

      <div className="flex items-start justify-between mb-4 pr-24">
        <div>
          <div className="font-mono text-xs text-f3 mb-1.5">{getProjectCode(index)}</div>
          <h3 className="font-sans font-semibold text-f0 text-base leading-snug pr-4">
            {project.title}
          </h3>
          <div className="font-mono text-xs text-f3 mt-1">{project.category}</div>
        </div>
        <ArrowUpRight
          size={14}
          strokeWidth={1.5}
          className="text-f3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-base mt-1"
        />
      </div>

      <p className="text-f2 text-sm leading-relaxed mb-5 flex-1 line-clamp-4">{project.description}</p>

      {shownTech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {shownTech.map((t) => (
            <TechBadge key={t} label={t} />
          ))}
          {techOverflow > 0 && (
            <span className="font-mono text-[10px] text-f3 self-center px-1.5 border border-ln rounded-sm">
              +{techOverflow} more
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-4 border-t border-ln mt-auto">
        <div className="flex flex-wrap items-center gap-3 justify-between gap-y-2">
          <StatusBadge label={`STATUS · ${statusLabel}`} variant={statusVariant} />

          {isPrivate ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-f3 uppercase tracking-wider">
              <Lock size={11} strokeWidth={1.5} />
              Private client project
            </span>
          ) : (
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-f2 hover:text-mint transition-colors duration-base flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  github <ArrowUpRight size={10} strokeWidth={1.5} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-f2 hover:text-mint transition-colors duration-base flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  live <ArrowUpRight size={10} strokeWidth={1.5} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onOpenDetail}
            className="font-mono text-xs text-mint hover:text-mint/90 border border-mint/30 px-3 py-1.5 rounded-sm hover:bg-mint/5 transition-colors"
          >
            view details →
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { data: projects, isLoading, isError } = useProjects();
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  return (
    <section id="works" className="py-20 md:py-28 border-t border-ln">
      <div className="px-6">
        <SectionHeader
          index="04"
          label="SELECTED WORKS"
          command="ls -la ./projects"
        />

        {isLoading && <SectionSkeleton />}
        {isError && <ErrorState message="Could not load projects." />}

        {!isLoading && !isError && projects && (
          <>
            {projects.length === 0 ? (
              <p className="font-mono text-sm text-f3">// no projects found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={idx}
                    onOpenDetail={() => setDetailProject(project)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />
    </section>
  );
}
