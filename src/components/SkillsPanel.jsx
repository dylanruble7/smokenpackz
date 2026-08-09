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
    sm: { wrapper: 'w-full max-w-[200px]', num: 'text-[8px]', img: 'w-full' },
    md: { wrapper: 'w-full max-w-[280px]', num: 'text-[10px]', img: 'w-full' },
    lg: { wrapper: 'w-full max-w-[400px]', num: 'text-sm', img: 'w-full' },
  }
  const s = sizeClasses[size]

  return (
    <div className={`relative ${s.wrapper} mx-auto`}>
      <img src="/osrs-skills-bg.jpeg" alt="Skills" className={`${s.img} object-contain`} />
      {/* Number overlay grid */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-8" style={{ padding: '4% 5% 4% 5%' }}>
        {SKILL_LAYOUT.flat().map((skillName, idx) => {
          if (!skillName) return <div key={idx} />
          const level = skills[skillName]
          return (
            <div key={idx} className="relative flex items-end justify-end pr-[6%] pb-[4%]">
              {level && (
                <span
                  className={`${s.num} font-bold text-yellow-300 leading-none`}
                  style={{ textShadow: '0 0 3px black, 1px 1px 1px black' }}
                >
                  {level}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
