import os

dirs = ['static_files', 'media', 'static', 'templates']
for dir_name in dirs:
    os.makedirs(dir_name, exist_ok=True)
