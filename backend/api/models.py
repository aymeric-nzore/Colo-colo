from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model with roles"""
    # Role constants
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'
    DEPT_HEAD = 'dept_head'
    
    ROLE_CHOICES = [
        (ADMIN, 'Administration'),
        (TEACHER, 'Enseignant'),
        (STUDENT, 'Élève'),
        (DEPT_HEAD, 'Responsable Département'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=STUDENT)
    phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'users'


class College(models.Model):
    """College model - represents a school/college"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    
    class Meta:
        db_table = 'colleges'
    
    def __str__(self):
        return self.name


class Department(models.Model):
    """Academic department model"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='departments')
    responsible = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='managed_department', limit_choices_to={'role': User.DEPT_HEAD})

    class Meta:
        db_table = 'departments'

    def __str__(self):
        return self.name


class Room(models.Model):
    """Classroom model"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    capacity = models.IntegerField()

    class Meta:
        db_table = 'rooms'

    def __str__(self):
        return self.name


class Subject(models.Model):
    """Subject model"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='subjects')
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, related_name='subjects')

    class Meta:
        db_table = 'subjects'

    def __str__(self):
        return self.name


class Teacher(models.Model):
    """Teacher model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, 
                               limit_choices_to={'role__in': [User.TEACHER, User.DEPT_HEAD]})
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    start_date = models.CharField(max_length=10)
    index = models.IntegerField()
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, related_name='teachers')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='teachers')

    class Meta:
        db_table = 'teachers'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Student(models.Model):
    """Student model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, 
                               limit_choices_to={'role': User.STUDENT})
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    entry_year = models.IntegerField()
    subjects = models.ManyToManyField(Subject, related_name='students')

    class Meta:
        db_table = 'students'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Grade(models.Model):
    """Grade model - stores student grades for subjects"""
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grades')
    grade = models.FloatField()
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name='grades_assigned')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'grades'
        unique_together = ['student', 'subject']

    def __str__(self):
        return f"{self.student} - {self.subject}: {self.grade}"


class Attendance(models.Model):
    """Attendance model - tracks student presence/absence"""
    STATUS_CHOICES = [
        ('present', 'Présent'),
        ('absent', 'Absent'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='attendances')
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name='attendances_marked')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present')
    hours = models.IntegerField(default=1, help_text="Number of hours for this session")
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'attendances'
        unique_together = ['student', 'subject', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.student} - {self.subject} - {self.date}: {self.status}"


class CourseMaterial(models.Model):
    """Course materials and exercises"""
    TYPE_CHOICES = [
        ('course', 'Cours'),
        ('exercise', 'Exercice'),
        ('document', 'Document'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='course')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='materials')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='materials_created')
    file = models.FileField(upload_to='course_materials/', blank=True, null=True)
    file_url = models.URLField(blank=True, help_text="External file URL if not uploaded")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'course_materials'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.title}"


class Timetable(models.Model):
    """Schedule/Timetable for classes"""
    WEEKDAY_CHOICES = [
        (0, 'Lundi'),
        (1, 'Mardi'),
        (2, 'Mercredi'),
        (3, 'Jeudi'),
        (4, 'Vendredi'),
        (5, 'Samedi'),
        (6, 'Dimanche'),
    ]
    
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='timetable_slots')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='timetable_slots')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='timetable_slots')
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    class Meta:
        db_table = 'timetables'
        ordering = ['weekday', 'start_time']
        unique_together = [
            ['room', 'weekday', 'start_time'],  # Room can't be double-booked
            ['teacher', 'weekday', 'start_time'],  # Teacher can't be double-booked
        ]
    
    def __str__(self):
        return f"{self.get_weekday_display()} {self.start_time}-{self.end_time}: {self.subject} ({self.room})"
