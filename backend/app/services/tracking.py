import os
import cv2
import pandas as pd
import uuid

from ultralytics import YOLO

model = YOLO("yolov8n.pt")



async def process_video(file, start_frame, end_frame):
    unique_id = str(uuid.uuid4())
    
    # Create folders if not present
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs/videos", exist_ok=True)
    os.makedirs("outputs/csv", exist_ok=True)

    # Save uploaded video
    upload_path = f"uploads/{file.filename}"

    with open(upload_path, "wb") as f:
        f.write(await file.read())

    # Open video
    cap = cv2.VideoCapture(upload_path)

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # Safety fallback
    if fps == 0:
        fps = 30

    # Output video path
    temp_video_path = f"outputs/videos/{unique_id}.avi"

    fourcc = cv2.VideoWriter_fourcc(*'XVID')

    out = cv2.VideoWriter(
        temp_video_path,
        fourcc,
        fps,
        (frame_width, frame_height)
    )

    # Initialize storage
    trajectory_data = []

    frame_count = 0

    # Process video
    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        # Skip frames before start
        if frame_count < start_frame:
            continue

        # Stop after end frame
        if frame_count > end_frame:
            break

        # YOLO tracking
        results = model.track(
            frame,
            persist=True,
            verbose=False
        )

        boxes = results[0].boxes

        # Process detections
        for box in boxes:

            x1, y1, x2, y2 = box.xyxy[0].tolist()
            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])

            # Tracking ID
            if box.id is not None:
                track_id = int(box.id[0])
            else:
                track_id = -1

            # Vehicle class
            class_id = int(box.cls[0])
            class_name = model.names[class_id]

            # Centroid
            centroid_x = int((x1 + x2) / 2)
            centroid_y = int((y1 + y2) / 2)

            # Draw bounding box
            cv2.rectangle(
                frame,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            # Draw label
            label = f"{class_name} ID:{track_id}"

            cv2.putText(
                frame,
                label,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2
            )

            # Store trajectory data
            trajectory_data.append({
                "frame": frame_count,
                "track_id": track_id,
                "vehicle_class": class_name,
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "centroid_x": centroid_x,
                "centroid_y": centroid_y
            })

        # Write annotated frame
        out.write(frame)

    # Release resources
    cap.release()
    out.release()
    
    import subprocess
    
    final_video_path = f"outputs/videos/{unique_id}.mp4"

    subprocess.run([
        "ffmpeg",
        "-y",
        "-i",
        temp_video_path,
        "-vcodec",
        "libx264",
        "-acodec",
        "aac",
        final_video_path
    ])

    cv2.destroyAllWindows()

    # Save CSV
    trajectory_df = pd.DataFrame(trajectory_data)

    csv_path = f"outputs/csv/{unique_id}.csv"

    trajectory_df.to_csv(csv_path, index=False)

    # Return output paths
    return {
    "video_url": f"/outputs/videos/{unique_id}.mp4",
    "csv_url": f"/outputs/csv/{unique_id}.csv"
}