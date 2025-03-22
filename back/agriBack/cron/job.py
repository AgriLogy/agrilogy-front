from django_cron import CronJobBase, Schedule
from datetime import datetime
import os
import django
import json
import logging
from django.core.exceptions import ObjectDoesNotExist

# --- Django Setup ---
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from CustomUser.models import CustomUser
from analytics.models import Sensor

class MyCronJob(CronJobBase):
    RUN_EVERY_MINS = 1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'my_app.my_cron_job'

    def do(self):
        try:
            LOG_FILE_PATH = '/home/zak/agrilogy/back/send_script.log'
            os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

            logging.basicConfig(
                filename=LOG_FILE_PATH,
                level=logging.INFO,
                format='%(asctime)s [%(levelname)s]: %(message)s',
            )

            json_file_path = './requests.json'

            try:
                with open(json_file_path, 'r') as f:
                    data_list = json.load(f)
                logging.info(f"✅ Loaded JSON data from {json_file_path}.")
            except Exception as e:
                error_msg = f"❌ Failed to load JSON file: {e}"
                logging.error(error_msg)
                return error_msg

            for data in data_list:
                username = data.get('user')

                try:
                    user = CustomUser.objects.get(username=username)
                    logging.info(f"✅ Found user: {user.username}")
                except ObjectDoesNotExist:
                    msg = f"❌ User with username '{username}' does not exist. Skipping."
                    logging.warning(msg)
                    continue  # Important!

                # Parse timestamp with fallback
                timestamp_str = data.get('timestamp')
                try:
                    timestamp_obj = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S.%f')
                except ValueError:
                    try:
                        timestamp_obj = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
                    except ValueError as e:
                        logging.error(f"❌ Invalid timestamp format for user '{username}': {timestamp_str}")
                        continue

                try:
                    # Check if Sensor entry already exists (optional)
                    if Sensor.objects.filter(user=user, timestamp=timestamp_obj).exists():
                        logging.warning(f"⚠️ Sensor already exists for user '{username}' at {timestamp_obj}. Skipping.")
                        continue

                    # Create Sensor entry
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

                    logging.info(f"✅ Created Sensor for user '{username}' with ID: {sensor.id}")

                except Exception as e:
                    error_msg = f"❌ Failed to create Sensor for user '{username}': {e}"
                    logging.error(error_msg)

            return "✅ Cron job completed successfully."

        except Exception as e:
            error_msg = f"❌ Cron job failed: {str(e)}"
            logging.error(error_msg)
            return error_msg
