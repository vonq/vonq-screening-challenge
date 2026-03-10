from django.db import models


class Employer(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Job(models.Model):
    employer = models.ForeignKey(
        Employer, on_delete=models.CASCADE, related_name="jobs"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.JSONField(default=list)
    location = models.CharField(max_length=255, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} @ {self.employer.name}"


class Candidate(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    resume_text = models.TextField(blank=True, default="")
    skills = models.JSONField(default=list)
    experience_years = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Application(models.Model):
    class Status(models.TextChoices):
        RECEIVED = "received", "Received"
        SCREENING = "screening", "Screening"
        SCREENED = "screened", "Screened"
        INTERVIEW_READY = "interview_ready", "Interview Ready"
        REJECTED = "rejected", "Rejected"
        ERROR = "error", "Error"

    candidate = models.ForeignKey(
        Candidate, on_delete=models.CASCADE, related_name="applications"
    )
    job = models.ForeignKey(
        Job, on_delete=models.CASCADE, related_name="applications"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.RECEIVED
    )
    cover_letter = models.TextField(blank=True, default="")
    screening_score = models.FloatField(null=True, blank=True)
    screening_result = models.JSONField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    screened_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("candidate", "job")

    def __str__(self):
        return f"{self.candidate} → {self.job} ({self.status})"


class ScreeningTrace(models.Model):
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="traces"
    )
    node_name = models.CharField(max_length=100)
    input_data = models.JSONField(null=True, blank=True)
    output_data = models.JSONField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    tokens_used = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ["started_at"]

    def __str__(self):
        return f"{self.application_id} - {self.node_name}"
