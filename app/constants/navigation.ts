import {
  BookA,
  BookOpen,
  CalendarDays,
  Gift,
  GlassWater,
  // LayoutDashboard,
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

export type EventNavigationItem = {
  label: string
  segment: string
  icon: unknown
  available: UserRole | UserRole[]
}

export const eventNavigation: EventNavigationItem[] = [
  {
    label: 'Сегодня',
    segment: 'today',
    icon: CalendarDays,
    available: [UserRoles.manager, UserRoles.hostess],
  },
  {
    label: 'Касса',
    segment: 'cashier',
    icon: Wallet,
    available: [UserRoles.manager, UserRoles.hostess],
  },
  {
    label: 'Турнир',
    segment: 'tournament',
    icon: Trophy,
    available: [UserRoles.manager, UserRoles.admin],
  },
  {
    label: 'Столы',
    segment: 'tables',
    icon: Table,
    available: [UserRoles.manager, UserRoles.admin],
  },
  {
    label: 'Финальный стол',
    segment: 'tables/final',
    icon: Table,
    available: [UserRoles.manager, UserRoles.admin],
  },
  {
    label: 'Бар',
    segment: 'bar',
    icon: GlassWater,
    available: [UserRoles.manager, UserRoles.bartender],
  },
  {
    label: 'Акции',
    segment: 'promotions',
    icon: Gift,
    available: [UserRoles.manager, UserRoles.hostess],
  },
  {
    label: 'Долги',
    segment: 'debts',
    icon: BookOpen,
    available: [UserRoles.manager, UserRoles.hostess],
  },
]

export const dashboardNavigation: NavigationItem[] = [
  {
    label: 'События',
    to: '/dashboard/events',
    icon: CalendarDays,
    available: [UserRoles.manager, UserRoles.admin, UserRoles.hostess],
  },
  {
    label: 'Инструкция',
    to: '/dashboard/guide',
    icon: BookA,
    available: [UserRoles.manager, UserRoles.admin, UserRoles.hostess],
  },
  // {
  //   label: 'Дашборд',
  //   to: '/dashboard',
  //   icon: LayoutDashboard,
  //   available: [UserRoles.manager, UserRoles.admin, UserRoles.hostess],
  // },
]
