import { useState, useEffect } from "react";
import API, { API_BASE_URL } from "./services/api";

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [startFrame, setStartFrame] = useState(0);
  const [endFrame, setEndFrame] = useState(300);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [csvUrl, setCsvUrl] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("start_frame", startFrame);
      formData.append("end_frame", endFrame);

      const response = await API.post(
        "/process-video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setVideoUrl(`${API_BASE_URL}${response.data.video_url}`);
      setCsvUrl(`${API_BASE_URL}${response.data.csv_url}`);
    } catch (error) {
      console.error(error);
      alert("Processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display:'flex', 
      flexDirection:'column', 
      gap:'28px', 
      maxWidth:'1400px', 
      margin:'0 auto', 
      height: '70vh',
      maxHeight: '70vh'
    }}>
      
      {/* Topbar row */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: '48px' }}>Traffic Analytics</h1>
      </div>

      {/* Two-column content */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 320px', 
        gap: '28px', 
        flexGrow: 1, 
        minHeight: 0 
      }}>
        
        {/* Main Content (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 0 }}>
          <div className="card" style={{ 
            padding: '0', 
            overflow: 'hidden', 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'var(--ink)',
            position: 'relative'
          }}>
            {videoUrl ? (
              <video
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block' 
                }}
                controls
                key={videoUrl}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div className="section-title" style={{ marginBottom: '8px' }}>Preview Area</div>
                <div className="micro-label">Upload and process a video to see results</div>
              </div>
            )}
          </div>

          {csvUrl && (
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div className="section-title">Analysis Ready</div>
                <div className="small-label">Trajectory data extracted successfully.</div>
              </div>
              <a 
                href={csvUrl} 
                download 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--orange)', 
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                Download CSV
              </a>
            </div>
          )}
        </div>

        {/* Sidebar (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '4px' }}>
          <div className="card">
            <div className="section-title" style={{ marginBottom: '16px' }}>Configuration</div>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="small-label" style={{ display: 'block', marginBottom: '8px' }}>Video Source</label>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setVideoFile(e.target.files[0])}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="small-label" style={{ display: 'block', marginBottom: '8px' }}>Start Frame</label>
              <input
                type="number"
                value={startFrame}
                onChange={(e) => setStartFrame(parseInt(e.target.value) || 0)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="small-label" style={{ display: 'block', marginBottom: '8px' }}>End Frame</label>
              <input
                type="number"
                value={endFrame}
                onChange={(e) => setEndFrame(parseInt(e.target.value) || 0)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button onClick={handleUpload} disabled={loading || !videoFile}>
            {loading ? "Processing..." : "Process Video"}
          </button>

          <div className="card" style={{ background: 'var(--orange-soft)', border: '1px solid var(--orange-mid)' }}>
            <div className="section-title" style={{ color: 'var(--orange)', marginBottom: '8px' }}>Active Task</div>
            <div className="micro-label" style={{ color: 'var(--ink-2)' }}>
              {loading ? "System is currently processing the video file. This may take a moment depending on the frame range." : "Idle. Ready for next processing task."}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
