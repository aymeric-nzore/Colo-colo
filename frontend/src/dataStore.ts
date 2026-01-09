import { create } from 'zustand'
import type { Department, Teacher, Student, Subject, Room, GradesByStudent } from './types'
import { api } from './services/api'

interface DataState {
  departments: Department[]
  teachers: Teacher[]
  students: Student[]
  subjects: Subject[]
  rooms: Room[]
  gradesByStudent: GradesByStudent
  isLoading: boolean
  error: string | null
  fetchAllData: () => Promise<void>
}

export const useDataStore = create<DataState>((set) => ({
  departments: [],
  teachers: [],
  students: [],
  subjects: [],
  rooms: [],
  gradesByStudent: {},
  isLoading: false,
  error: null,

  fetchAllData: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await api.getAllData()
      set({
        departments: data.departments,
        teachers: data.teachers,
        students: data.students,
        subjects: data.subjects,
        rooms: data.rooms,
        gradesByStudent: data.gradesByStudent,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false,
      })
    }
  },
}))
