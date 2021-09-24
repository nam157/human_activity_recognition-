#!/usr/bin/env python
# coding: utf-8

# In[2]:


import mediapipe as mp
import cv2
import numpy as np
import time

class mediapipe_pose:
    def __init__(self):
        self.mp_holistic = mp.solutions.holistic 
        self.mp_drawing = mp.solutions.drawing_utils
    def mediapipe_detection(self,image,model):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 
        image.flags.writeable = False                 
        results = model.process(image)                 
        image.flags.writeable = True                   
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) 
        return image, results
    def draw_styled_landmarks(self,image, results):
        self.mp_drawing.draw_landmarks(image, results.pose_landmarks, self.mp_holistic.POSE_CONNECTIONS,
                                 self.mp_drawing.DrawingSpec(color=(112,112,112), thickness=2, circle_radius=1), 
                                 self.mp_drawing.DrawingSpec(color=(94,200,0), thickness=2, circle_radius=1)
                                 ) 
    def extract_keypoints(self,results):
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
        return np.concatenate([pose])
    def BBox(self,image,results):
        xList,yList,bbox = [],[],[]
        if results.pose_landmarks:
            for id,land in enumerate(results.pose_landmarks.landmark):
                h,w,c = image.shape # high,weight,chanel with img
                cx = int(land.x *w)
                cy = int(land.y *h)
                xList.append(cx)
                yList.append(cy)
            xmin,xmax = min(xList),max(xList)
            ymin,ymax = min(yList),max(yList)
            bbox = xmin,ymin,xmax,ymax
        return bbox

# In[ ]:




