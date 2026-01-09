from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Department, Teacher, Student, Subject, Room, Grade
from .serializers import (
    DepartmentSerializer,
    TeacherSerializer,
    StudentSerializer,
    SubjectSerializer,
    RoomSerializer,
    GradeSerializer,
    GradesByStudentSerializer,
)


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


@api_view(['GET'])
def grades_by_student(request):
    """
    API endpoint to get grades organized by student.
    Returns a dictionary mapping student IDs to their grades by subject.
    """
    serializer = GradesByStudentSerializer(None)
    return Response(serializer.to_representation(None))
