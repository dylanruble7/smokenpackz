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
    sm: { cell: 'w-12 h-12', icon: 'text-lg', num: 'text-[9px]', gap: 'gap-1', panel: 'p-2', label: 'text-[7px]' },
    md: { cell: 'w-16 h-16', icon: 'text-2xl', num: 'text-xs', gap: 'gap-1.5', panel: 'p-3', label: 'text-[9px]' },
    lg: { cell: 'w-24 h-24', icon: 'text-4xl', num: 'text-base', gap: 'gap-2', panel: 'p-4', label: 'text-xs' },
  }
  const s = sizeClasses[size]

  return (
    <div
      className={`relative ${s.panel} rounded-lg border-2 border-amber-900/60 bg-gradient-to-b from-amber-950/80 to-stone-900/90 shadow-2xl`}
      style={{
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), 0 0 20px rgba(180,140,60,0.15)',
      }}
    >
      {/* Animated glow overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,200,80,0.08) 50%, transparent 100%)',
          animation: 'skillsShimmer 3s ease-in-out infinite',
        }}
      />

      <div className={`grid grid-cols-3 ${s.gap} relative z-10`}>
        {SKILL_LAYOUT.flat().map((skillName, idx) => {
          if (!skillName) return <div key={idx} />
          const skill = OSRS_SKILLS.find(sk => sk.name === skillName)
          const level = skills[skillName]
          return (
            <div
              key={idx}
              className={`${s.cell} flex flex-col items-center justify-center rounded border border-amber-800/50 bg-gradient-to-b from-amber-900/40 to-stone-950/70 relative overflow-hidden transition-all duration-200 hover:from-amber-800/60 hover:to-stone-900/80 hover:border-amber-600/70 hover:scale-105 cursor-default`}
              style={{
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {/* Subtle moving glow per cell */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255,210,100,0.06) 0%, transparent 70%)',
                  animation: `skillsPulse ${2 + (idx % 3)}s ease-in-out infinite`,
                  animationDelay: `${idx * 0.15}s`,
                }}
              />
              <span className={`${s.icon} relative z-10`} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}>
                {skill?.icon || ''}
              </span>
              {level ? (
                <span
                  className={`${s.num} font-bold text-yellow-300 leading-none relative z-10 mt-0.5`}
                  style={{ textShadow: '0 0 4px rgba(255,200,0,0.6), 0 1px 2px black' }}
                >
                  {level}
                </span>
              ) : (
                <span className={`${s.num} text-amber-900/40 leading-none relative z-10 mt-0.5`}>—</span>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes skillsShimmer {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(100%); opacity: 0.3; }
        }
        @keyframes skillsPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
