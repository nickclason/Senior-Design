if exist backend\venv\ (

    echo "backend\venv already exists..." 
) else (
    echo "backend\venv does not exist, creating new virtual environment..."
    "C:\Users\jkten\AppData\Local\Programs\Python\Python39\python.exe" -m venv backend\venv
)

backend\venv\Scripts\pip install  --no-cache-dir -r backend\requirements.txt 
backend\venv\Scripts\python backend\run.py