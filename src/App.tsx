import { useState, useEffect } from 'react';
import { Users, Link as LinkIcon, Sun, Moon } from 'lucide-react';
import './index.css';

const qaData = [
  {
    id: 1,
    question: "Wi-Fi Aware is not actually a mesh protocol. Then why are you calling your system Urban Swarm Mesh?",
    answer: "Wi-Fi Aware provides peer discovery and direct P2P communication. Our application layer implements the mesh behaviour—peer selection, forwarding, deduplication, store-carry-forward, and gateway selection.",
    docs: [
      { name: "Android Developers — Wi-Fi Aware", link: "https://developer.android.com/develop/connectivity/wifi/wifi-aware" },
      { name: "IETF RFC 9171 — Bundle Protocol / DTN", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 2,
    question: "What happens when two buses moving in opposite directions have only a few seconds of contact?",
    answer: "We do not transfer continuous video. We transfer a compact event packet containing event ID, GPS, timestamp, confidence, type, and optional compressed evidence, so useful information can be exchanged during short encounters.",
    docs: [
      { name: "Android Developers — Wi-Fi Aware", link: "https://developer.android.com/develop/connectivity/wifi/wifi-aware" },
      { name: "IETF RFC 9171 — Bundle Protocol", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 3,
    question: "How do you select which bus should receive or forward an event?",
    answer: "Peer selection can consider connectivity status, signal quality, route direction, event freshness, and whether the peer already has the event. A better-connected node can act as a temporary gateway.",
    docs: [
      { name: "IETF RFC 9171 — Delay-Tolerant Networking", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 4,
    question: "How do you prevent the same event from being forwarded repeatedly between buses?",
    answer: "Every event receives a unique event ID and timestamp. Nodes maintain a local cache of recently seen IDs and reject duplicate packets before forwarding.",
    docs: [
      { name: "IETF RFC 9171 — Bundle Protocol Version 7", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 5,
    question: "Why Raspberry Pi instead of ESP32 for the main processing?",
    answer: "ESP32 is suitable for IMU, GPS, telemetry and lightweight embedded sensing. Raspberry Pi provides substantially more compute and a Linux environment for YOLO, OpenCV, OCR and video processing.",
    docs: [
      { name: "Espressif — ESP32-S3 Documentation", link: "https://www.espressif.com/en/products/socs/esp32s3/docs" },
      { name: "Raspberry Pi 5 — Official Specifications", link: "https://www.raspberrypi.com/products/raspberry-pi-5/" }
    ]
  },
  {
    id: 6,
    question: "Why not directly use NVIDIA Jetson instead of Raspberry Pi?",
    answer: "Raspberry Pi gives us a cost-effective prototype platform. Jetson Orin Nano is more appropriate when higher FPS, multiple camera feeds, and TensorRT-accelerated production inference are required.",
    docs: [
      { name: "Raspberry Pi 5", link: "https://www.raspberrypi.com/products/raspberry-pi-5/" },
      { name: "NVIDIA Jetson Modules", link: "https://developer.nvidia.com/embedded/jetson-modules" }
    ]
  },
  {
    id: 7,
    question: "How will you secure communication between buses?",
    answer: "Nodes are authenticated, communications are encrypted, and event packets can be digitally signed or integrity-protected. Event IDs and timestamps also help protect against replay attacks.",
    docs: [
      { name: "NIST SP 800-207 — Zero Trust Architecture", link: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      { name: "IETF RFC 8446 — TLS 1.3", link: "https://www.rfc-editor.org/rfc/rfc8446.html" }
    ]
  },
  {
    id: 8,
    question: "What is the expected power consumption of your edge system?",
    answer: "Power depends on the hardware and inference workload. Raspberry Pi 5 can reach roughly 10–12 W under demanding board workloads, while Jetson Orin Nano provides configurable power modes depending on configuration.",
    docs: [
      { name: "Raspberry Pi — Pi 5 Power Discussion", link: "https://www.raspberrypi.com/news/introducing-raspberry-pi-5/" },
      { name: "NVIDIA — Jetson Orin Nano Power Modes", link: "https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/PlatformPowerAndPerformance/JetsonOrinNanoSeriesJetsonOrinNxSeriesAndJetsonAgxOrinSeries.html" }
    ]
  },
  {
    id: 9,
    question: "Why did you choose YOLO for this project?",
    answer: "Our use case requires real-time object and road-event detection on edge hardware. YOLO provides a practical balance between detection accuracy, inference speed, and deployment complexity.",
    docs: [
      { name: "Ultralytics — YOLO Detection", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 10,
    question: "What metrics will you use to prove your AI model is performing well?",
    answer: "We evaluate using precision, recall, F1-score and mAP, rather than reporting accuracy alone. We also measure inference latency/FPS because this is a real-time edge application.",
    docs: [
      { name: "Ultralytics — YOLO Performance Metrics", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 11,
    question: "How do you prevent a shadow or road patch from being falsely detected as a pothole?",
    answer: "We combine the model confidence with multiple-frame consistency, tracking, spatial consistency and additional observations from other cameras/buses before treating important events as verified.",
    docs: [
      { name: "Ultralytics — Object Detection", link: "https://docs.ultralytics.com/tasks/detect/" },
      { name: "MDPI Sensors — Cooperative Perception Review", link: "https://www.mdpi.com/1424-8220/22/15/5535" }
    ]
  },
  {
    id: 12,
    question: "If YOLO gives 90% confidence, does that mean the detection is 90% correct?",
    answer: "No. A model confidence score should not automatically be interpreted as a calibrated probability of correctness. We combine model confidence with temporal and peer evidence before assigning system-level trust.",
    docs: [
      { name: "Ultralytics — Detection Documentation", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 13,
    question: "How will your model handle rain, night conditions, blur and different camera angles?",
    answer: "Training data should include different lighting, weather, viewpoints and motion conditions, supported by appropriate augmentation. Low-quality observations can also be assigned lower confidence and verified by another sensing node.",
    docs: [
      { name: "Ultralytics — Data Augmentation", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 14,
    question: "Why are you using OpenCV if YOLO already processes images?",
    answer: "They perform different jobs. OpenCV handles video capture, frame processing and preprocessing, while YOLO performs the learned object detection.",
    docs: [
      { name: "OpenCV — VideoCapture", link: "https://docs.opencv.org/4.x/d8/dfe/classcv_1_1VideoCapture.html" },
      { name: "Ultralytics — YOLO Detection", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 15,
    question: "How do you handle conflicting detections from two buses?",
    answer: "We do not blindly accept either result. The system compares confidence, timestamps, location, repeated observations and independent peer evidence, keeping the event uncertain until enough evidence exists.",
    docs: [
      { name: "MDPI Sensors — Cooperative Perception Technology Review", link: "https://www.mdpi.com/1424-8220/22/15/5535" }
    ]
  },
  {
    id: 16,
    question: "How do you perform OCR without wasting computation on every video frame?",
    answer: "OCR runs only after the relevant object, such as a number plate, has been detected. The plate region is cropped with OpenCV and sent to OCR, and results can be stabilized using multiple consecutive frames.",
    docs: [
      { name: "PaddleOCR — Official Documentation", link: "https://github.com/PaddlePaddle/PaddleOCR" },
      { name: "OpenCV Documentation", link: "https://docs.opencv.org/4.x/d8/dfe/classcv_1_1VideoCapture.html" }
    ]
  },
  {
    id: 17,
    question: "How will you know whether your model is overfitting?",
    answer: "We keep independent training, validation and test sets and compare their performance. A large training-versus-validation gap indicates poor generalization and possible overfitting.",
    docs: [
      { name: "Ultralytics — Model Training", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 18,
    question: "What happens when the AI encounters an object or road condition it has never seen before?",
    answer: "The system should avoid forcing a confident classification. Low-confidence or unusual observations can be marked as uncertain, stored as evidence, and sent for peer or human verification.",
    docs: [
      { name: "Ultralytics — YOLO Prediction", link: "https://docs.ultralytics.com/tasks/detect/" },
      { name: "MDPI Sensors — Cooperative Perception Review", link: "https://www.mdpi.com/1424-8220/22/15/5535" }
    ]
  }
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <>
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Header Section (White) */}
      <header className="header">
        <div className="title-logo-container">
          <img src="/INETRA logo.png" alt="INETRA Unified Urban Sensing Platform" className="main-logo" />
        </div>
        <p className="subtitle">
          Problem Statements, Technical Challenges, and System Architecture Q&A
        </p>
      </header>

      {/* Main Content (Light Gray) */}
      <main className="main-content">
        <div className="section-header-container">
          <div className="section-title-wrapper">
            <Users className="section-icon" />
            <h2 className="section-title">Q and As regarding our problems</h2>
          </div>
          <p className="section-subtitle">
            Detailed answers to common technical queries about the Urban Swarm Mesh system.
          </p>
        </div>

        {/* Q&A Grid */}
        <div className="qa-grid">
          {qaData.map((item) => (
            <div key={item.id} className="qa-card">
              
              {/* Top part mimicking avatar + name */}
              <div className="qa-card-header">
                <div className="q-avatar">Q{item.id}</div>
                <div className="question-text-wrapper">
                  <h3 className="question-text">{item.question}</h3>
                </div>
              </div>
              
              {/* Body mimicking role */}
              <div className="qa-card-body">
                <p className="answer-text">{item.answer}</p>
              </div>

              {/* Separator line */}
              <div className="qa-separator"></div>

              {/* Footer mimicking phone/linkedin links */}
              {item.docs && item.docs.length > 0 && (
                <div className="qa-card-footer">
                  <ul className="docs-list">
                    {item.docs.map((doc, idx) => (
                      <li key={idx}>
                        <a href={doc.link} target="_blank" rel="noopener noreferrer" className="doc-link">
                          <LinkIcon className="doc-icon" />
                          <span>{doc.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
