import { OSRS_SKILLS } from '../data/skills.js'

const SKILL_LAYOUT = [
  ['Attack', 'Hitpoints', 'Mining'],
  ['Strength', 'Agility', 'Smithing'],
  ['Defence', 'Herblore', 'Fishing'],
  ['Ranged', 'Thieving', 'Cooking'],
  ['Prayer', 'Crafting', 'Firemaking'],
  ['Magic', 'Fletching', 'Woodcutting'],
  ['Runecraft', 'Slayer', 'Farming'],
  ['Hunter', 'Construction', null,
  ],
]

export default function SkillsPanel({ skills, size = 'md' }) {
  const hasSkills = skills && Object.keys(skills).length > 0
  if (!hasSkills) return null

  const sizeClasses = {
    sm: { wrapper: 'w-full max-w-[220px]', num: 'text-[8px]', cover: 'w-[35%] h-[40%] bottom-[8%] right-[3%]' },
    md: { wrapper: 'w-full max-w-[300px]', num: 'text-[10px]', cover: 'w-[35%] h-[40%] bottom-[8%] right-[3%]' },
    lg: { wrapper: 'w-full max-w-[440px]', num: 'text-sm', cover: 'w-[35%] h-[40%] bottom-[8%] right-[3%]' },
  }
  const s = sizeClasses[size]

  return (
    <div className={`relative ${s.wrapper} mx-auto rounded-lg overflow-hidden border-2 border-amber-900/60 shadow-2xl`}>
      <img src="/osrs-skills-bg.jpeg" alt="Skills" className="w-full object-contain block" />

      {/* Grid overlay - covers 1/1 and shows typed numbers */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-8" style={{ padding: '1.5% 2%' }}>
        {SKILL_LAYOUT.flat().map((skillName, idx) => {
          if (!skillName) return <div key={idx} />
          const level = skills[skillName]
          return (
            <div key={idx} className="relative">
              {/* Cover the 1/1 area with a box matching the panel background */}
              <div
                className={`absolute ${s.cover} rounded-sm`}
                style={{
                  background: 'linear-gradient(135deg, #3d2b1f 0%, #2a1d14 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
                }}
              />
              {/* Show the typed level number */}
              {level && (
                <div
                  className="absolute flex items-center justify-center"
                  style={{ bottom: '8%', right: '3%', width: '35%', height: '40%' }}
                >
                  <span
                    className={`${s.num} font-bold text-yellow-300 leading-none`}
                    style={{ textShadow: '0 0 3px black, 1px 1px 1px black' }}
                  >
                    {level}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Animated shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,200,80,0.15) 50%, transparent 100%)',
          animation: 'skillsShimmer 4s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes skillsShimmer {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(100%); opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
