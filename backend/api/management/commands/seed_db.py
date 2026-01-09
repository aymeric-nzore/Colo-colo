from django.core.management.base import BaseCommand
from api.models import Department, Teacher, Student, Subject, Room, Grade


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Clear existing data
        Grade.objects.all().delete()
        Student.objects.all().delete()
        Teacher.objects.all().delete()
        Subject.objects.all().delete()
        Room.objects.all().delete()
        Department.objects.all().delete()

        # Create Departments
        departments_data = [
            {'id': 'dep-1', 'name': 'Sciences', 'responsible_id': 't-1'},
            {'id': 'dep-2', 'name': 'Lettres', 'responsible_id': 't-3'},
            {'id': 'dep-3', 'name': 'Technologie', 'responsible_id': 't-4'},
        ]
        for dept_data in departments_data:
            Department.objects.create(**dept_data)
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
            {'id': 'mat-1', 'name': 'Mathématiques', 'department_id': 'dep-1', 'room_id': 'r-101'},
            {'id': 'mat-2', 'name': 'Physique', 'department_id': 'dep-1', 'room_id': 'lab-1'},
            {'id': 'mat-3', 'name': 'Français', 'department_id': 'dep-2', 'room_id': 'r-202'},
            {'id': 'mat-4', 'name': 'Technologie', 'department_id': 'dep-3', 'room_id': 'lab-1'},
            {'id': 'mat-5', 'name': 'Histoire-Géographie', 'department_id': 'dep-2', 'room_id': 'r-202'},
            {'id': 'mat-6', 'name': 'Sciences de la vie et de la Terre', 'department_id': 'dep-1', 'room_id': 'r-303'},
            {'id': 'mat-7', 'name': 'Anglais', 'department_id': 'dep-2', 'room_id': 'r-101'},
        ]
        for subject_data in subjects_data:
            Subject.objects.create(**subject_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(subjects_data)} subjects'))

        # Create Teachers
        teachers_data = [
            {
                'id': 't-1',
                'first_name': 'Alice',
                'last_name': 'Martin',
                'phone': '06 11 22 33 44',
                'email': 'alice.martin@college.fr',
                'start_date': '2018',
                'index': 720,
                'subject_id': 'mat-1',
                'department_id': 'dep-1',
            },
            {
                'id': 't-2',
                'first_name': 'Karim',
                'last_name': 'Benali',
                'phone': '06 22 33 44 55',
                'email': 'karim.benali@college.fr',
                'start_date': '2020',
                'index': 650,
                'subject_id': 'mat-2',
                'department_id': 'dep-1',
            },
            {
                'id': 't-3',
                'first_name': 'Sophie',
                'last_name': 'Durand',
                'phone': '06 55 66 77 88',
                'email': 'sophie.durand@college.fr',
                'start_date': '2016',
                'index': 780,
                'subject_id': 'mat-3',
                'department_id': 'dep-2',
            },
            {
                'id': 't-4',
                'first_name': 'Marc',
                'last_name': 'Leclerc',
                'phone': '06 77 88 99 00',
                'email': 'marc.leclerc@college.fr',
                'start_date': '2019',
                'index': 690,
                'subject_id': 'mat-4',
                'department_id': 'dep-3',
            },
            {
                'id': 't-5',
                'first_name': 'Julie',
                'last_name': 'Robert',
                'phone': '06 88 99 00 11',
                'email': 'julie.robert@college.fr',
                'start_date': '2021',
                'index': 640,
                'subject_id': 'mat-5',
                'department_id': 'dep-2',
            },
            {
                'id': 't-6',
                'first_name': 'Omar',
                'last_name': 'Diallo',
                'phone': '06 33 44 55 66',
                'email': 'omar.diallo@college.fr',
                'start_date': '2019',
                'index': 700,
                'subject_id': 'mat-6',
                'department_id': 'dep-1',
            },
            {
                'id': 't-7',
                'first_name': 'Emma',
                'last_name': 'Leroux',
                'phone': '06 99 11 22 33',
                'email': 'emma.leroux@college.fr',
                'start_date': '2017',
                'index': 730,
                'subject_id': 'mat-7',
                'department_id': 'dep-2',
            },
        ]
        for teacher_data in teachers_data:
            Teacher.objects.create(**teacher_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(teachers_data)} teachers'))

        # Create Students
        students_data = [
            {
                'id': 's-1',
                'first_name': 'Nora',
                'last_name': 'Ali',
                'phone': '07 10 20 30 40',
                'email': 'nora.ali@eleve.fr',
                'entry_year': 2023,
                'subject_ids': ['mat-1', 'mat-2', 'mat-3', 'mat-7'],
            },
            {
                'id': 's-2',
                'first_name': 'Louis',
                'last_name': 'Moreau',
                'phone': '07 22 33 44 55',
                'email': 'louis.moreau@eleve.fr',
                'entry_year': 2022,
                'subject_ids': ['mat-1', 'mat-3', 'mat-4', 'mat-5'],
            },
            {
                'id': 's-3',
                'first_name': 'Lea',
                'last_name': 'Dupont',
                'phone': '07 44 55 66 77',
                'email': 'lea.dupont@eleve.fr',
                'entry_year': 2021,
                'subject_ids': ['mat-2', 'mat-3', 'mat-6'],
            },
        ]
        for student_data in students_data:
            subject_ids = student_data.pop('subject_ids')
            student = Student.objects.create(**student_data)
            for subject_id in subject_ids:
                student.subjects.add(subject_id)
        self.stdout.write(self.style.SUCCESS(f'Created {len(students_data)} students'))

        # Create Grades
        grades_data = [
            {'student_id': 's-1', 'subject_id': 'mat-1', 'grade': 15},
            {'student_id': 's-1', 'subject_id': 'mat-2', 'grade': 13},
            {'student_id': 's-1', 'subject_id': 'mat-3', 'grade': 14},
            {'student_id': 's-2', 'subject_id': 'mat-1', 'grade': 12},
            {'student_id': 's-2', 'subject_id': 'mat-3', 'grade': 11},
            {'student_id': 's-2', 'subject_id': 'mat-4', 'grade': 16},
            {'student_id': 's-3', 'subject_id': 'mat-2', 'grade': 17},
        ]
        for grade_data in grades_data:
            Grade.objects.create(**grade_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(grades_data)} grades'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
