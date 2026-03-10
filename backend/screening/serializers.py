from rest_framework import serializers

from .models import Application, Candidate, Employer, Job, ScreeningTrace


class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ["id", "name", "slug", "created_at"]


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source="employer.name", read_only=True)
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id",
            "employer",
            "employer_name",
            "title",
            "description",
            "requirements",
            "location",
            "is_active",
            "application_count",
            "created_at",
            "updated_at",
        ]

    def get_application_count(self, obj):
        return obj.applications.count()


class CandidateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Candidate
        fields = [
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "resume_text",
            "skills",
            "experience_years",
            "created_at",
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(
        source="candidate.full_name", read_only=True
    )
    job_title = serializers.CharField(source="job.title", read_only=True)
    employer_name = serializers.CharField(
        source="job.employer.name", read_only=True
    )
    screening_score = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "candidate",
            "candidate_name",
            "job",
            "job_title",
            "employer_name",
            "status",
            "cover_letter",
            "screening_score",
            "screening_result",
            "applied_at",
            "screened_at",
        ]
        read_only_fields = [
            "status",
            "screening_score",
            "screening_result",
            "screened_at",
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["candidate", "job", "cover_letter"]


class ScreeningTraceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreeningTrace
        fields = [
            "id",
            "node_name",
            "input_data",
            "output_data",
            "started_at",
            "completed_at",
            "tokens_used",
        ]
