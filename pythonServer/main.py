from app import app
import os
from dotenv import load_dotenv
load_dotenv('../config.env')
import logging
from logging.handlers import RotatingFileHandler
from time import strftime
from flask import request,jsonify
import traceback

MODE = os.environ.get('NODE_ENV')
log = ('{}/logs/pythonAccess.log').format(os.environ.get('resourcePath'))

@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    logger.info('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response

@app.errorhandler(Exception)
def handle_exception(e):
    # Get the traceback as a string
    trace = traceback.format_exc()
    # Log the trace for debugging
    print(trace)
    # Optionally, during development, include the traceback in the response for debugging
    response = {
        "error": str(e),
        "traceback": trace
    }
    return jsonify(response), 500

if __name__=='__main__':
    if MODE == 'production':
        print('Running in production')
        handler = RotatingFileHandler(log, maxBytes=100000, backupCount=3)
        logger = logging.getLogger('tdm')
        logger.setLevel(logging.INFO)
        logger.addHandler(handler)
        from waitress import serve
        serve(app, host="0.0.0.0", port=os.environ.get('PORTPYTHON'))
    else:
        print('Running in development')
        handler = RotatingFileHandler(log, maxBytes=100000, backupCount=3)
        logger = logging.getLogger('tdm')
        logger.setLevel(logging.INFO)
        logger.addHandler(handler)
        app.run(host='0.0.0.0', debug=True, port=os.environ.get('PORTPYTHON'))