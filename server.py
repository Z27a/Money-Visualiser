from flask import Flask, redirect, url_for, render_template, request, session, flash
# import csv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'key'
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///site.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Users(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	fullname = db.Column(db.String(50))
	country = db.Column(db.String(50))
	username = db.Column(db.String(100), unique=True, nullable=False)
	password = db.Column(db.String(100))
	history = db.relationship('History', backref='account_holder', lazy=True)

	def __init__(self, fullname, country, username, password):
		self.fullname = fullname
		self.country = country
		self.username = username
		self.password = password

class History(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(30), default='Untitled')
	date = db.Column(db.DateTime, nullable=False, default=datetime.now().replace(microsecond=0))
	_object = db.Column(db.String(50))
	amount = db.Column(db.Integer)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

	# def __init__(self, _object, amount):
	# 	self._object = _object
	# 	self.amount = amount
	def __repr__(self):
		return f"History('{self.title}', '{self.date}', '{self._object}', '{self.amount}')"

@app.route("/")
def home():
	return render_template('index.html')

@app.route("/login", methods=['POST', 'GET'])
def login():
	if request.method == 'POST':
		user = request.form["username"]
		pwd = request.form["password"]
		found_user = Users.query.filter_by(username=user).first()
		if found_user and pwd == found_user.password:
			session['username'] = user
			return redirect(url_for('account_page', usrname=user))
		else:
			flash('Incorrect username or password', 'error')
			return render_template('login.html')
	else: 
		return render_template('login.html')

@app.route("/signup", methods=['POST', 'GET'])
def signup():
	if request.method == 'POST':
		fullname = request.form["fullname"]
		country = request.form["country"]
		user = request.form["username"]
		pwd = request.form["password"]
		usr = Users(fullname=fullname, country=country, username=user, password=pwd)
		db.session.add(usr)
		db.session.commit()
		return redirect(url_for('login'))
	else:
		return render_template('signup.html')

@app.route("/<usrname>", methods=['POST', 'GET'])
def account_page(usrname):
	if request.method == 'POST':
		user = usrname
		if request.form["title"]:
			title = request.form["title"]
		else:
			title = 'Untitled'
		obj = request.form["object"]
		amount = request.form["money_amount"]
		save1 = History(title=title, _object=obj, amount=amount, account_holder=Users.query.filter_by(username=usrname).first())
		db.session.add(save1)
		db.session.commit()
		return render_template('account_page.html')
	else:
		if usrname in session['username']:
			return render_template('account_page.html')
		else:
			flash('You are not logged in', 'error')
			return redirect(url_for('login'))

@app.route("/history_<usrname>")
def history(usrname):
	user = Users.query.filter_by(username=usrname).first()
	hist = History.query.filter_by(user_id=user.id)
	return render_template('history.html', hist=hist)


@app.route("/logout_<usrname>")
def logout(usrname):
	session.pop('username', None)
	return redirect(url_for('login'))



@app.route("/view_users")
def view_users():
	return render_template("view.html", values=Users.query.all())

@app.route("/view_history")
def view_history():
	return render_template("view_history.html", values=History.query.all())




if __name__ == '__main__':
	db.create_all()
	app.run(debug=True)