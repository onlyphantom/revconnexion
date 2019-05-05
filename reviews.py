# System modules
from datetime import datetime

# 3rd party modules
from flask import make_response, abort


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


# data to serve with our API
REVIEWS = {
    1: {
        "id": 1,
        "workshop_id": 1,
        "text": "Incredible teaching!",
        "timestamp": get_timestamp(),
    },
    2: {
        "id": 2,
        "workshop_id": 2,
        "text": "Entertaining.",
        "timestamp": get_timestamp(),
    },
    3: {
        "id": 3,
        "workshop_id": 3,
        "text": "Learning is fun.",
        "timestamp": get_timestamp(),
    },
    4: {
        "id": 4,
        "workshop_id": 2,
        "text": "Most Fascinating.",
        "timestamp": get_timestamp(),
    },
}


def read_all():
    """
    This function responds to a request for /api/reviews
    with the complete lists of people
    """
    return [REVIEWS[key] for key in sorted(REVIEWS.keys())]


def read_one(id):
    """
    This function responds to a request for api/reviews/{id}
    with one matching review from reviews

    :param id:  id of the review
    :return:    review matching the id
    """
    if id in REVIEWS:
        # review = REVIEWS[id]
        review = REVIEWS.get(id)
    else:
        abort(404, f"The review id {id} not found")
    return review


def create(review):
    """
    This function creates a new review in the reviews structure
    :param review:  review to create in reviews
    :return:        201 on success, 406 on review exists
    """
    id = review.get("id", None)
    workshop_id = review.get("workshop_id", None)
    text = review.get("text", None)

    if id not in REVIEWS and id is not None:
        REVIEWS[id] = {
            "id": id,
            "workshop_id": workshop_id,
            "text": text,
            "timestamp": get_timestamp(),
        }
        # return make_response(f"{id} successfully added to reviews", 201)
        return REVIEWS[id], 201

    else:
        abort(406, f"Review with {id} already exists")


def update(id, review):
    """
    This function updates an existing review

    :param id:      id of review to update
    :param review:  review to update
    :return:        updated review
    """
    if id in REVIEWS:
        REVIEWS[id]["workshop_id"] = review.get("workshop_id")
        REVIEWS[id]["text"] = review.get("text")
        REVIEWS[id]["timestamp"] = get_timestamp()
        return REVIEWS[id]

    else:
        abort(404, f"Review with {id} not found.")


def delete(id):
    """
    This function deletes an existing review

    :param id:  id of review to delete
    :return:    200 on successful delete, 404 otherwise
    """
    if id in REVIEWS:
        del REVIEWS[id]
        return make_response(f"Review {id} deleted", 200)

    else:
        abort(404, f"Review {id} not found")
