from rest_framework import serializers
from .models import (
    User, College, Department, Teacher, Student, Subject, Room, Grade,
    Attendance, CourseMaterial, Timetable
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        """Create user with encrypted password"""
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user


class CollegeSerializer(serializers.ModelSerializer):
    """Serializer for College model"""
    class Meta:
        model = College
        fields = ['id', 'name', 'address', 'phone']


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    responsibleId = serializers.IntegerField(source='responsible_id', allow_null=True, required=False)
    collegeId = serializers.CharField(source='college_id')
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'collegeId', 'responsibleId']


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
    id = serializers.IntegerField(source='user_id', read_only=True)
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    startDate = serializers.CharField(source='start_date')
    subjectId = serializers.CharField(source='subject_id', allow_null=True, required=False)
    departmentId = serializers.CharField(source='department_id')

    class Meta:
        model = Teacher
        fields = ['id', 'firstName', 'lastName', 'phone', 'email', 'startDate', 'index', 'subjectId', 'departmentId']


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for Student model"""
    id = serializers.IntegerField(source='user_id', read_only=True)
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
    studentId = serializers.IntegerField(source='student_id')
    subjectId = serializers.CharField(source='subject_id')
    teacherId = serializers.IntegerField(source='teacher_id', allow_null=True, required=False)

    class Meta:
        model = Grade
        fields = ['id', 'studentId', 'subjectId', 'grade', 'teacherId', 'created_at', 'updated_at']


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


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model"""
    studentId = serializers.IntegerField(source='student_id')
    subjectId = serializers.CharField(source='subject_id')
    teacherId = serializers.IntegerField(source='teacher_id', allow_null=True, required=False)
    
    class Meta:
        model = Attendance
        fields = ['id', 'studentId', 'subjectId', 'teacherId', 'date', 'status', 'hours', 'notes']


class CourseMaterialSerializer(serializers.ModelSerializer):
    """Serializer for Course Material model"""
    subjectId = serializers.CharField(source='subject_id')
    teacherId = serializers.IntegerField(source='teacher_id')
    fileUrl = serializers.SerializerMethodField()
    
    class Meta:
        model = CourseMaterial
        fields = ['id', 'title', 'description', 'type', 'subjectId', 'teacherId', 
                  'fileUrl', 'created_at', 'updated_at']
    
    def get_fileUrl(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return obj.file_url


class TimetableSerializer(serializers.ModelSerializer):
    """Serializer for Timetable model"""
    subjectId = serializers.CharField(source='subject_id')
    teacherId = serializers.IntegerField(source='teacher_id')
    roomId = serializers.CharField(source='room_id')
    weekdayName = serializers.CharField(source='get_weekday_display', read_only=True)
    
    class Meta:
        model = Timetable
        fields = ['id', 'subjectId', 'teacherId', 'roomId', 'weekday', 'weekdayName', 
                  'start_time', 'end_time']
