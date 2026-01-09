import type { Department, GradesByStudent, Subject } from '../types'

export const computeSubjectAverage = (subjectId: string, gradesByStudent: GradesByStudent): number | null => {
  const notes: number[] = []
  Object.values(gradesByStudent).forEach((bySubject) => {
    const note = bySubject[subjectId]
    if (typeof note === 'number') notes.push(note)
  })
  if (!notes.length) return null
  return parseFloat((notes.reduce((s, n) => s + n, 0) / notes.length).toFixed(2))
}

export const computeDepartmentAverage = (
  department: Department,
  subjects: Subject[],
  gradesByStudent: GradesByStudent,
): number | null => {
  const subjectIds = subjects.filter((s) => s.departmentId === department.id).map((s) => s.id)
  const notes: number[] = []
  Object.values(gradesByStudent).forEach((bySubject) => {
    subjectIds.forEach((id) => {
      const note = bySubject[id]
      if (typeof note === 'number') notes.push(note)
    })
  })
  if (!notes.length) return null
  return parseFloat((notes.reduce((s, n) => s + n, 0) / notes.length).toFixed(2))
}

export const computeStudentAverage = (
  studentId: string,
  gradesByStudent: GradesByStudent,
  subjects: Subject[],
): number | null => {
  const notes = gradesByStudent[studentId]
  if (!notes) return null
  const values = Object.values(notes)
  if (!values.length) return null
  // Ne compte que les matières connues dans la liste
  const filtered = Object.entries(notes)
    .filter(([subjectId]) => subjects.some((s) => s.id === subjectId))
    .map(([, note]) => note)
  if (!filtered.length) return null
  return parseFloat((filtered.reduce((s, n) => s + n, 0) / filtered.length).toFixed(2))
}

