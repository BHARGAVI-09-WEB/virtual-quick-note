
# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect(
    'notes.db',
    check_same_thread=False
)

cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note TEXT,
    date TEXT
)
''')

conn.commit()

# ADD NOTE
@app.route('/add', methods=['POST'])
def add_note():

    data = request.json

    note = data['note']

    date = datetime.now().strftime(
        "%d %b %Y, %I:%M %p"
    )

    cursor.execute(
        "INSERT INTO notes(note,date) VALUES(?,?)",
        (note,date)
    )

    conn.commit()

    return jsonify({
        "message":"Note added"
    })

# GET NOTES
@app.route('/notes', methods=['GET'])
def get_notes():

    cursor.execute(
        "SELECT * FROM notes"
    )

    rows = cursor.fetchall()

    notes = []

    for row in rows:

        notes.append({
            "id":row[0],
            "note":row[1],
            "date":row[2]
        })

    return jsonify(notes)

# DELETE NOTE
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_note(id):

    cursor.execute(
        "DELETE FROM notes WHERE id=?",
        (id,)
    )

    conn.commit()

    return jsonify({
        "message":"Deleted"
    })

# UPDATE NOTE
@app.route('/update/<int:id>', methods=['PUT'])
def update_note(id):

    data = request.json

    note = data['note']

    cursor.execute(
        "UPDATE notes SET note=? WHERE id=?",
        (note,id)
    )

    conn.commit()

    return jsonify({
        "message":"Updated"
    })

if __name__ == '__main__':
    app.run(debug=True)