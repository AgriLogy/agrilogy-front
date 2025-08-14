from celery import shared_task
from django.core.mail import send_mail
from django.utils.timezone import now
from django.conf import settings

@shared_task
def send_periodic_notifications():
    users = ["test@example.com", "another@example.com"]  # Query your user list here
    for email in users:
        send_mail(
            subject="Periodic Notification",
            message=f"This is your periodic update. Time: {now()}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
