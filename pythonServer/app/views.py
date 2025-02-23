from app import app
from flask import request
import json
import os
import MySQLdb
import cv2
import subprocess

PATHD = os.environ.get('resourcePath')
MYSQL_HOST = os.environ.get('HOST')
MYSQL_USER = os.environ.get('USERM')
MYSQL_PASSWORD = os.environ.get('PASSWORD')
MYSQL_DB = os.environ.get('DB')

@app.route('/api2/frame', methods=['POST'])
def frame():
   body = request.get_json(silent=True)
   pathIm = ('{}{}/{}/').format(PATHD,body['id_account'],body['id_branch'])
   ip = os.environ.get("my_ip")
   docker = os.environ.get("DOCKER")
   db = MySQLdb.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB)
   cursor = db.cursor()
   cursor.execute('select rtsp_in from cameras where id=\"{}\"'.format(body['cameraId']))

   path = cursor.fetchall()
   path = path[0][0]
   cap = cv2.VideoCapture(path)
   if cap.isOpened():
      ret,frame = cap.read()
      pathAc = ('{}{}/').format(PATHD,body['id_account'])
      if not os.path.exists(pathAc):
         os.mkdir(pathAc)
         os.mkdir(pathIm)
         os.mkdir(('{}heatmap_pics/').format(pathIm))
      cv2.imwrite('{}heatmap_pics/{}_heatmap.png'.format(pathIm,body['cameraId']),frame)
      height=int(cap.get(4))
      width=int(cap.get(3))

      cursor.execute('update cameras set pic_height = \"{}\" where id=\"{}\"'.format(height,body['cameraId']))
      if docker == 'True':
         cursor.execute('update cameras set heatmap_pic = "/api/pictures/{}/{}/heatmap_pics/{}_heatmap.png" where id=\"{}\"'.format(body['id_account'],body['id_branch'],body['cameraId'],body['cameraId']))
      else:
         cursor.execute('update cameras set heatmap_pic = "http://{}:3300/api/pictures/{}/{}/heatmap_pics/{}_heatmap.png" where id=\"{}\"'.format(ip,body['id_account'],body['id_branch'],body['cameraId'],body['cameraId']))
      cursor.execute('update cameras set pic_width = \"{}\" where id=\"{}\"'.format(width,body['cameraId']))
      cursor.execute('update cameras set cam_height = \"{}\" where id=\"{}\"'.format(height,body['cameraId']))
      cursor.execute('update cameras set cam_width = \"{}\" where id=\"{}\"'.format(width,body['cameraId']))
      db.commit()
      cursor.fetchall()
      res={ "success": True }
      json_object = json.dumps(res, indent = 4)
      return json_object
   else:
      res={ "success": False }
      json_object = json.dumps(res, indent = 4)
      return json_object

@app.route('/api2/screenshot', methods=['POST'])
def screenshot():
   body = request.get_json(silent=True)
   pathIm = ('{}{}/{}/').format(PATHD,body['id_account'],body['id_branch'])

   cap = cv2.VideoCapture(body['stream'])
   ret,frame = cap.read()
   pathAc = ('{}{}/').format(PATHD,body['id_account'])
   if not os.path.exists(pathAc):
      os.mkdir(pathAc)
      os.mkdir(pathIm)
      os.mkdir(('{}heatmap_pics/').format(pathIm))
   cv2.imwrite('{}heatmap_pics/{}_trigger.png'.format(pathIm,body['uuid']),frame)

   res={ "success": True, "data": body['uuid']}
   json_object = json.dumps(res, indent = 4)
   return json_object

@app.route('/api2/test', methods=['GET'])
def test():
   return 'Works'

@app.route('/api2/sum', methods=['POST'])
def sum():
   body = request.get_json(silent=True)
   run_script('/ultralytics/VS/ObjectOverlaySummarization.py', '--input', f'{body["path"]}/{body["name"]}', '--out_filename', f'{body["path"]}/output.mp4', '--dont_show', '--duration', f'{body["duration"]}')
   res={ "success": True, "path": f'{body["path"]}/output.mp4' }
   json_object = json.dumps(res, indent = 4)
   return json_object

def run_script(script_path, *args):
    # Construct the command with script and parameters
    command = ['python3', script_path] + list(args)
    # Run the command
    result = subprocess.run(command)

    # Check if the script ran successfully
    if result.returncode != 0:
        print("Error:", result.stderr)
    else:
        print("Output:", result.stdout)