# Expense_mgmt
Admin page for Expense management.

### Software Requirments

    Python 3
    Postgresql 9.5


### Clone Repo

    # git clone https://github.com/Jagrut/Expense_mgmt.git


### Python Virtual Environment

1. Create Python virtual environment

        $ virtualenv <name-of-folder>

2. Activate virtual environment

        $ source <path-to-folder>/bin/activate

3. Deactivate virtual environment

        $ deactivate


### Install requirements

* Install python project dependencies for dev environment


        $ pip install -r requirements.txt

### Project Setup
* Open the settings.py file and edit the postgres details as per your setup
* Make sure expense_db is created in Postgresql
* Run Migrations in django by following commands Which will create db tables

        $ python manage.py makemigrations expense_management
        $ python manage.py migrate expense_management

* Run Fixtures in django by following commands Which will populate expense_status table

        $ python manage.py loaddata expense_status.json

* To generate random expense run below command several times.

        $ curl -X POST http://localhost:8000/api/v1/expense

* Command to run the Project

        $ python manage.py runserver

* Now just point your browser to http://localhost:8000/api/v1/home.
