// Central icon map so data files can reference icons by string key.
import {
  Sigma,
  Atom,
  Code2,
  BrainCircuit,
  Globe,
  Languages,
  GraduationCap,
  Trophy,
  Briefcase,
  HeartHandshake,
  Award,
  Sparkles,
  FlaskConical,
  Calculator,
} from 'lucide-react'

export const ICONS = {
  Sigma,
  Atom,
  Code2,
  BrainCircuit,
  Globe,
  Languages,
  GraduationCap,
  Trophy,
  Briefcase,
  HeartHandshake,
  Award,
  Sparkles,
  FlaskConical,
  Calculator,
}

export function getIcon(name) {
  return ICONS[name] || Sparkles
}
