from django.core.management.base import BaseCommand

from screening.models import Application, Candidate, Employer, Job


class Command(BaseCommand):
    help = "Seed the database with sample employers, jobs, candidates, and applications"

    def handle(self, *args, **options):
        if Employer.objects.exists():
            self.stdout.write(self.style.WARNING("Data already seeded, skipping."))
            return

        self.stdout.write("Seeding database...")

        techcorp = Employer.objects.create(name="TechCorp", slug="techcorp")
        datainc = Employer.objects.create(name="DataInc", slug="datainc")

        jobs = {
            "python_dev": Job.objects.create(
                employer=techcorp,
                title="Senior Python Developer",
                description=(
                    "We are looking for an experienced Python developer to join our "
                    "backend engineering team. You will design and build scalable APIs, "
                    "work with our data pipeline, and mentor junior developers. "
                    "The ideal candidate has strong experience with Django, REST APIs, "
                    "and has worked in fast-paced startup environments."
                ),
                requirements=[
                    "Python",
                    "Django",
                    "REST APIs",
                    "PostgreSQL",
                    "Docker",
                    "5+ years backend experience",
                    "CI/CD pipelines",
                ],
                location="Remote (EU)",
            ),
            "frontend_dev": Job.objects.create(
                employer=techcorp,
                title="Frontend React Engineer",
                description=(
                    "Join our frontend team to build beautiful, performant user "
                    "interfaces using React and TypeScript. You will work closely with "
                    "designers and backend engineers to deliver seamless user experiences."
                ),
                requirements=[
                    "React",
                    "TypeScript",
                    "CSS/Tailwind",
                    "REST API integration",
                    "3+ years frontend experience",
                    "Testing (Jest/Cypress)",
                ],
                location="Remote (EU)",
            ),
            "devops": Job.objects.create(
                employer=techcorp,
                title="DevOps Engineer",
                description=(
                    "We need a DevOps engineer to manage our cloud infrastructure, "
                    "CI/CD pipelines, and monitoring systems. Experience with AWS "
                    "and Kubernetes is essential."
                ),
                requirements=[
                    "AWS",
                    "Kubernetes",
                    "Docker",
                    "Terraform",
                    "CI/CD",
                    "Linux",
                    "Monitoring (Datadog/Prometheus)",
                ],
                location="Amsterdam, NL",
            ),
            "data_eng": Job.objects.create(
                employer=datainc,
                title="Data Engineer",
                description=(
                    "Build and maintain our data pipelines that process millions of "
                    "records daily. You will work with Spark, Airflow, and our data "
                    "warehouse to ensure reliable data delivery to our analytics team."
                ),
                requirements=[
                    "Python",
                    "Apache Spark",
                    "Airflow",
                    "SQL",
                    "Data warehousing",
                    "ETL pipelines",
                    "3+ years data engineering",
                ],
                location="Remote (Global)",
            ),
            "ml_eng": Job.objects.create(
                employer=datainc,
                title="ML Engineer",
                description=(
                    "Design and deploy machine learning models to production. You will "
                    "work on NLP and recommendation systems, collaborating with data "
                    "scientists and backend engineers."
                ),
                requirements=[
                    "Python",
                    "PyTorch or TensorFlow",
                    "MLOps",
                    "NLP",
                    "Docker",
                    "REST APIs",
                    "3+ years ML engineering",
                ],
                location="Berlin, DE",
            ),
        }

        candidates = {
            "alice": Candidate.objects.create(
                first_name="Alice",
                last_name="Van Berg",
                email="alice.vanberg@example.com",
                resume_text=(
                    "Senior software engineer with 7 years of backend experience. "
                    "Expert in Python and Django, having built and scaled multiple "
                    "REST APIs serving millions of requests. Led a team of 4 engineers "
                    "at a fintech startup. Strong experience with PostgreSQL, Redis, "
                    "Docker, and CI/CD. Comfortable with event-driven architectures "
                    "using Celery and RabbitMQ."
                ),
                skills=["Python", "Django", "PostgreSQL", "Docker", "REST APIs", "Celery", "Redis"],
                experience_years=7,
            ),
            "bob": Candidate.objects.create(
                first_name="Bob",
                last_name="Mueller",
                email="bob.mueller@example.com",
                resume_text=(
                    "Full-stack developer with 6 years of experience, primarily in "
                    "Python/Django backends. Built a recruitment platform handling "
                    "50K+ applications per month. Experienced with Django REST Framework, "
                    "PostgreSQL, Docker, and AWS. Familiar with LangChain and LLM "
                    "integration for automated candidate screening."
                ),
                skills=["Python", "Django", "REST APIs", "PostgreSQL", "AWS", "Docker", "LangChain"],
                experience_years=6,
            ),
            "clara": Candidate.objects.create(
                first_name="Clara",
                last_name="Johansson",
                email="clara.johansson@example.com",
                resume_text=(
                    "Data engineer with 5 years of experience building ETL pipelines "
                    "and data warehouses. Proficient in Python, Apache Spark, and "
                    "Airflow. Designed a real-time data pipeline processing 2M events/day. "
                    "Strong SQL skills and experience with both Snowflake and BigQuery."
                ),
                skills=["Python", "Apache Spark", "Airflow", "SQL", "Snowflake", "BigQuery", "ETL"],
                experience_years=5,
            ),
            "david": Candidate.objects.create(
                first_name="David",
                last_name="Kim",
                email="david.kim@example.com",
                resume_text=(
                    "ML engineer with 4 years of experience in NLP and recommendation "
                    "systems. Published 2 papers on transformer-based models. "
                    "Production experience deploying models with PyTorch, FastAPI, "
                    "and Docker. Familiar with MLflow for experiment tracking."
                ),
                skills=["Python", "PyTorch", "NLP", "Docker", "FastAPI", "MLOps", "Transformers"],
                experience_years=4,
            ),
            "elena": Candidate.objects.create(
                first_name="Elena",
                last_name="Petrov",
                email="elena.petrov@example.com",
                resume_text=(
                    "Backend developer with 3 years of experience. Worked mainly "
                    "with Python and Flask. Some exposure to Django through a side "
                    "project. Familiar with SQL databases and basic Docker usage. "
                    "Looking to transition into a more senior role."
                ),
                skills=["Python", "Flask", "SQL", "Docker", "Git"],
                experience_years=3,
            ),
            "frank": Candidate.objects.create(
                first_name="Frank",
                last_name="De Vries",
                email="frank.devries@example.com",
                resume_text=(
                    "Junior developer with 2 years of experience in web development. "
                    "Worked with JavaScript and Node.js. Basic knowledge of Python "
                    "from an online course. Eager to learn and grow."
                ),
                skills=["JavaScript", "Node.js", "HTML/CSS", "MongoDB"],
                experience_years=2,
            ),
            "grace": Candidate.objects.create(
                first_name="Grace",
                last_name="Nakamura",
                email="grace.nakamura@example.com",
                resume_text=(
                    "Marketing specialist with 5 years of experience in digital "
                    "marketing and content creation. Managed social media campaigns "
                    "for tech companies. No programming background."
                ),
                skills=["Marketing", "Content Creation", "Social Media", "Analytics"],
                experience_years=5,
            ),
            "hans": Candidate.objects.create(
                first_name="Hans",
                last_name="Weber",
                email="hans.weber@example.com",
                resume_text=(
                    "DevOps/Platform engineer with 4 years of experience. Deep "
                    "expertise in AWS, Kubernetes, and Terraform. Built CI/CD "
                    "pipelines for a 50-person engineering org. Some Python scripting. "
                    "Comfortable with monitoring tools like Datadog and Grafana."
                ),
                skills=["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Linux", "Python"],
                experience_years=4,
            ),
        }

        Application.objects.create(
            candidate=candidates["alice"],
            job=jobs["python_dev"],
            status="received",
            cover_letter="I am very excited about this role...",
        )
        Application.objects.create(
            candidate=candidates["elena"],
            job=jobs["python_dev"],
            status="received",
            cover_letter="I believe my Flask experience transfers well...",
        )
        Application.objects.create(
            candidate=candidates["clara"],
            job=jobs["data_eng"],
            status="received",
            cover_letter="My Spark and Airflow experience aligns perfectly...",
        )
        Application.objects.create(
            candidate=candidates["frank"],
            job=jobs["frontend_dev"],
            status="screening",
            cover_letter="I want to expand into React development...",
        )
        Application.objects.create(
            candidate=candidates["bob"],
            job=jobs["python_dev"],
            status="screened",
            cover_letter="Having built a recruitment platform myself...",
            screening_score=0.85,
            screening_result={
                "decision": "Accept",
                "reasoning": (
                    "Strong Python/Django background with direct recruitment "
                    "domain experience. LangChain familiarity is a bonus."
                ),
                "screening_results": [
                    {
                        "stage": "parse_resume",
                        "data": [
                            {"skill": "Python", "years": 6},
                            {"skill": "Django", "years": 5},
                            {"skill": "PostgreSQL", "years": 4},
                        ],
                    },
                    {
                        "stage": "evaluate_fit",
                        "data": [
                            {"requirement": "Python", "met": True, "score": 0.95},
                            {"requirement": "Django", "met": True, "score": 0.9},
                            {"requirement": "REST APIs", "met": True, "score": 0.9},
                            {"requirement": "PostgreSQL", "met": True, "score": 0.85},
                            {"requirement": "Docker", "met": True, "score": 0.8},
                        ],
                        "overall_score": 0.85,
                    },
                ],
                "interview_questions": [
                    "Describe a time you scaled a Django API to handle significantly more traffic. What bottlenecks did you encounter?",
                    "How would you design a multi-tenant recruitment platform? What data isolation strategies would you consider?",
                    "Tell us about your experience with LangChain. How did you handle LLM reliability in production?",
                ],
            },
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded: {Employer.objects.count()} employers, "
                f"{Job.objects.count()} jobs, "
                f"{Candidate.objects.count()} candidates, "
                f"{Application.objects.count()} applications"
            )
        )
