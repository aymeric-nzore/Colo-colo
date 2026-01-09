from django.db import models as django_models
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import (
    User, College, Department, Teacher, Student, Subject, Room, Grade,
    Attendance, CourseMaterial, Timetable
)
from .serializers import (
    UserSerializer, CollegeSerializer, DepartmentSerializer,
    TeacherSerializer, StudentSerializer, SubjectSerializer,
    RoomSerializer, GradeSerializer, GradesByStudentSerializer,
    AttendanceSerializer, CourseMaterialSerializer, TimetableSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CollegeViewSet(viewsets.ModelViewSet):
    """API endpoint for colleges"""
    queryset = College.objects.all()
    serializer_class = CollegeSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    """API endpoint for departments"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    """API endpoint for teachers"""
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """API endpoint for students"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class SubjectViewSet(viewsets.ModelViewSet):
    """API endpoint for subjects"""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class RoomViewSet(viewsets.ModelViewSet):
    """API endpoint for rooms"""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GradeViewSet(viewsets.ModelViewSet):
    """API endpoint for grades"""
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    
    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Get grades organized by student"""
        serializer = GradesByStudentSerializer(None)
        return Response(serializer.to_representation(None))


class AttendanceViewSet(viewsets.ModelViewSet):
    """API endpoint for attendance records"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    
    @action(detail=False, methods=['get'])
    def by_student(self, request, pk=None):
        """Get attendance records for a specific student"""
        student_id = request.query_params.get('student_id')
        if student_id:
            queryset = self.queryset.filter(student_id=student_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error': 'student_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def absence_hours(self, request):
        """Calculate total absence hours for a student"""
        student_id = request.query_params.get('student_id')
        if student_id:
            total_hours = Attendance.objects.filter(
                student_id=student_id, 
                status='absent'
            ).aggregate(total=django_models.Sum('hours'))['total'] or 0
            return Response({'student_id': student_id, 'total_absence_hours': total_hours})
        return Response({'error': 'student_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class CourseMaterialViewSet(viewsets.ModelViewSet):
    """API endpoint for course materials"""
    queryset = CourseMaterial.objects.all()
    serializer_class = CourseMaterialSerializer
    
    @action(detail=False, methods=['get'])
    def by_subject(self, request):
        """Get course materials for a specific subject"""
        subject_id = request.query_params.get('subject_id')
        if subject_id:
            queryset = self.queryset.filter(subject_id=subject_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error': 'subject_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class TimetableViewSet(viewsets.ModelViewSet):
    """API endpoint for timetable/schedule"""
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    
    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Get timetable for a specific student's enrolled subjects"""
        student_id = request.query_params.get('student_id')
        if student_id:
            try:
                student = Student.objects.get(user_id=student_id)
                subject_ids = student.subjects.values_list('id', flat=True)
                queryset = self.queryset.filter(subject_id__in=subject_ids)
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)
            except Student.DoesNotExist:
                return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'student_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def grades_by_student(request):
    """
    API endpoint to get grades organized by student.
    Returns a dictionary mapping student IDs to their grades by subject.
    """
    serializer = GradesByStudentSerializer(None)
    return Response(serializer.to_representation(None))
