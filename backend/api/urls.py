from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    TeacherViewSet,
    StudentViewSet,
    SubjectViewSet,
    RoomViewSet,
    GradeViewSet,
    grades_by_student,
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'students', StudentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('grades-by-student/', grades_by_student, name='grades-by-student'),
]
