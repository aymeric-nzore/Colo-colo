import type { Department, Teacher, Student, Subject, Room, GradesByStudent } from './types'

export const departments: Department[] = [
  { id: 'dep-1', name: 'Sciences', responsibleId: 't-1' },
  { id: 'dep-2', name: 'Lettres', responsibleId: 't-3' },
  { id: 'dep-3', name: 'Technologie', responsibleId: 't-4' },
]

export const rooms: Room[] = [
  { id: 'r-101', name: 'Salle 101', capacity: 32 },
  { id: 'r-202', name: 'Salle 202', capacity: 28 },
  { id: 'lab-1', name: 'Laboratoire', capacity: 24 },
  { id: 'r-303', name: 'Salle 303', capacity: 30 },
]

export const subjects: Subject[] = [
  { id: 'mat-1', name: 'Mathématiques', departmentId: 'dep-1', roomId: 'r-101' },
  { id: 'mat-2', name: 'Physique', departmentId: 'dep-1', roomId: 'lab-1' },
  { id: 'mat-3', name: 'Français', departmentId: 'dep-2', roomId: 'r-202' },
  { id: 'mat-4', name: 'Technologie', departmentId: 'dep-3', roomId: 'lab-1' },
  { id: 'mat-5', name: 'Histoire-Géographie', departmentId: 'dep-2', roomId: 'r-202' },
  { id: 'mat-6', name: 'Sciences de la vie et de la Terre', departmentId: 'dep-1', roomId: 'r-303' },
  { id: 'mat-7', name: 'Anglais', departmentId: 'dep-2', roomId: 'r-101' },
]

export const teachers: Teacher[] = [
  {
    id: 't-1',
    firstName: 'Alice',
    lastName: 'Martin',
    phone: '06 11 22 33 44',
    email: 'alice.martin@college.fr',
    startDate: '2018',
    index: 720,
    subjectId: 'mat-1',
    departmentId: 'dep-1',
  },
  {
    id: 't-2',
    firstName: 'Karim',
    lastName: 'Benali',
    phone: '06 22 33 44 55',
    email: 'karim.benali@college.fr',
    startDate: '2020',
    index: 650,
    subjectId: 'mat-2',
    departmentId: 'dep-1',
  },
  {
    id: 't-3',
    firstName: 'Sophie',
    lastName: 'Durand',
    phone: '06 55 66 77 88',
    email: 'sophie.durand@college.fr',
    startDate: '2016',
    index: 780,
    subjectId: 'mat-3',
    departmentId: 'dep-2',
  },
  {
    id: 't-4',
    firstName: 'Marc',
    lastName: 'Leclerc',
    phone: '06 77 88 99 00',
    email: 'marc.leclerc@college.fr',
    startDate: '2019',
    index: 690,
    subjectId: 'mat-4',
    departmentId: 'dep-3',
  },
  {
    id: 't-5',
    firstName: 'Julie',
    lastName: 'Robert',
    phone: '06 88 99 00 11',
    email: 'julie.robert@college.fr',
    startDate: '2021',
    index: 640,
    subjectId: 'mat-5',
    departmentId: 'dep-2',
  },
  {
    id: 't-6',
    firstName: 'Omar',
    lastName: 'Diallo',
    phone: '06 33 44 55 66',
    email: 'omar.diallo@college.fr',
    startDate: '2019',
    index: 700,
    subjectId: 'mat-6',
    departmentId: 'dep-1',
  },
  {
    id: 't-7',
    firstName: 'Emma',
    lastName: 'Leroux',
    phone: '06 99 11 22 33',
    email: 'emma.leroux@college.fr',
    startDate: '2017',
    index: 730,
    subjectId: 'mat-7',
    departmentId: 'dep-2',
  },
]

export const students: Student[] = [
  {
    id: 's-1',
    firstName: 'Nora',
    lastName: 'Ali',
    phone: '07 10 20 30 40',
    email: 'nora.ali@eleve.fr',
    entryYear: 2023,
    subjectIds: ['mat-1', 'mat-2', 'mat-3', 'mat-7'],
  },
  {
    id: 's-2',
    firstName: 'Louis',
    lastName: 'Moreau',
    phone: '07 22 33 44 55',
    email: 'louis.moreau@eleve.fr',
    entryYear: 2022,
    subjectIds: ['mat-1', 'mat-3', 'mat-4', 'mat-5'],
  },
  {
    id: 's-3',
    firstName: 'Lea',
    lastName: 'Dupont',
    phone: '07 44 55 66 77',
    email: 'lea.dupont@eleve.fr',
    entryYear: 2021,
    subjectIds: ['mat-2', 'mat-3', 'mat-6'],
  },
]

// gradesByStudent[studentId][subjectId] = note /20
export const gradesByStudent: GradesByStudent = {
  's-1': {
    'mat-1': 15,
    'mat-2': 13,
    'mat-3': 14,
  },
  's-2': {
    'mat-1': 12,
    'mat-3': 11,
    'mat-4': 16,
  },
  's-3': {
    'mat-2': 17,
  },
}

