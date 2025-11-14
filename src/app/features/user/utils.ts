import {Position, User} from './store/user.model';
import {MenuItemProps} from '../../layout/main-layout/main-layout.model';

export const getLastNameWithInitials = (user: User | null) => {
  if (user) {
    return `${user.lastName} ${user.firstName.slice(0, 1)}.${user.midName.slice(0, 1)}.`;
  }
  return '';
}

export const getFullName = (user: User | null) => {
  if (user) {
    return `${user.lastName} ${user.firstName} ${user.midName}`;
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

export const getMenuItemsByPosition = (position: Position | undefined | null): MenuItemProps[] => {
  switch (position) {
    case 'Employee': return [
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
    case 'ProductManager': return [
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
      },
      {
        id: 4,
        srcIcon: 'people',
        title: "Моя команда"
      }
    ]
    case 'DepartmentManager': return [
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
      },
      {
        id: 4,
        srcIcon: 'people',
        title: "Моя команда"
      }
    ]
    case 'HR': return [
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
      },
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
    default: return []
  }
}
