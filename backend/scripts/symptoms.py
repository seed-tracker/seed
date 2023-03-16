import sys
sys.path.insert(0,"..")
from db import db

symptoms = db.symptoms
symptoms.insert_many([{"name": "Fatigue"}, {"name": "Dizziness"}, {"name": "Headache"}, {"name": "Itchiness"}, {"name": "Swelling"}, {"name": "Dermatitis"}, {"name": "Abdominal Pain"}, {"name": "Nausea"}, {"name": "Indigestion"}, {"name": "Constipation"}])
