import {Position, Evaluator, User, Subordinate} from './user/store/user.model';
import {MenuItemProps} from '../layout/main-layout/main-layout.model';

const TOKENS_EXPIRATION_HOURS = 6

export const getExpirationTime = () => {
  return new Date(new Date().getTime() + TOKENS_EXPIRATION_HOURS * 3600 * 1000);
}

export const getFullNameWithInitials = (user: User | Evaluator | Subordinate | null) => {
  if (user) {
    return `${user.lastName} ${user.firstName.slice(0, 1)}.${user.midName ? user.midName.slice(0, 1) + "." : ""}`;
  }
  return '';
}

export const getFullName = (user: User | Evaluator | Subordinate | null) => {
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
    title: 'Личный кабинет',
    path: "profile"
  },
  {
    id: 2,
    srcIcon: 'pulse',
    title: 'Мои результаты',
    path: "results"
  },
  {
    id: 3,
    srcIcon: 'star',
    title: "Оценивание",
    path: "assessments"
  }
]

export const getMenuItemsByPosition = (position: Position | undefined | null): MenuItemProps[] => {
  switch (position) {
    case 'ProductManager': return [
      ...baseMenu,
      {
        id: 4,
        srcIcon: 'people',
        title: "Моя команда",
        path: "my-team"
      }
    ]
    case 'DepartmentManager': return [
      ...baseMenu,
      {
        id: 4,
        srcIcon: 'people',
        title: "Моя команда",
        path: "my-team"
      }
    ]
    case 'HR': return [
      ...baseMenu,
      {
        id: 4,
        srcIcon: 'people',
        title: "Сотрудники",
        path: "employees"
      },
      {
        id: 5,
        srcIcon: 'clock',
        title: "Управление аттестациями",
        path: "manage-assessments"
      }
    ]
    default: return baseMenu
  }
}

export const formatDate = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}
