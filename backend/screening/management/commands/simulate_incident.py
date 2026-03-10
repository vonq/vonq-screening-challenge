import textwrap

from django.core.management.base import BaseCommand

from screening.models import Application, Candidate, Employer, Job


class Command(BaseCommand):
    help = "Simulate a production incident for the challenge curveball"

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Simulating production incident..."))

        try:
            techcorp = Employer.objects.get(slug="techcorp")
            datainc = Employer.objects.get(slug="datainc")
        except Employer.DoesNotExist:
            self.stdout.write(self.style.ERROR("Run seed_data first."))
            return

        techcorp_jobs = Job.objects.filter(employer=techcorp)
        datainc_candidates = Candidate.objects.filter(
            email__in=[
                "clara.johansson@example.com",
                "david.kim@example.com",
            ]
        )

        created_count = 0
        for candidate in datainc_candidates:
            for job in techcorp_jobs[:2]:
                _, created = Application.objects.get_or_create(
                    candidate=candidate,
                    job=job,
                    defaults={
                        "status": "received",
                        "cover_letter": "Auto-generated cross-tenant application.",
                    },
                )
                if created:
                    created_count += 1

        self.stdout.write(
            f"Created {created_count} cross-tenant applications"
        )

        resaved = 0
        for app in Application.objects.all():
            app.save()
            resaved += 1

        self.stdout.write(f"Re-saved {resaved} applications (triggering signals)")

        incident_report = textwrap.dedent("""
        ╔══════════════════════════════════════════════════════════════╗
        ║                   PRODUCTION INCIDENT                       ║
        ╠══════════════════════════════════════════════════════════════╣
        ║                                                              ║
        ║  Three issues reported:                                      ║
        ║                                                              ║
        ║  1. Some candidates are being screened against the wrong     ║
        ║     job posting (DataInc candidates showing up in            ║
        ║     TechCorp screening results)                              ║
        ║                                                              ║
        ║  2. The agent is rejecting qualified candidates who          ║
        ║     should clearly be accepted                               ║
        ║                                                              ║
        ║  3. Screening is taking 3+ minutes per candidate instead     ║
        ║     of the expected 15-30 seconds                            ║
        ║                                                              ║
        ║  The investor demo is in 90 minutes. Fix it.                 ║
        ║                                                              ║
        ╚══════════════════════════════════════════════════════════════╝

        Send the above message to the candidate.
        """)

        self.stdout.write(self.style.ERROR(incident_report))
