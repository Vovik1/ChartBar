from flask import jsonify,  current_app
from .. import db
from ..models import app_data
from . import api


@api.route('/data/')
def get_data():
    data = app_data(current_app, db)

    time_dict = {}
    time1 = range(0, 21, 5)
    time2 = range(5, 21, 5)
    for timestamp in list(zip(time1, time2)):
        count_entity = {}
        for entity in list('abcdef'):
            count_entity[entity] = db.session.query(data). \
                filter(data.value.between(timestamp[0], timestamp[1])). \
                filter(data.entity == entity).count()

        time_dict[timestamp[0]] = count_entity

    response = jsonify(time_dict)

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
