import os
import django
import json
import logging
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist

# --- Django Setup ---
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

# --- Imports after Django setup ---
from CustomUser.models import CustomUser
from analytics.models import Sensor

# --- Logging Setup ---
LOG_FILE_PATH = '/shared/send_script.log'
os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

logging.basicConfig(
    filename=LOG_FILE_PATH,
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s]: %(message)s',
)

def main():
    json_file_path = '/shared/requests.json'

    # --- Load JSON Data ---
    try:
        with open(json_file_path, 'r') as f:
            data_list = json.load(f)
        logging.info(f"✅ Successfully loaded JSON data from {json_file_path}")
    except FileNotFoundError:
        logging.error(f"❌ JSON file not found: {json_file_path}")
        return
    except json.JSONDecodeError as e:
        logging.error(f"❌ JSON decode error: {e}")
        return
    except Exception as e:
        logging.error(f"❌ Unexpected error reading JSON file: {e}")
        return

    # --- Process Each Record ---
    for data in data_list:
        username = data.get('user')
        if not username:
            logging.warning("⚠️ Skipping entry with missing 'user' field.")
            continue

        try:
            user = CustomUser.objects.get(username=username)
            logging.info(f"✅ Found user: {user.username}")
        except ObjectDoesNotExist:
            logging.warning(f"❌ User '{username}' does not exist. Skipping.")
            continue

        timestamp_str = data.get('timestamp')
        if not timestamp_str:
            logging.warning(f"⚠️ No timestamp provided for user '{username}'. Skipping.")
            continue

        # --- Parse timestamp ---
        timestamp_obj = None
        try:
            timestamp_obj = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S.%f')
        except ValueError:
            try:
                timestamp_obj = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                logging.error(f"❌ Invalid timestamp format for user '{username}': {timestamp_str}")
                continue

        # --- Check for existing Sensor entry ---
        if Sensor.objects.filter(user=user, timestamp=timestamp_obj).exists():
            logging.warning(f"⚠️ Sensor already exists for user '{username}' at {timestamp_obj}. Skipping.")
            continue

        try:
            # --- Create Sensor entry ---
            sensor = Sensor.objects.create(
                user=user,
                precipitation_rate=data.get('precipitation_rate'),
                humidity_weather=data.get('humidity_weather'),
                wind_speed=data.get('wind_speed'),
                solar_radiation=data.get('solar_radiation'),
                pressure_weather=data.get('pressure_weather'),
                wind_direction=data.get('wind_direction'),
                temperature_weather=data.get('temperature_weather'),
                ec_soil_medium=data.get('ec_soil_medium'),
                soil_temperature_medium=data.get('soil_temperature_medium'),
                soil_ec_high=data.get('soil_ec_high'),
                ec_soil_low=data.get('ec_soil_low'),
                soil_moisture_medium=data.get('soil_moisture_medium'),
                soil_moisture_high=data.get('soil_moisture_high'),
                soil_moisture_low=data.get('soil_moisture_low'),
                ph_soil=data.get('ph_soil'),
                soil_temperature_low=data.get('soil_temperature_low'),
                soil_temperature_high=data.get('soil_temperature_high'),
                timestamp=timestamp_obj
            )
            logging.info(f"✅ Created Sensor for user '{username}' (Sensor ID: {sensor.id})")
        except Exception as e:
            logging.error(f"❌ Failed to create Sensor for user '{username}': {e}")

    logging.info("✅ Script completed successfully.")

# --- Execute script if run directly ---
if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        logging.error(f"❌ Script execution failed: {e}")
