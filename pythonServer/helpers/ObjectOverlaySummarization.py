from ctypes import *
import random
import os
import cv2
import time
import argparse
from queue import Queue
from threading import Thread
import multiprocessing
import numpy as np
import datetime
from ultralytics import YOLO

def parser():
    parser = argparse.ArgumentParser(description="YOLO Object Detection")
    parser.add_argument("--input", type=str, default='input_YT.mp4',
                        help="video source. If empty, uses webcam 0 stream")
    parser.add_argument("--timestamp", type=str, default='',
                        help="Start time of recording - Format be HH:MM:SS")
    parser.add_argument("--duration", type=str, default=600,
                        help="Duration of the summarized video. Default to be 900 frames (30s @ 30 FPS)")
    parser.add_argument("--out_filename", type=str, default="out15.mp4",
                        help="inference video name. Not saved if empty")
    parser.add_argument("--weights", default="/usr/src/app/helpers/yolov8n-seg.engine",
                        help="yolo weights path")
    parser.add_argument("--dont_show",default="--dont_show", action='store_true',
                        help="window inference display. For headless systems")
    parser.add_argument("--ext_output", action='store_true',
                        help="display bbox coordinates of detected objects")
    parser.add_argument("--thresh", type=float, default=.25,
                        help="remove detections with confidence below this value")
    return parser.parse_args()

def str2int(video_path):
    try:
        return int(video_path)
    except ValueError:
        return video_path

def check_arguments_errors(args):
    assert 0 < args.thresh < 1, "Threshold should be a float between zero and one (non-inclusive)"
    if not os.path.exists(args.weights):
        raise(ValueError("Invalid weight path {}".format(os.path.abspath(args.weights))))
    if str2int(args.input) == str and not os.path.exists(args.input):
        raise(ValueError("Invalid video path {}".format(os.path.abspath(args.input))))

def set_saved_video(input_video, output_video, size):
    fourcc = cv2.VideoWriter_fourcc(*"MJPG") #'XVID' for smaller size output video
    fps = int(input_video.get(cv2.CAP_PROP_FPS)) # hardcode the fps of output video
    video = cv2.VideoWriter(output_video, fourcc, fps, size)
    return video

def convert2relative(bbox):
    x, y, w, h  = bbox
    _height     = darknet_height
    _width      = darknet_width
    return x/_width, y/_height, w/_width, h/_height

def convert2original(image, bbox):
    x, y, w, h = convert2relative(bbox)
    image_h, image_w, __ = image.shape
    orig_x       = int(x * image_w)
    orig_y       = int(y * image_h)
    orig_width   = int(w * image_w)
    orig_height  = int(h * image_h)
    bbox_converted = (orig_x, orig_y, orig_width, orig_height)
    return bbox_converted

def convert4cropping(image, bbox):
    x, y, w, h = convert2relative(bbox)
    image_h, image_w, __ = image.shape
    orig_left    = int((x - w / 2.) * image_w)
    orig_right   = int((x + w / 2.) * image_w)
    orig_top     = int((y - h / 2.) * image_h)
    orig_bottom  = int((y + h / 2.) * image_h)
    if (orig_left < 0): orig_left = 0
    if (orig_right > image_w - 1): orig_right = image_w - 1
    if (orig_top < 0): orig_top = 0
    if (orig_bottom > image_h - 1): orig_bottom = image_h - 1
    bbox_cropping = (orig_left, orig_top, orig_right, orig_bottom)
    return bbox_cropping

def yolo8(model, filter_, frame_id, buffer_size):
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_time = frame_to_time_converter(frame_id)
        frame_id = frame_id + 1
        if frame_id > buffer_size:
            break
        frame = cv2.resize(frame, (1280, 720))
        prev_time = time.time()
        detections = model(frame, stream=True, verbose=False)
        detection_filtered = []
        for detection in detections: 
            for box in detection.boxes.cpu().numpy():
                if box.cls in filter_:
                    detection_filtered.append([box.cls, box.conf, box.xyxy[0]])
        fps = int(1/(time.time() - prev_time))
        detections_adjusted = []
        if frame is not None:
            for label, confidence, bbox in detection_filtered:
                detections_adjusted.append((str(label), confidence, bbox))
                left, top, right, bottom = bbox.astype(int)
                cv2.putText(frame, "{}".format(frame_time), (int((left+right)/2), int((top+bottom)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 2)
            buffer_queue.append(frame)
            if not args.dont_show:
                cv2.imshow('Inference', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
    cap.release()

def blend_transparent(frame, overlay):
    alpha = 0.7
    overlay_img = overlay[:, :, :3]
    overlay_mask = overlay[:, :, 3:]
    overlay_mask = overlay_mask / 255.0
    for c in range(0, 3):
        frame[:, :, c] = frame[:, :, c] * (1 - alpha * overlay_mask[:, :, 0]) + overlay_img[:, :, c] * (alpha * overlay_mask[:, :, 0])
    return frame

def yolo_multiprocess(model, filter_, frame_id, start_frame, input_path):
    frame_id = 0
    while cap_subprocess.isOpened():
        ret, frame = cap_subprocess.read()
        if not ret:
            break
        frame_time = frame_to_time_converter(start_frame + frame_id)
        frame_id = frame_id + 1
        if frame_id > buffer_size:
            break
        frame = cv2.resize(frame, (1280, 720))
        prev_time = time.time()
        detections = model(frame, stream=True,  verbose=False)
        detection_filtered = []
        for detection in detections:
            for box in detection.boxes.cpu().numpy():
                if box.cls in filter_:
                    detection_filtered.append([box.cls, box.conf, box.xyxy[0]])
        fps = int(1/(time.time() - prev_time))
        print("FPS: {}".format(fps))
        detections_adjusted = []
        if frame is not None:
            background = buffer_queue[frame_id-1]
            mask = np.zeros((720, 1280), dtype=np.uint8)
            for label, confidence, bbox in detection_filtered:
                detections_adjusted.append((str(label), confidence, bbox))
                left, top, right, bottom =bbox.astype(int)
                cv2.rectangle(mask, (left,top), (right, bottom), 255, -1)
                cv2.putText(mask, "{}".format(frame_time), (int((left+right)/2), int((top+bottom)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 255, 2)
            overlay = np.zeros((720, 1280, 4), dtype=np.uint8)
            overlay[:,:,0:3] = frame
            overlay[:, :, 3] = mask
            for label, confidence, bbox in detections_adjusted:
                left, top, right, bottom = bbox.astype(int)
                cv2.putText(overlay, "{}".format(frame_time), (int((left+right)/2), int((top+bottom)/2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0, 255), 2)
            background = blend_transparent(background, overlay)
            buffer_queue[frame_id-1] = background
            if not args.dont_show:
                cv2.imshow('Inference', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
    cap.release()

def frame_to_time_converter(frame_id):
    time_change = datetime.timedelta(seconds=(frame_id / video_fps))
    total_seconds = time_change.total_seconds()
    minutes, seconds = divmod(total_seconds, 60)
    video_time = "{:02}:{:02}".format(int(minutes), int(seconds))
    return video_time

if __name__ == '__main__':
    args = parser()
    check_arguments_errors(args)
    
    model = YOLO(args.weights, task="segment")
    input_path = str2int(args.input)
    cap = cv2.VideoCapture(input_path)
    video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print("video_length", video_length)
    filter_ = [0, 2] 

    if str(args.duration).isnumeric() == False:
        raise ValueError('The duration of summary has to be numeric. Please enter again.')
    buffer_size = int(args.duration)
    print('====================== videolength: {}, duration: {} ======================'.format(video_length, buffer_size))
    if video_length < buffer_size:
        buffer_size = video_length - 1

    fps_skipping_rate = 30
    if args.timestamp != '':
        if len(args.timestamp) != 8:
            raise ValueError('The format of timestamp has to be HH:MM:SS. Please enter again.')
        timestamp_user = args.timestamp.split(":")
        for hands in timestamp_user:
            if hands.isnumeric() == False:
                raise ValueError('The format of timestamp has to be HH:MM:SS. Please enter again.')
        video_start = datetime.datetime(2020, 9, 4, int(timestamp_user[0]), int(timestamp_user[1]), int(timestamp_user[2]))
        print(video_start)
    else:
        video_start = datetime.datetime(2020, 9, 4, 11, 59, 30)
    video_fps = int(cap.get(cv2.CAP_PROP_FPS))
    number_of_processes = int(video_length / buffer_size)
    print("number_of_processes", number_of_processes)
    buffer_queue = []
    frame_id = 0
    yolo8(model, filter_, frame_id, buffer_size)

    for i in range(1, number_of_processes+1):
        start_frame = buffer_size * i
        cap_subprocess = cv2.VideoCapture(input_path)
        cap_subprocess.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
        yolo_multiprocess(model, filter_, frame_id, start_frame, input_path)
        progress = str(i / number_of_processes)
        print("progress", progress, " - ", start_frame)
    save = True
    if save == True:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(args.out_filename, fourcc, 30.0, (1280,720))
        for image in buffer_queue:
            out.write(image)
        out.release()
