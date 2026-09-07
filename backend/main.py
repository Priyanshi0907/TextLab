import os
import sys

# Add backend/app to sys.path so submodules (db, ml, routers) are resolved properly
app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app")
if app_dir not in sys.path:
    sys.path.insert(0, app_dir)

from app.main import app  # noqa: F401, E402
