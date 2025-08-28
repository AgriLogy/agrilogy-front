from datetime import timedelta
from pathlib import Path
import os
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv()

# === DJANGO CONFIG ===
SECRET_KEY = os.getenv('SECRET_KEY', '+@*@loo#%*ay6*m8w1xy7)l2+$iueppj)ns(nj0r6^@+@ujokd')
# DEBUG = os.getenv('DEBUG', 'True') == 'True'
DEBUG = os.getenv('DEBUG', 'True') == 'True'


# === CORS CONFIG ===
from corsheaders.defaults import default_headers

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = (
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)

CORS_ALLOW_HEADERS = list(default_headers)

CSRF_COOKIE_SAMESITE = 'Lax'  # or 'None' if cross-site and using HTTPS
CSRF_COOKIE_SECURE = False    # True if HTTPS
CSRF_COOKIE_HTTPONLY = False  # So JS can read token if needed

ALLOWED_HOSTS = [
    '157.245.43.196',
    'localhost',
    '127.0.0.1',
]


# === CSRF CONFIG ===
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
    "http://157.245.43.196:3000",
    "http://localhost:80",
    "http://127.0.0.1:80",
    "http://0.0.0.0:80",
    "http://157.245.43.196:80"
]


# === CSRF CONFIG ===
# CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS', 'http://0.0.0.0:3000,http://192.168.1.1:3000').split(',')
# CSRF_COOKIE_HTTPONLY = False
# CSRF_COOKIE_SECURE = False
# CSRF_COOKIE_SAMESITE = "Lax"
# SESSION_COOKIE_SAMESITE = "Lax"

# === APPLICATIONS ===
INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	
    # Third-party apps
    'drf_yasg',
    'rest_framework',
	'django_extensions',
    'django_celery_beat',
	
    # My apps
    'analytics',
    'corsheaders',
    'CustomUser',
]

# === MIDDLEWARE ===
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
]

ROOT_URLCONF = 'agriBack.urls'

# === TEMPLATES ===
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'agriBack.wsgi.application'

# === DATABASE CONFIG ===
# USE_POSTGRES = os.getenv('USE_POSTGRES', 'True') == 'True'

# if USE_POSTGRES:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.getenv('POSTGRES_DB', 'agrydata_db'),
#         'USER': os.getenv('POSTGRES_USER', 'agry_admin'),
#         'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'Str0ngP@ssw0rd!'),
#         'HOST': os.getenv('POSTGRES_HOST', 'agrydata'),
#         'PORT': int(os.getenv('POSTGRES_PORT', 5432)),
#     }
# }
# else:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db3.sqlite3',
    }
}

# === PASSWORD VALIDATORS ===
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# === INTERNATIONALIZATION ===
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# === STATIC FILES ===
STATIC_URL = 'static/'

# === PRIMARY KEY ===
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# === AUTH USER MODEL ===
AUTH_USER_MODEL = 'CustomUser.CustomUser'

# === REST FRAMEWORK ===
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# === JWT CONFIG ===
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=10),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

# === CRON CONFIG ===
CRON_CLASSES = [
    "agriBack.cron.job.MyCronJob",
]

# === EMAIL CONFIG ===
EMAIL_HOST = os.getenv('EMAIL_HOST', '')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
EMAIL_PORT = os.getenv('EMAIL_PORT', '')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'False') == 'True'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False') == 'True'

# === BACKEND / FRONTEND HOST INFO ===
B_HOST = os.getenv('B_HOST', '')
F_HOST = os.getenv('F_HOST', '')



# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'z.mks.iii@gmail.com'
# EMAIL_HOST_PASSWORD = 'mzwu tuho ptze cvqy'
# EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'



from celery.schedules import crontab

CELERY_TIMEZONE = "UTC"
CELERY_ENABLE_UTC = True
CELERY_BROKER_URL="redis://redis:6379/0"


# CELERY_BEAT_SCHEDULE = {
#     'send-email-every-minute': {
#         'task': 'agriBack.tasks.send_periodic_notifications',
#         'schedule': crontab(minute='*'),
#     },
# 	    "compute_et0_vpd_hourly": {
#         "task": "sensors.tasks.compute_et0_vpd_hourly",
#         "schedule": crontab(minute='*'),  # every hour at :05
#     },
# }

CELERY_BEAT_SCHEDULE = {
    "simulate_sensors_quarter_hourly": {
        "task": "sensors.tasks.simulate_sensor_ingest",
        "schedule": crontab(minute="*"),
    },
    "compute_et0_vpd_hourly": {
        "task": "sensors.tasks.compute_et0_vpd_hourly",
        "schedule": crontab(minute='*/2'),   # previous full hour at :05
    },
    # "send-daily-email": {
    #     "task": "agriBack.tasks.send_periodic_notifications",
    #     "schedule": crontab(minute=0, hour=6),
    # },
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

