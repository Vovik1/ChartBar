from app import create_app, db
from app.models import app_data

app = create_app('default')
Data = app_data(app, db)


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, Data=Data)
