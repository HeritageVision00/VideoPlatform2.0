import cv2
import time
import MySQLdb
import os
from dotenv import load_dotenv
load_dotenv('../config.env')

USERNAME=os.environ.get('USERM')
PASSWORD=os.environ.get('PASSWORD')
HOST=os.environ.get('HOST')
DATABASE=os.environ.get('DB')

def check_camera_health(rtsp_url):

    # Set up camera connection and wait for it to be established
    cap = cv2.VideoCapture(rtsp_url)
    while not cap.isOpened():
        print("Failed to connect to camera, retrying...")
        cap = cv2.VideoCapture(rtsp_url)
        time.sleep(1)

    # Wait for camera to be stable
    time.sleep(5)
    status = ""
    # Check camera health status
    ret, frame = cap.read()
    if not ret:
        print("Failed to read frame from camera")
        status = "Failed"
    else:
        print("Camera connected and streaming")
        status = "Success"
        # Do additional camera health checks (e.g. brightness, sharpness, motion detection)
        # ...

    # Release resources and close windows
    cap.release()
    cv2.destroyAllWindows()
    return status

def check_all_cameras_health():
        # Update MySQL database with camera status
        try:
            cnx = MySQLdb.connect(user=USERNAME, password=PASSWORD,
                                          host=HOST,
                                          database=DATABASE)
            cursor = cnx.cursor()
            query = "SELECT id, rtsp_in FROM cameras"
            cursor.execute(query)
            cameras = cursor.fetchall()
            for camera in cameras:
                status = check_camera_health(camera[1])
                if status == "Success":
                    query = "UPDATE cameras SET health_status=true WHERE id=%s"
                else:
                    query = "UPDATE cameras SET health_status=false WHERE id=%s"
                camera_id = camera[0]
                cursor.execute(query, (camera_id,))
                cnx.commit()
            print("MySQL database updated with camera status")
        except MySQLdb.Error as err:
            print("Failed to update MySQL database: {}".format(err))
        finally:
            cursor.close()
            cnx.close()
# Call the function to update camera status
check_all_cameras_health()
