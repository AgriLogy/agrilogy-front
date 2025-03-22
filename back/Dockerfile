FROM python:3.9

ENV PYTHONUNBUFFERED=1
WORKDIR /code

# Install system packages
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Copy and install Python packages
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . /code/

# Install django-crontab (if not in requirements.txt)
RUN pip install django-crontab

# Add a crontab file to /etc/cron.d/
RUN echo "* * * * * cd /code && python manage.py runcrons >> /var/log/cron.log 2>&1" > /etc/cron.d/django-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/django-cron

# Apply cron job
RUN crontab /etc/cron.d/django-cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Entrypoint script
COPY run.sh /run.sh
RUN chmod +x /run.sh

CMD ["bash", "/run.sh"]
