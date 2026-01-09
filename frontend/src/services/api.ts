import type { Department, Teacher, Student, Subject, Room, GradesByStudent } from '../types'

// API base URL - defaults to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Generic fetch function with error handling
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * API service for fetching data from the Django backend
 */
export const api = {
  /**
   * Fetch all departments
   */
  async getDepartments(): Promise<Department[]> {
    return apiFetch<Department[]>('/departments/')
  },

  /**
   * Fetch all teachers
   */
  async getTeachers(): Promise<Teacher[]> {
    return apiFetch<Teacher[]>('/teachers/')
  },

  /**
   * Fetch all students
   */
  async getStudents(): Promise<Student[]> {
    return apiFetch<Student[]>('/students/')
  },

  /**
   * Fetch all subjects
   */
  async getSubjects(): Promise<Subject[]> {
    return apiFetch<Subject[]>('/subjects/')
  },

  /**
   * Fetch all rooms
   */
  async getRooms(): Promise<Room[]> {
    return apiFetch<Room[]>('/rooms/')
  },

  /**
   * Fetch grades organized by student
   */
  async getGradesByStudent(): Promise<GradesByStudent> {
    return apiFetch<GradesByStudent>('/grades-by-student/')
  },

  /**
   * Fetch all data at once
   */
  async getAllData() {
    const [departments, teachers, students, subjects, rooms, gradesByStudent] = await Promise.all([
      this.getDepartments(),
      this.getTeachers(),
      this.getStudents(),
      this.getSubjects(),
      this.getRooms(),
      this.getGradesByStudent(),
    ])

    return {
      departments,
      teachers,
      students,
      subjects,
      rooms,
      gradesByStudent,
    }
  },
}
