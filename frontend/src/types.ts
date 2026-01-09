  export type Department = {
  id: string
  name: string
  responsibleId: string
}

export type Teacher = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  startDate: string
  index: number
  subjectId: string
  departmentId: string
}

export type Student = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  entryYear: number
  subjectIds: string[]
}

export type Subject = {
  id: string
  name: string
  departmentId: string
  roomId: string
}

export type Room = {
  id: string
  name: string
  capacity: number
}

export type GradesByStudent = Record<string, Record<string, number>>

export type Role = 'student' | 'teacher' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  photoUrl?: string
}

