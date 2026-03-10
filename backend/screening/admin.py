from django.contrib import admin

from .models import Application, Candidate, Employer, Job, ScreeningTrace


@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ["title", "employer", "is_active", "created_at"]
    list_filter = ["employer", "is_active"]


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "email", "experience_years"]
    search_fields = ["first_name", "last_name", "email"]


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ["candidate", "job", "status", "screening_score", "applied_at"]
    list_filter = ["status", "job__employer"]


@admin.register(ScreeningTrace)
class ScreeningTraceAdmin(admin.ModelAdmin):
    list_display = ["application", "node_name", "started_at", "completed_at", "tokens_used"]
