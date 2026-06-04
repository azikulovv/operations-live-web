import {
  BookA,
  BookOpen,
  CalendarDays,
  Gift,
  GlassWater,
  LayoutDashboard,
  Table,
  Trophy,
  Wallet,
} from 'lucide-vue-next'
import { UserRoles } from '~/types/auth'
import type { UserRole } from '~/types/auth'

export type NavigationItem = {
  label: string
  to: string
  icon: Component
  available: UserRole | UserRole[]
}

export const dashboardNavigation: NavigationItem[] = [
  {
    label: 'Инструкция',
    to: '/dashboard/guide',
    icon: BookA,
    available: [UserRoles.manager, UserRoles.admin, UserRoles.hostess],
  },
  {
    label: 'Дашборд',
    to: '/dashboard',
    icon: LayoutDashboard,
    available: [UserRoles.manager, UserRoles.admin, UserRoles.hostess],
  },
  {
    label: 'Сегодня',
    to: '/dashboard/today',
    icon: CalendarDays,
    available: [UserRoles.manager, UserRoles.hostess],
  },
  {
    label: 'Касса',
    to: '/dashboard/cashier',
    icon: Wallet,
    available: [UserRoles.manager, UserRoles.hostess],
  },
  {
    label: 'Турнир',
    to: '/dashboard/tournament',
    icon: Trophy,
    available: [UserRoles.manager, UserRoles.admin],
  },
  {
    label: 'Столы',
    to: '/dashboard/tables',
    icon: Table,
    available: [UserRoles.manager, UserRoles.admin],
  },
  {
    label: 'Финальный стол',
    to: '/dashboard/tables/final',
    icon: Table,
    available: [UserRoles.manager, UserRoles.admin],
  },
  {
    label: 'Бар',
    to: '/dashboard/bar',
    icon: GlassWater,
    available: [UserRoles.manager, UserRoles.bartender],
  },
  {
    label: 'Акции',
    to: '/dashboard/promotions',
    icon: Gift,
    available: [UserRoles.manager, UserRoles.hostess],
  },
  {
    label: 'Долги',
    to: '/dashboard/debts',
    icon: BookOpen,
    available: [UserRoles.manager, UserRoles.hostess],
  },
]
