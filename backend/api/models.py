from django.db import models


class Department(models.Model):
    """Academic department model"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    responsible_id = models.CharField(max_length=50)

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
    id = models.CharField(max_length=50, primary_key=True)
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
    id = models.CharField(max_length=50, primary_key=True)
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

    class Meta:
        db_table = 'grades'
        unique_together = ['student', 'subject']

    def __str__(self):
        return f"{self.student} - {self.subject}: {self.grade}"
