# CS5001 Senior Design

Welcome to the the repository for our Senior Design Project

## SCK Finance

# How to Run
```
cd src

# Windows
start\windows\start.bat

# MacOS/Linux
# In two separate terminals...
./start_backend.sh     # in Terminal 1
./start_frontend.sh    # in Terminal 2
```

### Steps to Run with Docker:
##### Requirements:
* [Docker](https://www.docker.com/get-started)
* Docker Compose
  * Docker Desktop for Windows/Mac includes Docker Compose
```
cd src/frontend
npm install

cd .. (/src)
docker-compose build
docker-compose up
```


### Development Instructions
* To add any new python packages you must do the following
  * Be in the virtual environment ("source venv/bin/activate (Mac/Linux), ".\venv\Scripts\activate" (Windows))
  * pip install <package_name>     # Install the new package
  * pip freeze > requirements.txt  # Update requirements
  * deactivate                     # To exit the virtual environmetn



### Project Progress
Weekly status updates on the current state of the projecct can be found [here](Assignments/ProjectStatus.md).