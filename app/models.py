from sqlalchemy.ext.automap import automap_base


def app_data(app, db):
    with app.app_context():
        Base = automap_base()
        Base.prepare(db.engine, reflect=True)
        Data = Base.classes.data
        return Data


