from celery import shared_task
from django.core.mail import get_connection, send_mail
from django.utils.timezone import now
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_periodic_notifications():
    try:
        # Use connection as a context manager to handle connect/disconnect properly
        with get_connection() as connection:
            logger.info(f"Email connection opened successfully at {now()}")
            try:
                send_mail(
                    subject="Periodic Notification",
                    message=f"This is your periodic update. Time: {now()}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=["test@example.com"],
                    connection=connection,
                    fail_silently=False,
                )
                logger.info(f"Email sent successfully to test@example.com at {now()}")
            except Exception as e:
                logger.error(f"Failed to send email at {now()}: {str(e)}")

    except Exception as e:
        logger.critical(f"Unexpected error in email task at {now()}: {str(e)}")
