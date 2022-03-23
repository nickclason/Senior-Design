# CS5001 Senior Design

Welcome to the the repository for our Senior Design Project

## SCK Finance

# How to Run
```
After pulling the repository in src/backend/app
you must create a file "env.py" and supply the following API keys:

ALPACA_API_KEY='api_key'
ALPACA_SECRET_KEY='api_key'
ALPHA_VANTAGE_API_KEY='api_key'

cd src

# Windows
start\windows\start.bat

# MacOS/Linux
# In two separate terminals...
./start_backend.sh     # in Terminal 1
./start_frontend.sh    # in Terminal 2
```

### Development Instructions
* To add any new python packages you must do the following
  * Be in the virtual environment ("source venv/bin/activate (Mac/Linux), ".\venv\Scripts\activate" (Windows))
  * pip install <package_name>     # Install the new package
  * pip freeze > requirements.txt  # Update requirements
  * deactivate                     # To exit the virtual environmetn

* Frontend adding packages
  * Add package to package.json


### Project Progress
Weekly status updates on the current state of the projecct can be found [here](Assignments/ProjectStatus.md).
