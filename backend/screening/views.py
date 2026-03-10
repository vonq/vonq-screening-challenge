from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Application, Candidate, Employer, Job, ScreeningTrace
from .serializers import (
    ApplicationCreateSerializer,
    ApplicationSerializer,
    CandidateSerializer,
    EmployerSerializer,
    JobSerializer,
    ScreeningTraceSerializer,
)


class EmployerViewSet(viewsets.ModelViewSet):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.all()


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        qs = Application.objects.select_related(
            "candidate", "job", "job__employer"
        ).order_by("-applied_at")

        employer_id = self.request.headers.get("X-Employer-Id")
        if employer_id:
            qs = qs.filter(job__employer_id=employer_id)

        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        job_id = self.request.query_params.get("job")
        if job_id:
            qs = qs.filter(job_id=job_id)

        return qs

    def get_serializer_class(self):
        if self.action == "create":
            return ApplicationCreateSerializer
        return ApplicationSerializer

    @action(detail=True, methods=["get"])
    def trace(self, request, pk=None):
        application = self.get_object()
        traces = ScreeningTrace.objects.filter(application=application)
        serializer = ScreeningTraceSerializer(traces, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"])
    def override(self, request, pk=None):
        return Response(
            {"detail": "Not implemented. Build this endpoint."},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )
