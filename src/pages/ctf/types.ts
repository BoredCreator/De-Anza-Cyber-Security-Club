export type CTFDifficulty = 'easy' | 'medium' | 'hard' | 'beast'

export type CTFCategory =
  | 'web'
  | 'crypto'
  | 'reverse'
  | 'forensics'
  | 'pwn'
  | 'misc'

export interface Challenge {
  id: string
  title: string
  description: string
  category: CTFCategory
  difficulty: CTFDifficulty
  points: number
  hint?: string
  flag: string
  solution?: string
  files?: { name: string; url: string }[]
  author?: string
  is_active?: boolean
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

export const categoryInfo: Record<CTFCategory, { name: string; color: string; description: string }> = {
  web: {
    name: 'Web Exploitation',
    color: 'cyan',
    description: 'Find vulnerabilities in web applications'
  },
  crypto: {
    name: 'Cryptography',
    color: 'purple',
    description: 'Break ciphers and decrypt messages'
  },
  reverse: {
    name: 'Reverse Engineering',
    color: 'orange',
    description: 'Analyze and decompile binaries'
  },
  forensics: {
    name: 'Forensics',
    color: 'blue',
    description: 'Investigate digital artifacts'
  },
  pwn: {
    name: 'Binary Exploitation',
    color: 'red',
    description: 'Exploit memory corruption bugs'
  },
  misc: {
    name: 'Miscellaneous',
    color: 'yellow',
    description: 'OSINT, scripting, and creative challenges'
  }
}

export const difficultyInfo: Record<CTFDifficulty, { name: string; color: string; basePoints: number }> = {
  easy: { name: 'Easy', color: 'green', basePoints: 100 },
  medium: { name: 'Medium', color: 'yellow', basePoints: 200 },
  hard: { name: 'Hard', color: 'red', basePoints: 300 },
  beast: { name: 'Beast', color: 'purple', basePoints: 500 }
}
