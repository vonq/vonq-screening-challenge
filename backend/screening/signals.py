from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Application
from .tasks import run_screening_task


@receiver(post_save, sender=Application)
def trigger_screening(sender, instance, **kwargs):
    """Kick off the screening agent whenever an application is saved."""
    if instance.status == "received":
        run_screening_task.delay(instance.id)
