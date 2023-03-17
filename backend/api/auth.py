from flask import Flask
import db from db
from app import app
import bcrypt

@app.route('/auth')
def signup():
  return "Signup"

@app.route('/auth/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    user = db.users.find_one_or_404({"email": email, "password": password})
    # password_checked = bcrypt.check_password_hash(password, user.password)
    # if password_checked == true:
    #     login_user(user)
        # return redirect('/home')
    return "confirmed"
    # else:
    #     print('MPASS_WORG')


# @app.route('/auth/register', methods=['POST'])
# def register():
#     if request.method == "POST":
#         email = request.form.get('email')
#         fname = request.form.get('fname')
#         password = request.form.get('password')
#         pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
#         new_user = User(email=email, fname=fname,
#                         password=pw_hash, lname=lname)
#         try:
#             db.session.add(new_user)
#             db.session.commit()
#             return redirect('/home')
#         except:
#             print('ERREUR')
#     return render_template('register.html')
