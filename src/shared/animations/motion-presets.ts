/**
 * Stable Tailwind/CSS utility class names for reusable motion patterns.
 * Heavy lifting is GPU-friendly transform + opacity in globals.css (.reveal-motion).
 */
export const motionPresets = {
  /** Section / card fade + slight lift once `.reveal-motion--visible` toggles */
  revealBlock: 'reveal-motion',
  revealVisible: 'reveal-motion--visible',

  /** Optional utility wrappers (mostly hover — keep Tailwind on components) */
  hoverLiftInteractive:
    'transition-transform duration-fast ease-out hover:-translate-y-px active:translate-y-0',
} as const;
