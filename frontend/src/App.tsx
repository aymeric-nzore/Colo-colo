import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Chip,
  Divider,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material'
import { gsap } from 'gsap'
import { MdEmail, MdLock, MdSchool, MdVerified } from 'react-icons/md'
import { FiLogIn } from 'react-icons/fi'
import './App.css'
import { computeDepartmentAverage, computeStudentAverage, computeSubjectAverage } from './utils/grades'
import type { Role, Student } from './types'
import { useAuthStore } from './authStore'
import { useDataStore } from './dataStore'
import { RiveHero } from './RiveHero'
import { RiveShowcase } from './RiveShowcase'

const DEFAULT_STUDENT_SUBJECT_IDS: string[] = ['mat-1', 'mat-3', 'mat-7']

const DataLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, error, fetchAllData } = useDataStore()

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Chargement des données...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Erreur de chargement
          </Typography>
          <Typography>{error}</Typography>
          <Button variant="contained" onClick={fetchAllData} sx={{ mt: 2 }}>
            Réessayer
          </Button>
        </Alert>
      </Box>
    )
  }

  return <>{children}</>
}

const getNavItemsForRole = (role: Role | null | undefined) => {
  if (role === 'student') {
    return [
      { to: '/matieres-salles', label: 'Matières & salles' },
      { to: '/etudiants', label: 'Mes notes' },
      { to: '/profil', label: 'Mon profil' },
    ]
  }
  return [
    { to: '/', label: 'Tableau de bord' },
    { to: '/departements', label: 'Départements' },
    { to: '/enseignants', label: 'Enseignants' },
    { to: '/etudiants', label: 'Étudiants' },
    { to: '/matieres-salles', label: 'Matières & salles' },
    { to: '/admin', label: 'Administration' },
  ]
}

const PageContainer = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
      gsap.from('.page-section', {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.1,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <Container
      ref={containerRef}
      sx={{ py: 4 }}
      className="min-h-screen bg-base-200 text-base-content"
    >
      <Stack spacing={3} className="max-w-6xl mx-auto">
        <Stack direction="row" alignItems="baseline" spacing={1} className="page-section">
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          <Chip label="Démo" size="small" color="primary" className="badge badge-primary" />
        </Stack>
        <div className="page-section">{children}</div>
      </Stack>
    </Container>
  )
}

const Dashboard = () => {
  const { departments, teachers, students, subjects, gradesByStudent } = useDataStore()

  useEffect(() => {
    gsap.from('.stat-card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
  }, [])

  const avgGlobal = useMemo(() => {
    const all = students.map((student) => computeStudentAverage(student.id, gradesByStudent, subjects))
    const valid = all.filter((a) => a !== null) as number[]
    return valid.length ? (valid.reduce((s, n) => s + n, 0) / valid.length).toFixed(2) : 'N/A'
  }, [students, gradesByStudent, subjects])

  return (
    <PageContainer title="Tableau de bord">
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap={2}>
        <Card className="stat-card">
          <CardContent>
            <Typography color="text.secondary">Départements</Typography>
            <Typography variant="h4">{departments.length}</Typography>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <Typography color="text.secondary">Enseignants</Typography>
            <Typography variant="h4">{teachers.length}</Typography>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <Typography color="text.secondary">Étudiants</Typography>
            <Typography variant="h4">{students.length}</Typography>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent>
            <Typography color="text.secondary">Moyenne globale</Typography>
            <Typography variant="h4">{avgGlobal}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ mt: 2 }}>
        <RiveShowcase files={["/animations/login.riv", "/animations/header.riv", "/animations/particles.riv"]} title="Animations Rive" />
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Points clés
          </Typography>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
            <Paper className="panel">
              <Typography variant="subtitle1" fontWeight={700}>
                Moyennes par matière
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Stack spacing={1}>
                {subjects.map((subject) => (
                  <Stack key={subject.id} direction="row" justifyContent="space-between">
                    <Typography>{subject.name}</Typography>
                    <Chip
                      label={computeSubjectAverage(subject.id, gradesByStudent) ?? 'N/A'}
                      color="secondary"
                      size="small"
                    />
                  </Stack>
                ))}
              </Stack>
            </Paper>
            <Paper className="panel">
              <Typography variant="subtitle1" fontWeight={700}>
                Moyennes par département
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Stack spacing={1}>
                {departments.map((dept) => (
                  <Stack key={dept.id} direction="row" justifyContent="space-between">
                    <Typography>{dept.name}</Typography>
                    <Chip label={computeDepartmentAverage(dept, subjects, gradesByStudent) ?? 'N/A'} size="small" />
                  </Stack>
                ))}
              </Stack>
            </Paper>
            <Paper className="panel highlight">
              <Typography variant="subtitle1" fontWeight={700}>
                Impression rapide
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Préparez les fiches signalétiques enseignant/élève avec le bouton "Imprimer" sur chaque fiche.
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

const DepartmentsPage = () => {
  const { departments, teachers, subjects } = useDataStore()

  return (
    <PageContainer title="Départements">
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
        {departments.map((dept) => {
          const responsible = teachers.find((t) => t.id === dept.responsibleId)
          const deptSubjects = subjects.filter((s) => s.departmentId === dept.id)
          return (
            <Card className="hover-card" key={dept.id}>
              <CardContent>
                <Typography variant="h6">{dept.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Responsable : {responsible ? `${responsible.firstName} ${responsible.lastName}` : 'Non défini'}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {deptSubjects.map((s) => (
                    <Chip key={s.id} label={s.name} size="small" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </PageContainer>
  )
}

const TeachersPage = () => {
  const { teachers, subjects, departments } = useDataStore()
  const navigate = useNavigate()
  return (
    <PageContainer title="Enseignants">
      <Box sx={{ mb: 2 }}>
        <RiveShowcase files={["/animations/login.riv", "/animations/teachers.riv"]} title="Animations Enseignants" />
      </Box>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
        {teachers.map((teacher) => {
          const subject = subjects.find((s) => s.id === teacher.subjectId)
          const department = departments.find((d) => d.id === teacher.departmentId)
          return (
            <Card className="hover-card" key={teacher.id}>
              <CardContent>
                <Typography variant="h6">
                  {teacher.firstName} {teacher.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subject?.name ?? 'Matière non définie'}
                </Typography>
                <Typography variant="body2">Département : {department?.name ?? 'N/A'}</Typography>
                <Typography variant="body2">Tél : {teacher.phone}</Typography>
                <Typography variant="body2">Mail : {teacher.email}</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip label={`Indice ${teacher.index}`} size="small" />
                  <Chip label={`Depuis ${teacher.startDate}`} size="small" />
                </Stack>
                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => window.print()}
                    aria-label="Imprimer la fiche enseignant"
                  >
                    Imprimer
                  </Button>
                  <Button variant="text" size="small" onClick={() => navigate('/departements')}>
                    Voir département
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </PageContainer>
  )
}

const StudentCard = ({ student }: { student: Student }) => {
  const { subjects, gradesByStudent } = useDataStore()
  const avg = computeStudentAverage(student.id, gradesByStudent, subjects)
  const missing = subjects.filter((s) => student.subjectIds.includes(s.id) && !gradesByStudent[student.id]?.[s.id])
  return (
    <Card className="hover-card">
      <CardContent>
        <Typography variant="h6">
          {student.firstName} {student.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Entrée : {student.entryYear}
        </Typography>
        <Typography variant="body2">Tél : {student.phone}</Typography>
        <Typography variant="body2">Mail : {student.email}</Typography>
        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          {subjects
            .filter((s) => student.subjectIds.includes(s.id))
            .map((s) => (
              <Chip key={s.id} label={s.name} size="small" />
            ))}
        </Stack>
        <Stack direction="row" spacing={1} mt={2}>
          <Chip label={`Moyenne : ${avg ?? 'N/A'}`} color="secondary" />
          {missing.length > 0 && <Chip label={`Sans note : ${missing.length}`} color="warning" />}
        </Stack>
        <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={() => window.print()}>
          Imprimer fiche
        </Button>
      </CardContent>
    </Card>
  )
}

const StudentsPage = () => {
  const user = useAuthStore((s) => s.user)
  const { students } = useDataStore()
  const visibleStudents: Student[] = useMemo(() => {
    if (!user) return []
    if (user.role === 'student') {
      const existing = students.filter((s) => s.email === user.email)
      if (existing.length > 0) return existing
      // profil virtuel si l'email ne fait pas partie des mocks
      return [
        {
          id: user.email,
          firstName: user.name.split('.')[0] || 'Élève',
          lastName: user.name.split('.').slice(1).join(' ') || '',
          phone: '',
          email: user.email,
          entryYear: new Date().getFullYear(),
          subjectIds: DEFAULT_STUDENT_SUBJECT_IDS,
        },
      ]
    }
    return students
  }, [user, students])

  return (
    <PageContainer title={user?.role === 'student' ? 'Mon dossier élève' : 'Étudiants'}>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
        {visibleStudents.map((student) => (
          <StudentCard student={student} key={student.id} />
        ))}
      </Box>
    </PageContainer>
  )
}

const SubjectsRoomsPage = () => {
  const user = useAuthStore((s) => s.user)
  const { subjects, rooms, teachers, students } = useDataStore()

  const visibleSubjects = useMemo(() => {
    if (user?.role === 'student') {
      const student = students.find((s) => s.email === user.email)
      const subjectIds =
        student?.subjectIds ?? DEFAULT_STUDENT_SUBJECT_IDS
      return subjects.filter((subject) => subjectIds.includes(subject.id))
    }
    return subjects
  }, [user, subjects, students])

  return (
    <PageContainer title="Matières & salles">
      <Box sx={{ mb: 2 }}>
        <RiveShowcase files={["/animations/login.riv", "/animations/particles.riv"]} title="Animations Matières" />
      </Box>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
        {visibleSubjects.map((subject) => {
          const room = rooms.find((r) => r.id === subject.roomId)
          const subjectTeachers = teachers.filter((t) => t.subjectId === subject.id)
          return (
            <Card className="hover-card" key={subject.id}>
              <CardContent>
                <Typography variant="h6">{subject.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Salle : {room?.name ?? 'Non affectée'} (capacité {room?.capacity ?? '?'})
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {subjectTeachers.map((t) => (
                    <Chip key={t.id} label={`${t.firstName} ${t.lastName}`} size="small" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </PageContainer>
  )
}

const AdminPage = () => (
  <PageContainer title="Espace administrateur">
    <Box sx={{ mb: 2 }}>
      <RiveShowcase files={["/animations/login.riv", "/animations/admin.riv", "/animations/security.riv"]} title="Animations Admin" />
    </Box>
    <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
      <Card className="hover-card">
        <CardContent>
          <Typography variant="h6">Gestion des départements</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Créer, modifier et supprimer les départements et leurs responsables.
          </Typography>
          <Button variant="contained" size="small">
            Ouvrir le module
          </Button>
        </CardContent>
      </Card>
      <Card className="hover-card">
        <CardContent>
          <Typography variant="h6">Gestion des enseignants & élèves</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Administrer les comptes, fiches signalétiques et droits d&apos;accès.
          </Typography>
          <Button variant="contained" size="small">
            Ouvrir le module
          </Button>
        </CardContent>
      </Card>
      <Card className="hover-card">
        <CardContent>
          <Typography variant="h6">Gestion des matières & salles</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Affecter les matières aux salles, vérifier les capacités et la planification.
          </Typography>
          <Button variant="contained" size="small">
            Ouvrir le module
          </Button>
        </CardContent>
      </Card>
    </Box>
  </PageContainer>
)

const StudentProfilePage = () => {
  const user = useAuthStore((s) => s.user)
  const updatePhoto = useAuthStore((s) => s.updatePhoto)
  const { students, subjects, rooms, teachers, gradesByStudent } = useDataStore()

  const student = useMemo(
    () => {
      if (!user) return null
      const existing = students.find((s) => s.email === user.email)
      if (existing) return existing
      // profil virtuel pour tout élève qui n'est pas dans les mocks
      return {
        id: user.email,
        firstName: user.name.split('.')[0] || 'Élève',
        lastName: user.name.split('.').slice(1).join(' ') || '',
        phone: '',
        email: user.email,
        entryYear: new Date().getFullYear(),
        subjectIds: DEFAULT_STUDENT_SUBJECT_IDS,
      } as Student
    },
    [user, students],
  )

  if (!user || !student) {
    return (
      <PageContainer title="Mon profil">
        <Typography>Profil élève introuvable.</Typography>
      </PageContainer>
    )
  }

  const studentSubjects = subjects.filter((subj) => student.subjectIds.includes(subj.id))

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updatePhoto(url)
  }

  return (
    <PageContainer title="Mon profil">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card className="hover-card" variant="outlined" sx={{ minWidth: 260 }}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {user.photoUrl ? (
                  <Box
                    component="img"
                    src={user.photoUrl}
                    alt="Photo de profil"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  `${student.firstName[0]}${student.lastName[0]}`
                )}
              </Box>
              <Button variant="outlined" component="label" size="small">
                Importer une photo
                <input hidden type="file" accept="image/*" onChange={handlePhotoChange} />
              </Button>
              <Typography variant="h6">
                {student.firstName} {student.lastName}
              </Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              <Typography>Année d&apos;entrée : {student.entryYear}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={3} flex={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mes cours et enseignants
              </Typography>
              <Stack spacing={1}>
                {studentSubjects.map((subject) => {
                  const room = rooms.find((r) => r.id === subject.roomId)
                  const teacher = teachers.find((t) => t.subjectId === subject.id)
                  const grade = gradesByStudent[student.id]?.[subject.id]
                  return (
                    <Paper key={subject.id} className="panel" sx={{ p: 1.5 }} variant="outlined">
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography fontWeight={600}>{subject.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Professeur :{' '}
                            {teacher
                              ? `${teacher.firstName} ${teacher.lastName}`
                              : 'Non affecté'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Salle : {room?.name ?? 'Non définie'}
                          </Typography>
                        </Box>
                        <Box>
                          <Chip
                            label={
                              grade !== undefined ? `Note : ${grade}/20` : 'Note non disponible'
                            }
                            color={grade !== undefined ? 'secondary' : 'default'}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  )
                })}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </PageContainer>
  )
}

const AuthPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('admin')
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!formRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
      })
      gsap.from('.form-field', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 0.3,
      })
      gsap.from('.form-title', {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power2.out',
      })
    }, formRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login({ email, role })
    gsap.to(formRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        navigate('/')
      },
    })
  }
  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <Box className="w-full max-w-5xl grid gap-8 md:grid-cols-2 items-center">
        <RiveHero />
        <Box maxWidth={480} flex={1} className="w-full animate-slide-in-up">
          <Card
            className="form-card card shadow-2xl"
            sx={{
              bgcolor: '#f8fafc',
              color: '#020617',
              borderRadius: '1.25rem',
              border: '2px solid rgba(59, 130, 246, 0.1)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #f0fdf4 100%)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                boxShadow: '0 25px 50px rgba(59, 130, 246, 0.15)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
              }
            }}
          >
            <CardContent sx={{ padding: '3.5rem' }}>
              <Box className="form-header mb-8 flex items-center gap-4">
                <Box className="form-logo-box" sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                }}>
                  <Box className="form-logo-icon">
                    <MdSchool size={32} color="white" />
                  </Box>
                </Box>
                <div>
                  <Typography variant="h5" className="font-black" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75rem', color: '#020617', letterSpacing: '-0.5px' }}>
                    COLO-COLO
                  </Typography>
                  <Typography variant="caption" className="text-slate-400 font-semibold tracking-wider" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    PORTAIL ACADÉMIQUE
                  </Typography>
                </div>
              </Box>
              
              <Typography variant="body2" className="form-description text-slate-600 mb-9 font-medium leading-relaxed" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem' }}>
                Connectez-vous pour accéder à vos notes, votre emploi du temps et vos ressources académiques
              </Typography>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4.5}>
                  <Box className="form-field">
                    <TextField
                      type="email"
                      required
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      placeholder="Email académique"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 1.5 }}>
                            <MdEmail size={22} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          borderRadius: '0.875rem',
                          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          '& fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.25)',
                            borderWidth: '1.5px',
                            transition: 'all 0.7s ease',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.6)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.12)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(59, 130, 246, 0.01)',
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '16px 14px',
                          fontSize: '0.95rem',
                          transition: 'all 0.4s ease',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                          '&::placeholder': {
                            opacity: 0.45,
                            fontWeight: 400,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          '&.Mui-focused': {
                            color: '#3b82f6',
                          }
                        },
                      }}
                    />
                  </Box>
                  <Box className="form-field">
                    <TextField
                      type="password"
                      required
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      placeholder="Mot de passe"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 1.5 }}>
                            <MdLock size={22} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          borderRadius: '0.875rem',
                          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          '& fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.25)',
                            borderWidth: '1.5px',
                            transition: 'all 0.7s ease',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.6)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.12)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(59, 130, 246, 0.01)',
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '16px 14px',
                          fontSize: '0.95rem',
                          transition: 'all 0.4s ease',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                          '&::placeholder': {
                            opacity: 0.45,
                            fontWeight: 400,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          '&.Mui-focused': {
                            color: '#3b82f6',
                          }
                        },
                      }}
                    />
                  </Box>
                  <Box className="form-field">
                    <TextField
                      select
                      fullWidth
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      SelectProps={{ native: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 1.5 }}>
                            <MdVerified size={22} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          borderRadius: '0.875rem',
                          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          '& fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.25)',
                            borderWidth: '1.5px',
                            transition: 'all 0.7s ease',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.6)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.12)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(59, 130, 246, 0.01)',
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '16px 14px',
                          fontSize: '0.95rem',
                          transition: 'all 0.4s ease',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                        },
                        '& .MuiInputLabel-root': {
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          '&.Mui-focused': {
                            color: '#3b82f6',
                          }
                        },
                      }}
                    >
                      <option value="" disabled>Sélectionner votre rôle</option>
                      <option value="student">👨‍🎓 Élève</option>
                      <option value="teacher">👨‍🏫 Enseignant</option>
                      <option value="admin">🛡️ Administrateur</option>
                    </TextField>
                  </Box>
                  <Box sx={{ pt: 2.5 }} className="form-field">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      className="btn btn-primary"
                      sx={{
                        background: 'linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f97316 100%)',
                        backgroundSize: '200% 200%',
                        color: '#ffffff',
                        padding: '16px 28px',
                        borderRadius: '0.875rem',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        fontFamily: 'Poppins, sans-serif',
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
                        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        animation: 'subtlePulse 5s ease-in-out infinite',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.8rem',
                        minHeight: '56px',
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5), 0 0 25px rgba(251, 191, 36, 0.4)',
                          transform: 'translateY(-3px)',
                          backgroundPosition: '100% 100%',
                        },
                        '&:active': {
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <FiLogIn size={20} />
                      Se connecter
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="bg-base-200 text-base-content min-h-screen">
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ 
          bgcolor: '#ffffff',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid rgba(249, 115, 22, 0.1)',
          py: 1,
          transition: 'all 0.3s ease'
        }}
      >
        <Toolbar sx={{ gap: 2, maxWidth: '1400px', mx: 'auto', width: '100%', minHeight: 'auto', py: 1 }} className="px-4">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            flexGrow: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }}>
            <Box sx={{
              width: 130,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fffaf5 0%, #fffbeb 100%)',
              border: '1.5px solid rgba(249, 115, 22, 0.25)',
              boxShadow: '0 8px 24px rgba(249, 115, 22, 0.15)',
              animation: 'float 4s ease-in-out infinite',
              transition: 'all 0.4s ease',
              flexShrink: 0,
              '&:hover': {
                boxShadow: '0 12px 32px rgba(249, 115, 22, 0.25)',
                borderColor: 'rgba(249, 115, 22, 0.4)'
              },
              '& img': {
                width: 110,
                height: 44,
                filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.2))'
              }
            }}>
              <img src="/logo-header.svg" alt="Colo-Colo" />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                fontWeight={800}
                sx={{ 
                  color: '#f97316',
                  fontSize: '1.15rem',
                  letterSpacing: '-0.3px',
                  fontFamily: 'Poppins, sans-serif',
                  lineHeight: 1
                }}
              >
                COLO-COLO
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#f97316',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  fontSize: '0.65rem',
                  fontFamily: 'Poppins, sans-serif',
                  opacity: 0.8,
                  lineHeight: 1
                }}
              >
                Académie • Collèges
              </Typography>
            </Box>
          </Box>
          <AppShellNav />
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  )
}

const AppShellNav = () => {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()

  useEffect(() => {
    if (!navRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.nav-link', {
        y: -8,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05,
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  return (
    <Stack
      ref={navRef}
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        px: 1.5,
        py: 0,
        minHeight: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(249, 115, 22, 0.12)',
        border: '1.5px solid rgba(249, 115, 22, 0.15)',
        transition: 'all 0.4s ease',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        gap: 0.5,
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          boxShadow: '0 12px 32px rgba(249, 115, 22, 0.18)',
          borderColor: 'rgba(249, 115, 22, 0.25)'
        }
      }}
    >
      {getNavItemsForRole(user?.role).map((item) => (
        <Button
          key={item.to}
          component={NavLink}
          to={item.to}
          className="nav-link"
          sx={{
            textTransform: 'none',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#f97316',
            px: 1.2,
            py: 0,
            m: 0,
            position: 'relative',
            transition: 'all 0.3s ease',
            backgroundColor: 'transparent',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '38px',
            maxHeight: '38px',
            height: '38px',
            lineHeight: 1.1,
            borderRadius: '8px',
            overflow: 'visible',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: location.pathname === item.to ? '100%' : '0%',
              height: '2.5px',
              background: 'linear-gradient(90deg, #f97316 0%, #fbbf24 100%)',
              transform: 'translateX(-50%)',
              transition: 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              borderRadius: '2px'
            },
            '&:hover': {
              color: '#ea580c',
              backgroundColor: 'rgba(249, 115, 22, 0.08)',
              borderRadius: '8px',
              '&::after': {
                width: '100%'
              }
            },
            ...(location.pathname === item.to && {
              color: '#ea580c',
              fontWeight: 800,
              backgroundColor: 'rgba(249, 115, 22, 0.12)'
            })
          }}
        >
          {item.label}
        </Button>
      ))}
      {user ? (
        <>
          <Box sx={{ width: '1px', height: 24, bgcolor: 'rgba(249, 115, 22, 0.15)', alignSelf: 'center' }} />
          <Chip
            label={`${user.name} (${user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Ens.' : 'Élève'})`}
            size="small"
            color="warning"
            sx={{
              background: 'rgba(249, 115, 22, 0.08)',
              border: '1.5px solid rgba(249, 115, 22, 0.25)',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '0.75rem',
              color: '#f97316',
              height: '38px',
              m: 0,
              lineHeight: 1,
              transition: 'all 0.3s ease',
              alignItems: 'center',
              display: 'flex',
              borderRadius: '8px',
              '& .MuiChip-label': {
                px: 1.2,
                py: 0,
                lineHeight: 1
              },
              '&:hover': {
                background: 'rgba(249, 115, 22, 0.14)',
                borderColor: 'rgba(249, 115, 22, 0.35)',
                color: '#ea580c'
              }
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={logout}
            sx={{
              borderColor: 'rgba(249, 115, 22, 0.25)',
              color: '#f97316',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'none',
              px: 1.2,
              py: 0,
              m: 0,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '38px',
              maxHeight: '38px',
              height: '38px',
              lineHeight: 1,
              borderRadius: '8px',
              backgroundColor: 'rgba(249, 115, 22, 0.06)',
              '&:hover': {
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.12)',
                color: '#ea580c'
              }
            }}
          >
            Déconnexion
          </Button>
        </>
      ) : (
        <Button
          component={NavLink}
          to="/auth"
          variant="outlined"
          size="small"
          sx={{
            borderColor: 'rgba(249, 115, 22, 0.3)',
            color: '#f97316',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'none',
            px: 1.2,
            py: 0,
            m: 0,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            minHeight: '36px',
            maxHeight: '36px',
            height: '36px',
            lineHeight: 1,
            '&:hover': {
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.08)',
              color: '#ea580c'
            }
          }}
        >
          <FiLogIn size={14} />
          Se connecter
        </Button>
      )}
    </Stack>
  )
}

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])
  if (!user) return null
  return children
}

const RequireRole = ({ roles, children }: { roles: Role[]; children: React.ReactElement }) => {
  const user = useAuthStore((s) => s.user)
  if (!user || !roles.includes(user.role)) {
    return (
      <PageContainer title="Accès refusé">
        <Typography>Vous n&apos;avez pas les droits nécessaires pour accéder à cette section.</Typography>
      </PageContainer>
    )
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <DataLoader>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <RequireRole roles={['teacher', 'admin']}>
                    <Dashboard />
                  </RequireRole>
                </RequireAuth>
            }
          />
          <Route
            path="/departements"
            element={
              <RequireAuth>
                <RequireRole roles={['teacher', 'admin']}>
                  <DepartmentsPage />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/enseignants"
            element={
              <RequireAuth>
                <RequireRole roles={['teacher', 'admin']}>
                  <TeachersPage />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/etudiants"
            element={
              <RequireAuth>
                <StudentsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/matieres-salles"
            element={
              <RequireAuth>
                <SubjectsRoomsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <RequireRole roles={['admin']}>
                  <AdminPage />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/profil"
            element={
              <RequireAuth>
                <RequireRole roles={['student']}>
                  <StudentProfilePage />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
        </DataLoader>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
