from django.core.management.base import BaseCommand
from api.models import (
    User, College, Department, Teacher, Student, Subject, Room, Grade,
    Attendance, CourseMaterial, Timetable
)
from datetime import date, time


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Clear existing data
        Timetable.objects.all().delete()
        CourseMaterial.objects.all().delete()
        Attendance.objects.all().delete()
        Grade.objects.all().delete()
        Student.objects.all().delete()
        Teacher.objects.all().delete()
        Subject.objects.all().delete()
        Room.objects.all().delete()
        Department.objects.all().delete()
        College.objects.all().delete()
        User.objects.all().delete()

        # Create Users
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@college.fr',
            password='admin123',
            first_name='Admin',
            last_name='System',
            role='admin'
        )
        
        # Create College
        college = College.objects.create(
            id='col-1',
            name='Collège Colo-Colo',
            address='123 Rue de l\'Éducation, 75001 Paris',
            phone='01 23 45 67 89'
        )
        self.stdout.write(self.style.SUCCESS(f'Created 1 college'))

        # Create Departments (without responsible first)
        departments_data = [
            {'id': 'dep-1', 'name': 'Sciences', 'code': 'SCI', 'college': college},
            {'id': 'dep-2', 'name': 'Lettres', 'code': 'LET', 'college': college},
            {'id': 'dep-3', 'name': 'Technologie', 'code': 'TECH', 'college': college},
        ]
        departments = {}
        for dept_data in departments_data:
            dept = Department.objects.create(**dept_data)
            departments[dept.id] = dept
        self.stdout.write(self.style.SUCCESS(f'Created {len(departments_data)} departments'))

        # Create Rooms
        rooms_data = [
            {'id': 'r-101', 'name': 'Salle 101', 'capacity': 32},
            {'id': 'r-202', 'name': 'Salle 202', 'capacity': 28},
            {'id': 'lab-1', 'name': 'Laboratoire', 'capacity': 24},
            {'id': 'r-303', 'name': 'Salle 303', 'capacity': 30},
        ]
        for room_data in rooms_data:
            Room.objects.create(**room_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(rooms_data)} rooms'))

        # Create Subjects
        subjects_data = [
            {'id': 'mat-1', 'name': 'Mathématiques', 'department': departments['dep-1'], 'room_id': 'r-101'},
            {'id': 'mat-2', 'name': 'Physique', 'department': departments['dep-1'], 'room_id': 'lab-1'},
            {'id': 'mat-3', 'name': 'Français', 'department': departments['dep-2'], 'room_id': 'r-202'},
            {'id': 'mat-4', 'name': 'Technologie', 'department': departments['dep-3'], 'room_id': 'lab-1'},
            {'id': 'mat-5', 'name': 'Histoire-Géographie', 'department': departments['dep-2'], 'room_id': 'r-202'},
            {'id': 'mat-6', 'name': 'Sciences de la vie et de la Terre', 'department': departments['dep-1'], 'room_id': 'r-303'},
            {'id': 'mat-7', 'name': 'Anglais', 'department': departments['dep-2'], 'room_id': 'r-101'},
        ]
        for subject_data in subjects_data:
            Subject.objects.create(**subject_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(subjects_data)} subjects'))

        # Create Teacher Users and Teachers
        teachers_data = [
            {
                'username': 'alice.martin',
                'email': 'alice.martin@college.fr',
                'first_name': 'Alice',
                'last_name': 'Martin',
                'phone': '06 11 22 33 44',
                'role': 'dept_head',
                'start_date': '2018',
                'index': 720,
                'subject_id': 'mat-1',
                'department': departments['dep-1'],
            },
            {
                'username': 'karim.benali',
                'email': 'karim.benali@college.fr',
                'first_name': 'Karim',
                'last_name': 'Benali',
                'phone': '06 22 33 44 55',
                'role': 'teacher',
                'start_date': '2020',
                'index': 650,
                'subject_id': 'mat-2',
                'department': departments['dep-1'],
            },
            {
                'username': 'sophie.durand',
                'email': 'sophie.durand@college.fr',
                'first_name': 'Sophie',
                'last_name': 'Durand',
                'phone': '06 55 66 77 88',
                'role': 'dept_head',
                'start_date': '2016',
                'index': 780,
                'subject_id': 'mat-3',
                'department': departments['dep-2'],
            },
            {
                'username': 'marc.leclerc',
                'email': 'marc.leclerc@college.fr',
                'first_name': 'Marc',
                'last_name': 'Leclerc',
                'phone': '06 77 88 99 00',
                'role': 'dept_head',
                'start_date': '2019',
                'index': 690,
                'subject_id': 'mat-4',
                'department': departments['dep-3'],
            },
            {
                'username': 'julie.robert',
                'email': 'julie.robert@college.fr',
                'first_name': 'Julie',
                'last_name': 'Robert',
                'phone': '06 88 99 00 11',
                'role': 'teacher',
                'start_date': '2021',
                'index': 640,
                'subject_id': 'mat-5',
                'department': departments['dep-2'],
            },
            {
                'username': 'omar.diallo',
                'email': 'omar.diallo@college.fr',
                'first_name': 'Omar',
                'last_name': 'Diallo',
                'phone': '06 33 44 55 66',
                'role': 'teacher',
                'start_date': '2019',
                'index': 700,
                'subject_id': 'mat-6',
                'department': departments['dep-1'],
            },
            {
                'username': 'emma.leroux',
                'email': 'emma.leroux@college.fr',
                'first_name': 'Emma',
                'last_name': 'Leroux',
                'phone': '06 99 11 22 33',
                'role': 'teacher',
                'start_date': '2017',
                'index': 730,
                'subject_id': 'mat-7',
                'department': departments['dep-2'],
            },
        ]
        
        teachers = {}
        for teacher_data in teachers_data:
            user = User.objects.create_user(
                username=teacher_data['username'],
                email=teacher_data['email'],
                password='teacher123',
                first_name=teacher_data['first_name'],
                last_name=teacher_data['last_name'],
                phone=teacher_data['phone'],
                role=teacher_data['role']
            )
            teacher = Teacher.objects.create(
                user=user,
                first_name=teacher_data['first_name'],
                last_name=teacher_data['last_name'],
                phone=teacher_data['phone'],
                email=teacher_data['email'],
                start_date=teacher_data['start_date'],
                index=teacher_data['index'],
                subject_id=teacher_data['subject_id'],
                department=teacher_data['department']
            )
            teachers[teacher.user_id] = teacher
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(teachers_data)} teachers'))

        # Update departments with responsible teachers
        departments['dep-1'].responsible = list(teachers.values())[0].user
        departments['dep-1'].save()
        departments['dep-2'].responsible = list(teachers.values())[2].user
        departments['dep-2'].save()
        departments['dep-3'].responsible = list(teachers.values())[3].user
        departments['dep-3'].save()
        self.stdout.write(self.style.SUCCESS('Updated department responsibles'))

        # Create Student Users and Students
        students_data = [
            {
                'username': 'nora.ali',
                'email': 'nora.ali@eleve.fr',
                'first_name': 'Nora',
                'last_name': 'Ali',
                'phone': '07 10 20 30 40',
                'entry_year': 2023,
                'subject_ids': ['mat-1', 'mat-2', 'mat-3', 'mat-7'],
            },
            {
                'username': 'louis.moreau',
                'email': 'louis.moreau@eleve.fr',
                'first_name': 'Louis',
                'last_name': 'Moreau',
                'phone': '07 22 33 44 55',
                'entry_year': 2022,
                'subject_ids': ['mat-1', 'mat-3', 'mat-4', 'mat-5'],
            },
            {
                'username': 'lea.dupont',
                'email': 'lea.dupont@eleve.fr',
                'first_name': 'Lea',
                'last_name': 'Dupont',
                'phone': '07 44 55 66 77',
                'entry_year': 2021,
                'subject_ids': ['mat-2', 'mat-3', 'mat-6'],
            },
        ]
        
        students = {}
        for student_data in students_data:
            subject_ids = student_data.pop('subject_ids')
            user = User.objects.create_user(
                username=student_data['username'],
                email=student_data['email'],
                password='student123',
                first_name=student_data['first_name'],
                last_name=student_data['last_name'],
                phone=student_data['phone'],
                role='student'
            )
            student = Student.objects.create(
                user=user,
                first_name=student_data['first_name'],
                last_name=student_data['last_name'],
                phone=student_data['phone'],
                email=student_data['email'],
                entry_year=student_data['entry_year']
            )
            for subject_id in subject_ids:
                student.subjects.add(subject_id)
            students[student.user_id] = student
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(students_data)} students'))

        # Create Grades
        grades_data = [
            {'student': list(students.values())[0], 'subject_id': 'mat-1', 'grade': 15, 'teacher': list(teachers.values())[0]},
            {'student': list(students.values())[0], 'subject_id': 'mat-2', 'grade': 13, 'teacher': list(teachers.values())[1]},
            {'student': list(students.values())[0], 'subject_id': 'mat-3', 'grade': 14, 'teacher': list(teachers.values())[2]},
            {'student': list(students.values())[1], 'subject_id': 'mat-1', 'grade': 12, 'teacher': list(teachers.values())[0]},
            {'student': list(students.values())[1], 'subject_id': 'mat-3', 'grade': 11, 'teacher': list(teachers.values())[2]},
            {'student': list(students.values())[1], 'subject_id': 'mat-4', 'grade': 16, 'teacher': list(teachers.values())[3]},
            {'student': list(students.values())[2], 'subject_id': 'mat-2', 'grade': 17, 'teacher': list(teachers.values())[1]},
        ]
        for grade_data in grades_data:
            Grade.objects.create(**grade_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(grades_data)} grades'))

        # Create sample attendance records
        attendance_data = [
            {'student': list(students.values())[0], 'subject_id': 'mat-1', 'teacher': list(teachers.values())[0], 
             'date': date(2025, 1, 5), 'status': 'present', 'hours': 2},
            {'student': list(students.values())[0], 'subject_id': 'mat-2', 'teacher': list(teachers.values())[1], 
             'date': date(2025, 1, 6), 'status': 'absent', 'hours': 2, 'notes': 'Maladie'},
        ]
        for att_data in attendance_data:
            Attendance.objects.create(**att_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(attendance_data)} attendance records'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
