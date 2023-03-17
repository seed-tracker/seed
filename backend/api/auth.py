from flask import Flask, request
from app import app
from db import db
import bcrypt

@app.route('/auth/login', methods=['POST'])
def login():
    email = request.form.get('email')
    print(email)
    password = request.form.get('password')
    user = db.users.find_one({email: email, password: password})
    # password_checked = bcrypt.check_password_hash(password, user.password)
    # if password_checked == true:
    #     login_user(user)
        # return redirect('/home')
    return user
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
