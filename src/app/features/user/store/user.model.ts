export type Position = "Employee" | "ProductManager" | "DepartmentManager" | "HR"
export type Grade = "J1" | "J2" | "J3" | "M1" | "M2" | "M3" | "S"

export interface User extends GetUserResponse {
  userId: string;
}

// Данные рецензента
export interface Evaluator {
  id: string;
  firstName: string;
  lastName: string;
  midName: string;
  teamName: string;
  position: Position;
}

export interface GetUserRequestProps {
  userId: string;
}

export interface GetUserResponse {
  firstName: string,
  lastName: string,
  midName: string,
  email: string,
  grade: Grade,
  teamName: string,
  managerId: string,
  position: Position
}

export interface GetUsersRequestProps {
  userId: string;
  includeCurrentUser: boolean;
}

export interface GetSubordinates {
  userId: string;
}

export interface Subordinate {
  id: string;
  firstName: string,
  lastName: string,
  midName: string,
  email: string,
  grade: Grade,
  teamName: string,
  managerName: string,
  position: Position
}
