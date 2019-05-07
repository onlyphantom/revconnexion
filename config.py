import os
import connexion
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

basedir = os.path.abspath(os.path.dirname(__file__))

# Create the connexion application instance. It also needs to know the
# path to our swagger.yml file
connex_app = connexion.App(__name__, specification_dir=basedir)
#

# Get the Flask instance initialized by Connexion
app = connex_app.app

# default user should be samuel@pedagogyapp.com
# with credentials: 'RevConnexion'

app.config["SQLALCHEMY_ECHO"] = True
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    basedir, "rcsample.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# create the SQLAlchemy db instance using the config above
db = SQLAlchemy(app)

# Initialize marshmallow
ma = Marshmallow(app)
