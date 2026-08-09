import { OSRS_SKILLS } from '../data/skills.js'

const SKILL_LAYOUT = [
  ['Attack', 'Hitpoints', 'Mining'],
  ['Strength', 'Agility', 'Smithing'],
  ['Defence', 'Herblore', 'Fishing'],
  ['Ranged', 'Thieving', 'Cooking'],
  ['Prayer', 'Crafting', 'Firemaking'],
  ['Magic', 'Fletching', 'Woodcutting'],
  ['Runecraft', 'Slayer', 'Farming'],
  ['Hunter', 'Construction', null],
]

export default function SkillsPanel({ skills, size = 'md' }) {
  const hasSkills = skills && Object.keys(skills).length > 0
  if (!hasSkills) return null

  const sizeClasses = {
    sm: { cell: 'w-14 h-14', icon: 'w-7 h-7', num: 'text-[10px]', gap: 'gap-1', panel: 'p-2', name: 'text-[7px]' },
    md: { cell: 'w-16 h-16', icon: 'w-8 h-8', num: 'text-xs', gap: 'gap-1.5', panel: 'p-3', name: 'text-[8px]' },
    lg: { cell: 'w-24 h-24', icon: 'w-12 h-12', num: 'text-base', gap: 'gap-2', panel: 'p-4', name: 'text-xs' },
  }
  const s = sizeClasses[size]

  return (
    <div
      className={`inline-block ${s.panel} rounded-lg border-2 border-amber-900/70 bg-gradient-to-b from-stone-800 to-stone-900 shadow-xl`}
      style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)' }}
    >
      <div className={`grid grid-cols-3 ${s.gap}`}>
        {SKILL_LAYOUT.flat().map((skillName, idx) => {
          if (!skillName) return <div key={idx} />
          const skill = OSRS_SKILLS.find(sk => sk.name === skillName)
          const level = skills[skillName]
          return (
            <div
              key={idx}
              className={`${s.cell} flex flex-col items-center justify-center rounded border border-amber-900/40 bg-gradient-to-b from-amber-950/50 to-stone-950/70 transition-all duration-200 hover:border-amber-600/70 hover:from-amber-900/50 hover:scale-105`}
              style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}
            >
              <img
                src={skill?.iconUrl}
                alt={skillName}
                className={`${s.icon} object-contain`}
                style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
                loading="lazy"
              />
              <span
                className={`${s.num} font-bold leading-none mt-0.5 ${level ? 'text-yellow-300' : 'text-stone-600'}`}
                style={level ? { textShadow: '0 1px 2px black' } : {}}
              >
                {level || '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
