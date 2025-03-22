# your_app/scripts/log_time.py
import logging
from datetime import datetime

# Setup Logging
LOG_FILE_PATH = '/shared/send_script.log'

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE_PATH),
        logging.StreamHandler()  # Optional, logs to the console as well
    ]
)

# Log the current time every time the script is run
logging.info("Current time: " + str(datetime.now()))
