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
    sm: { cell: 'w-11 h-11', icon: 'text-base', num: 'text-[9px]', gap: 'gap-0.5' },
    md: { cell: 'w-14 h-14', icon: 'text-xl', num: 'text-[10px]', gap: 'gap-1' },
    lg: { cell: 'w-20 h-20', icon: 'text-3xl', num: 'text-sm', gap: 'gap-1.5' },
  }
  const s = sizeClasses[size]

  return (
    <div className={`grid grid-cols-3 ${s.gap} mx-auto`}>
      {SKILL_LAYOUT.flat().map((skillName, idx) => {
        if (!skillName) return <div key={idx} />
        const skill = OSRS_SKILLS.find(sk => sk.name === skillName)
        const level = skills[skillName]
        return (
          <div
            key={idx}
            className={`${s.cell} flex flex-col items-center justify-center rounded bg-gradient-to-b from-yellow-900/40 to-yellow-950/60 border border-yellow-700/40`}
          >
            <span className={s.icon}>{skill?.icon || ''}</span>
            <span
              className={`${s.num} font-bold text-yellow-300 leading-none`}
              style={{ textShadow: '0 1px 2px black' }}
            >
              {level || ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
