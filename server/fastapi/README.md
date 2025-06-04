# Set up back-end

b1: cd ./fastapi

b2: python -m venv .venv

b3: .venv\Scripts\Activate.ps1

b4: python -m pip install --upgrade pip

b5: pip install -r requirements.txt

# run server

fastapi dev main.py

# Save lib into requirement.txt

pip freeze > requirements.txt
