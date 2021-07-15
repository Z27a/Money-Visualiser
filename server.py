from flask import Flask, redirect, url_for, render_template, request, session, flash
# import csv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlite3
import time

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
    #   self._object = _object
    #   self.amount = amount
    def __repr__(self):
        return f"History('{self.title}', '{self.date}', '{self._object}', '{self.amount}')"


def getGraphData():
    # disconnect any previous connections
    conn = None
    # connect to db
    try:
        conn = sqlite3.connect('site.db')
    # print exception if there is one
    except Exception as e:
        print(e)
    # return connection
    cur = conn.cursor()
    sql = f"SELECT date, amount FROM history ORDER BY date desc LIMIT 5"
    results = cur.execute(sql).fetchall()
    dates = [int(time.mktime(time.strptime(i[0].split('.', 1)[0], '%Y-%m-%d %H:%M:%S'))) for i in results][::-1]
    amounts = [i[1] for i in results][::-1]
    # disconnect again
    conn = None
    return dates, amounts



@app.route("/", methods=['POST', 'GET'])
def home():
	money_amount = 0
	container = 0
	if request.method == 'POST':
		try:
			money_amount = request.form['money_amount']
		except:
			money_amount = 0
		container = request.form['object']

	return render_template('index.html', cash = money_amount, container = container)

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
        # go = request.form.get('go_btn')
        save = request.form.get('save_btn')
        
        user = usrname
        if request.form["title"]:
            title = request.form["title"]
        else:
            title = 'Untitled'
        obj = request.form["object"]
        amount = request.form["money_amount"]
        if save is not None:
            save1 = History(title=title, _object=obj, amount=amount, account_holder=Users.query.filter_by(username=usrname).first())
            db.session.add(save1)
            db.session.commit()
        graphData = getGraphData()
        dates = graphData[0]
        amounts = graphData[1]
        return render_template('account_page.html', cash=amount, dates=dates, amounts=amounts, container=obj)
    else:
        if usrname in session['username']:
            amount = 0
            obj = 0
            graphData = getGraphData()
            dates = graphData[0]
            amounts = graphData[1]
            return render_template('account_page.html', amt=amt, cash=amount, dates=dates, amounts=amounts, container=obj)
        else:
            flash('You are not logged in', 'error')
            return redirect(url_for('login'))

@app.route("/history_<usrname>")
def history(usrname):
    user = Users.query.filter_by(username=usrname).first()
    hist = History.query.filter_by(user_id=user.id)
    graphData = getGraphData()
    dates = graphData[0]
    amounts=graphData[1]
    return render_template('history.html', hist=hist, dates=dates, amounts=amounts)

@app.route("/<usrname>_goal", methods=['GET', 'POST'])
def goal(usrname):
    money_amount = 0
    container = 0
    if request.method == 'POST':
        money_amount = Users.query.filter_by(username=usrname).first().s_progress
        container = request.form["object"]
    
    var_goal = Users.query.filter_by(username=usrname).first().s_goal
    var_progress = Users.query.filter_by(username=usrname).first().s_progress
    var_percent = format((var_progress / var_goal) * 100, ".2f")
    return render_template('goal.html', var_goal=var_goal, var_progress=var_progress, var_percent=var_percent, cash=money_amount, container=container)

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
    if action == 'reset':
        # print(usrname, action, money)
        found_user = Users.query.filter_by(username=usrname).first()
        if found_user:
            found_user.s_progress = 0
            found_user.s_goal = 1
            db.session.commit()

    return "dummy text so the server doesn't have a fit"

@app.route('/about_us')
def about_us():
    return render_template("about_us_out.html")

@app.route('/about_us/<usrname>')
def about_us1(usrname):
    return render_template("about_us_in.html")



if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)