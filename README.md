# Vehicle Detection, Tracking, and Trajectory Extraction

## Technical Approach

This project implements a robust pipeline for traffic video analytics, focusing on vehicle detection, multi-object tracking, and trajectory data extraction.

### Tech Stack
- **Python**: The core programming language used for the implementation.
- **OpenCV**: Used for video loading, frame-by-frame processing, drawing annotations (bounding boxes, labels), and saving the output video.
- **Ultralytics YOLOv8**: Leveraged for its state-of-the-art object detection and tracking capabilities. The lightweight `yolov8n.pt` model is used to ensure efficient processing.
- **Pandas**: Used for structuring the extracted trajectory data into a tabular format and exporting it to CSV.
- **NumPy**: Used for efficient numerical operations and handling image data.

### Implementation Workflow

1.  **Model Loading**: Initialize the pretrained YOLOv8 model for detection and tracking.
2.  **Video Metadata Extraction**: Read video properties such as width, height, FPS, and total frame count using OpenCV.
3.  **Processing Range Definition**: Allow for processing specific video segments by defining start and end frame indices.
4.  **Frame-by-Frame Processing**:
    -   **Detection & Tracking**: For each frame, the YOLOv8 `track` method is invoked to detect vehicles and maintain persistent tracking IDs across frames.
    -   **Data Extraction**: Extract bounding box coordinates (`x1, y1, x2, y2`), tracking IDs, and class labels (e.g., car, bus, truck).
    -   **Centroid Calculation**: Compute the center point of each vehicle to represent its position in the trajectory.
    -   **Annotation**: Overlay bounding boxes and tracking IDs on the video frames.
5.  **Output Generation**:
    -   **Annotated Video**: Save the processed frames into a new video file (`.avi` format).
    -   **Trajectory CSV**: Compile all recorded vehicle positions into a structured CSV file containing frame numbers, track IDs, vehicle classes, and coordinates.
