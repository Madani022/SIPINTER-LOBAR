import { 
  Building2, FileText, Landmark, Users, QrCode, Briefcase, 
  ClipboardList, Award, ScrollText, BookOpen, FileCheck, 
  Shield, MapPin, Video, Target, ListChecks, UserCircle,
  Factory, HeartPulse, Leaf, Building, Bus, Palmtree,
  Users2, HardHat, Fish, Wheat, GraduationCap, BadgeCheck,
  Map, Globe, Phone, FileSpreadsheet, Info, Scale,
  Circle // Default
} from "lucide-react"

// Mapping String -> Component
export const IconMap: Record<string, any> = {
  Building2, FileText, Landmark, Users, QrCode, Briefcase, 
  ClipboardList, Award, ScrollText, BookOpen, FileCheck, 
  Shield, MapPin, Video, Target, ListChecks, UserCircle,
  Factory, HeartPulse, Leaf, Building, Bus, Palmtree,
  Users2, HardHat, Fish, Wheat, GraduationCap, BadgeCheck,
  Map, Globe, Phone, FileSpreadsheet, Info, Scale,
  Circle
}

export function renderIcon(iconName: any, className?: string) {
  // Jika iconName adalah string, ambil dari Map. Jika tidak, return default.
  const IconComponent = IconMap[iconName] || IconMap["Circle"];
  return <IconComponent className={className} />;
}