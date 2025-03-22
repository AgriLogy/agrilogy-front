from datetime import datetime

def log_time():
    LOG_FILE_PATH = '/home/zak/agrilogy/back/send_script.log'

    # Create (or open) the file in append mode and write the current time
    with open(LOG_FILE_PATH, 'a') as file:
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        file.write(f'Current time: {current_time}\n')

    # Optional return (django-crontab logs this output)
    return f'Logged current time: {current_time}'
