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
	s_goal = db.Column(db.Integer)
	s_progress = db.Column(db.Integer)
	history = db.relationship('History', backref='account_holder', lazy=True)

	def __init__(self, fullname, country, username, password, s_goal, s_progress):
		self.fullname = fullname
		self.country = country
		self.username = username
		self.password = password
		self.s_goal = s_goal
		self.s_progress = s_progress

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

@app.route("/", methods=['POST', 'GET'])
def home():
	money_amount = 1
	if request.method == 'POST':
		money_amount = request.form['money_amount']
	return render_template('index.html', cash = money_amount)

@app.route("/login", methods=['POST', 'GET'])
def login():
	if request.method == 'POST':
		user = request.form["username"]
		pwd = request.form["password"]
		found_user = Users.query.filter_by(username=user).first()
		if found_user and pwd == found_user.password:
			session['username'] = user
			return redirect(url_for('account_page', usrname=user, amt=0))
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
		usr = Users(fullname=fullname, country=country, username=user, password=pwd, s_goal=1, s_progress=0)
		db.session.add(usr)
		db.session.commit()
		return redirect(url_for('login'))
	else:
		return render_template('signup.html')

@app.route("/<usrname>/<amt>", methods=['POST', 'GET'])
def account_page(usrname, amt=0):
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
		return render_template('account_page.html', cash=amount)
	else:
		if usrname in session['username']:
			amount = 1
			return render_template('account_page.html', amt=amt, cash=amount)
		else:
			flash('You are not logged in', 'error')
			return redirect(url_for('login'))

@app.route("/history_<usrname>")
def history(usrname):
	user = Users.query.filter_by(username=usrname).first()
	hist = History.query.filter_by(user_id=user.id)
	return render_template('history.html', hist=hist)

@app.route("/<usrname>_goal")
def goal(usrname):
	var_goal = Users.query.filter_by(username=usrname).first().s_goal
	var_progress = Users.query.filter_by(username=usrname).first().s_progress
	var_percent = format((var_progress / var_goal) * 100, ".2f")
	return render_template('goal.html', var_goal=var_goal, var_progress=var_progress, var_percent=var_percent)

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


@app.route('/api/goals/<action>/<usrname>/<money>', methods=('GET', 'POST'))
def APIgoals(action=0, usrname=0, money=0):
	if action == 'update_goal':
		# print(usrname, action, money)
		found_user = Users.query.filter_by(username=usrname).first()
		if found_user:
			found_user.s_goal = int(money)
			db.session.commit()
	if action == 'update_progress':
		# print(usrname, action, money)
		found_user = Users.query.filter_by(username=usrname).first()
		if found_user:
			found_user.s_progress = found_user.s_progress + int(money)
			db.session.commit()

	return "dummy text so the server doesn't have a fit"


if __name__ == '__main__':
	db.create_all()
	app.run(debug=True)