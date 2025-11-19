import {Position, Evaluator, User} from './user/store/user.model';
import {MenuItemProps} from '../layout/main-layout/main-layout.model';

const TOKENS_EXPIRATION_HOURS = 6

export const getExpirationTime = () => {
  return new Date(new Date().getTime() + TOKENS_EXPIRATION_HOURS * 3600 * 1000);
}

export const getFullNameWithInitials = (user: User | Evaluator | null) => {
  if (user) {
    return `${user.lastName} ${user.firstName.slice(0, 1)}.${user.midName ? user.midName.slice(0, 1) + "." : ""}`;
  }
  return '';
}

export const getFullName = (user: User | Evaluator | null) => {
  if (user) {
    return `${user.lastName} ${user.firstName}${user.midName ? " " + user.midName : ""}`;
  }
  return '';
}

export const getPositionString = (position: Position | undefined | null): string => {
  switch (position) {
    case 'Employee': return 'Сотрудник'
    case 'ProductManager': return 'Руководитель проекта'
    case "DepartmentManager": return "Руководитель отдела"
    case "HR": return "HR-менеджер"
    default: return "Неизвестная должность"
  }
}

const baseMenu: MenuItemProps[] = [
  {
    id: 1,
    srcIcon: 'person',
    title: 'Личный кабинет'
  },
  {
    id: 2,
    srcIcon: 'pulse',
    title: 'Мои результаты'
  },
  {
    id: 3,
    srcIcon: 'star',
    title: "Оценивание"
  }
]

export const getMenuItemsByPosition = (position: Position | undefined | null): MenuItemProps[] => {
  switch (position) {
    case 'ProductManager': return [
      ...baseMenu,
      {
        id: 4,
        srcIcon: 'people',
        title: "Моя команда"
      }
    ]
    case 'DepartmentManager': return [
      ...baseMenu,
      {
        id: 4,
        srcIcon: 'people',
        title: "Моя команда"
      }
    ]
    case 'HR': return [
      ...baseMenu,
      {
        id: 4,
        srcIcon: 'people',
        title: "Сотрудники"
      },
      {
        id: 5,
        srcIcon: 'clock',
        title: "Управление аттестациями"
      }
    ]
    default: return baseMenu
  }
}
