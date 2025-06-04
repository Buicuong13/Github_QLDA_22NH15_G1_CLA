from fastapi import Query,FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from threading import Lock
import face_recognition
import cv2
import os
import numpy as np
import math
import sys
import asyncio
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hoặc thay "*" bằng danh sách domain cụ thể như ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
current_dir = os.path.dirname(os.path.abspath(__file__))
cascade_path = os.path.join(current_dir, 'haarcascade_frontalface_default.xml')

cam = None
camera_lock = Lock()
face_detector = cv2.CascadeClassifier(cascade_path)
capture_active = False
capture_done = False  # Thêm biến báo đã chụp đủ 30 ảnh

async def generate_frames(face_id: str):
    global cam, capture_active, capture_done

    dataset_dir = f"dataset/detect_face/{face_id}"
    if not os.path.exists(dataset_dir):
        os.makedirs(dataset_dir)

    count = 0
    capture_done = False

    while capture_active: 
        with camera_lock:
            success, frame = cam.read()

        if not success:
            break

        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) 
        faces = face_detector.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

            if count < 30:
                face_crop = gray[y:y+h, x:x+w]
                count += 1
                cv2.imwrite(f"{dataset_dir}/{face_id}_{count}.jpg", face_crop)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        await asyncio.sleep(0.05)

        # Nếu đủ 30 ảnh thì tự động stop
        if count >= 30:
            capture_active = False
            capture_done = True
            break

    # Sau khi stop, tự động release camera
    with camera_lock:
        if cam is not None:
            cam.release()
            cam = None

@app.get("/get_face")
async def detect_face(face_id: str = Query(..., description="ID của người cần chụp")):
    global cam, capture_active, capture_done
    with camera_lock:
        if cam is None:
            cam = cv2.VideoCapture(0)
            cam.set(3, 640)
            cam.set(4, 480)
        capture_active = True

    # Trả ra StreamingResponse
    response = StreamingResponse(generate_frames(face_id), media_type="multipart/x-mixed-replace; boundary=frame")

    return response

@app.get("/stop_get_face")
async def stop_get_face():
    global capture_active, cam
    capture_active = False
    with camera_lock:
        if cam is not None:
            cam.release()
            cam = None
    return {"message": "Camera capture stopped."}

# ------------------------------------ Recognize Face ------------------------------------

def face_cofidence(face_distance, face_match_threshold=0.6):
    range = (1.0 - face_match_threshold)
    linear_value = (1.0 - face_distance) / (range * 2.0)

    if face_distance > face_match_threshold:
        return str(round(linear_value * 100, 2)) + "%"
    else:
        value = (linear_value+((1.0 - linear_value) * math.pow((linear_value - 0.5)*2, 0.2)))*100
        return str(round(value, 2)) + "%"

class FaceRecognition:
    face_locations = []
    face_encodings = []
    face_names = []
    known_face_encodings = []
    known_face_names = []
    process_current_frame = True 

    def __init__(self, face_id: str):
        self.face_id = face_id
        self.encode_faces()
        # encode faces  
    
    def encode_faces(self):  
        for image in os.listdir(f'dataset/detect_face/{self.face_id}'):
            face_image = face_recognition.load_image_file(f'dataset/detect_face/{self.face_id}/{image}')
            print("face_image", face_image)
            face_encoding = face_recognition.face_encodings(face_image)[0]
            self.known_face_encodings.append(face_encoding)
            self.known_face_names.append(image)
        print(self.known_face_names)
    def generate_frames(self):
        self.video_capture = cv2.VideoCapture(0)
        self.running = True

        if not self.video_capture.isOpened():
            sys.exit('Video source not found...')

        while self.running:  # <-- dùng self.running thay vì while True
            success, frame = self.video_capture.read()
            if not success:
                break

            if self.process_current_frame:
                small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                rgb_small_frame = small_frame[:, :, ::-1]

                self.face_locations = face_recognition.face_locations(rgb_small_frame)
                self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

                self.face_names = []
                for face_encoding in self.face_encodings:
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    name = "Unknown" 
                    confidence = 'Unknown'

                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)

                    if matches[best_match_index]:
                        name = self.known_face_names[best_match_index]
                        confidence = face_cofidence(face_distances[best_match_index])

                    self.face_names.append(f'{name} ({confidence})')

            self.process_current_frame = not self.process_current_frame

            for (top, right, bottom, left), name in zip(self.face_locations, self.face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), -1)
                cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        self.video_capture.release()

face_recognition_instance = None  # global

@app.get("/recognize_face")
async def recognize_face(face_id: str = Query(..., description="ID của người cần chụp")):
    global face_recognition_instance
    capture_active = True
    face_recognition_instance = FaceRecognition(face_id)
    return StreamingResponse(face_recognition_instance.generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/stop_recognize_face")
async def stop_recognize_face():
    global face_recognition_instance
    
    if face_recognition_instance:
        # print('check turn off cam')
        face_recognition_instance.running = False   
        face_recognition_instance = None
    return {"message": "Face recognition camera stopped."}