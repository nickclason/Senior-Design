#!/bin/sh

if [ -d "backend/venv" ] 
then
    echo "backend/venv already exists..." 
else
    echo "backend/venv does not exist, creating new virtual environment..."
    python -m venv backend/venv
fi

backend/venv/bin/pip install  --no-cache-dir -r backend/requirements.txt 
backend/venv/bin/python backend/run.py