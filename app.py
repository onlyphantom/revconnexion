from flask import Flask, render_template
import connexion

# create the application instance
app = connexion.App(__name__, specification_dir="./")

# read the swagger.yml file to configure endpoints
app.add_api("swagger.yml")


@app.route("/")
def home():
    """
    This function just responds to localhost:5000/

    :return: the rendered template 'home.html'
    """
    return render_template("home.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

