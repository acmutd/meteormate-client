# Created by Ryan Polasky | 7/12/25
# ACM MeteorMate | All Rights Reserved

import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)

sys.path.append(project_root)

backend_dir = os.path.join(project_root, 'backend')
sys.path.append(backend_dir)

from backend.app import app
