# EEE4114F ML project

## Sign language recognition

Using an app built with expo and an ML model trained using openCV and the sign language MINST kaggle data set letters can be classified.

The app takes a photo every 500ms, sending that image to a python API. Using openCV a classification of proposed signed letter is made and then the classfied letter is sent back to the phone. The phone app then has the ability to "save" each letter classifcation in-order to build a translated sentance.
