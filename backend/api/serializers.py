from rest_framework import serializers
from .models import Department, Teacher, Student, Subject, Room, Grade


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    responsibleId = serializers.CharField(source='responsible_id')

    class Meta:
        model = Department
        fields = ['id', 'name', 'responsibleId']


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for Room model"""
    class Meta:
        model = Room
        fields = ['id', 'name', 'capacity']


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for Subject model"""
    departmentId = serializers.CharField(source='department_id')
    roomId = serializers.CharField(source='room_id')

    class Meta:
        model = Subject
        fields = ['id', 'name', 'departmentId', 'roomId']


class TeacherSerializer(serializers.ModelSerializer):
    """Serializer for Teacher model"""
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    startDate = serializers.CharField(source='start_date')
    subjectId = serializers.CharField(source='subject_id')
    departmentId = serializers.CharField(source='department_id')

    class Meta:
        model = Teacher
        fields = ['id', 'firstName', 'lastName', 'phone', 'email', 'startDate', 'index', 'subjectId', 'departmentId']


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for Student model"""
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    entryYear = serializers.IntegerField(source='entry_year')
    subjectIds = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'firstName', 'lastName', 'phone', 'email', 'entryYear', 'subjectIds']

    def get_subjectIds(self, obj):
        return list(obj.subjects.values_list('id', flat=True))


class GradeSerializer(serializers.ModelSerializer):
    """Serializer for Grade model"""
    studentId = serializers.CharField(source='student_id')
    subjectId = serializers.CharField(source='subject_id')

    class Meta:
        model = Grade
        fields = ['id', 'studentId', 'subjectId', 'grade']


class GradesByStudentSerializer(serializers.Serializer):
    """Serializer for grades organized by student"""
    def to_representation(self, instance):
        # Get all grades
        grades = Grade.objects.all()
        result = {}
        for grade in grades:
            student_id = grade.student_id
            subject_id = grade.subject_id
            if student_id not in result:
                result[student_id] = {}
            result[student_id][subject_id] = grade.grade
        return result
