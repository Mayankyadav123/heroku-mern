# heroku-mern
#
# Run MERN app out of the box with minimal setup
# MUST HAVE heroku-cli installed and a CREDIT CARD on file with heroku to create a MongoDB (MongoLab - FREE)
# Heroku uses a Credit Card as a form of validation
heroku login #(enter your username/password)
git clone https://github.com/tarvold/heroku-mern.git your-app-name
cd your-app-name
git init
heroku create name-of-your-app
heroku addons:create mongolab
git push heroku master
