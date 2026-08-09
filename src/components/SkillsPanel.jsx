import { OSRS_SKILLS } from '../data/skills.js'

export default function SkillsPanel({ skills, size = 'md' }) {
  const hasSkills = skills && Object.keys(skills).length > 0
  if (!hasSkills) return null

  const sizes = {
    sm: { cell: 'w-12 h-12', icon: 'text-lg', level: 'text-[10px]', gap: 'gap-1' },
    md: { cell: 'w-16 h-16', icon: 'text-2xl', level: 'text-xs', gap: 'gap-1.5' },
    lg: { cell: 'w-20 h-20', icon: 'text-3xl', level: 'text-sm', gap: 'gap-2' },
  }
  const s = sizes[size]

  return (
    <div className={`grid grid-cols-3 ${s.gap} relative z-10`}>
      {OSRS_SKILLS.map(skill => {
        const level = skills[skill.name]
        return (
          <div
            key={skill.name}
            className={`${s.cell} flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-osrs-brown/60 to-osrs-darker border border-osrs-brownLight/50 relative`}
          >
            <span className={s.icon}>{skill.icon}</span>
            {level ? (
              <span className={`${s.level} font-bold text-yellow-300`} style={{ textShadow: '0 1px 2px black' }}>
                {level}
              </span>
            ) : (
              <span className={`${s.level} text-stoner-haze/20`}>—</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
