from datetime import datetime
from flask import make_response, abort
from config import db
from models import Response, ResponseSchema


# data to serve with our API
REVIEWS = {
    1: {"id": 1, "workshop_id": 1, "text": "Incredible teaching!"},
    2: {"id": 2, "workshop_id": 2, "text": "Entertaining."},
    3: {"id": 3, "workshop_id": 3, "text": "Learning is fun."},
    4: {"id": 4, "workshop_id": 2, "text": "Most Fascinating."},
}


def read_sql(workshop_id=False, length=False, offset=False):
    """
    This function responds to a request for api/reviews/
    with matching review given a list of optional parameters

    :param workshop_id: [optional] id of the workshop being referenced, int
    :param length:      [optional] number of reviews to return, int
    :param offset:      [optional] number of reviews to offset by, int
    :return:            all matching reviews
    """
    response = Response.query
    if workshop_id:
        response = response.filter_by(workshop_id=workshop_id)

    response = response.order_by(Response.id.desc())

    if length:
        response = response.limit(length)

    if offset:
        response = response.offset(offset)

    response = response.all()
    if len(response):
        # serialize the data for the response
        response_schema = ResponseSchema(many=True)
        return response_schema.dump(response).data
    else:
        abort(404, f"Workshop {workshop_id} doesn't exist or it doesn't have reviews.")


def read_sql_one(id):
    """
    This function responds to a request for api/reviews/{id}
    with one matching review from reviews

    :param id:  id of the review
    :return:    review matching the id
    """
    response = Response.query.filter_by(id=id).one_or_none()
    if response is not None:
        # serialize the data for the response
        response_schema = ResponseSchema()
        return response_schema.dump(response).data
    else:
        abort(404, f"Review {id} not found.")


def create_sql(review):
    """
    This function creates a Response object instance
    :param review:  review used to create the Response object instance
    :return:        201 on success, 406 on review exists
    """
    id = review.get("id", None)
    response = Response.query.filter_by(id=id).one_or_none()
    if response is None:
        # Create a response instance using the schema and the passed in review
        response_schema = ResponseSchema()
        created_response = response_schema.load(review, session=db.session).data
        # add response to database
        db.session.add(created_response)
        db.session.commit()
        # serialize and return the newly created response
        return response_schema.dump(created_response).data, 201

    else:
        abort(406, f"Review {id} already exists")


def update(id, review):
    """
    This function updates an existing Response object instance

    :param id:      id of the review
    :param review:  review used to create the Response object instance
    :return:        updated review
    """
    response = Response.query.filter_by(id=id).one_or_none()
    if response is not None:
        response_schema = ResponseSchema()
        update = response_schema.load(review, session=db.session).data
        update.id = response.id
        # add response to database
        db.session.merge(update)
        db.session.commit()
        # serialize and return the newly created response
        return response_schema.dump(update).data, 201
    else:
        abort(404, f"Review {id} not found.")


def delete(id):
    """
    This function deletes an existing review

    :param id:  id of review to delete
    :return:    200 on successful delete, 404 otherwise
    """
    response = Response.query.filter_by(id=id).one_or_none()
    if response is not None:
        db.session.delete(response)
        db.session.commit()
        return make_response(f"Review {id} deleted", 200)
    else:
        abort(404, f"Review {id} not found")
