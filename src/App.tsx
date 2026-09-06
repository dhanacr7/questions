import { useState, useEffect } from 'react';
import { Users, Link as LinkIcon, Sun, Moon } from 'lucide-react';
import './index.css';

const qaData = [
  {
    id: 1,
    question: "What happens when two buses moving in opposite directions have only a few seconds of contact?",
    answer: <>We do not transfer continuous video. We transfer a <strong>compact event packet</strong> containing event ID, GPS, timestamp, confidence, type, and optional compressed evidence, so useful information can be exchanged during <strong>short encounters</strong>.</>,
    docs: [
      { name: "Android Developers — Wi-Fi Aware", link: "https://developer.android.com/develop/connectivity/wifi/wifi-aware" },
      { name: "IETF RFC 9171 — Bundle Protocol", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 2,
    question: "How do you select which bus should receive or forward an event?",
    answer: <>Peer selection can consider <strong>connectivity status</strong>, <strong>signal quality</strong>, <strong>route direction</strong>, <strong>event freshness</strong>, and whether the peer already has the event. A better-connected node can act as a <strong>temporary gateway</strong>.</>,
    docs: [
      { name: "IETF RFC 9171 — Delay-Tolerant Networking", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 3,
    question: "How do you prevent the same event from being forwarded repeatedly between buses?",
    answer: <>Every event receives a <strong>unique event ID and timestamp</strong>. Nodes maintain a <strong>local cache</strong> of recently seen IDs and <strong>reject duplicate packets</strong> before forwarding.</>,
    docs: [
      { name: "IETF RFC 9171 — Bundle Protocol Version 7", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 4,
    question: "Why Raspberry Pi instead of ESP32 for the main processing?",
    answer: <><strong>ESP32</strong> is suitable for IMU, GPS, telemetry and <strong>lightweight embedded sensing</strong>. <strong>Raspberry Pi</strong> provides substantially more compute and a <strong>Linux environment</strong> for YOLO, OpenCV, OCR and video processing.</>,
    docs: [
      { name: "Espressif — ESP32-S3 Documentation", link: "https://www.espressif.com/en/products/socs/esp32s3/docs" },
      { name: "Raspberry Pi 5 — Official Specifications", link: "https://www.raspberrypi.com/products/raspberry-pi-5/" }
    ]
  },
  {
    id: 5,
    question: "Why not directly use NVIDIA Jetson instead of Raspberry Pi?",
    answer: <>Raspberry Pi gives us a <strong>cost-effective prototype</strong> platform. Jetson Orin Nano is more appropriate when <strong>higher FPS</strong>, multiple camera feeds, and <strong>TensorRT-accelerated production inference</strong> are required.</>,
    docs: [
      { name: "Raspberry Pi 5", link: "https://www.raspberrypi.com/products/raspberry-pi-5/" },
      { name: "NVIDIA Jetson Modules", link: "https://developer.nvidia.com/embedded/jetson-modules" }
    ]
  },
  {
    id: 6,
    question: "How will you secure communication between buses?",
    answer: <>Nodes are <strong>authenticated</strong>, communications are <strong>encrypted</strong>, and event packets can be <strong>digitally signed</strong> or integrity-protected. Event IDs and timestamps also help protect against <strong>replay attacks</strong>.</>,
    docs: [
      { name: "NIST SP 800-207 — Zero Trust Architecture", link: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      { name: "IETF RFC 8446 — TLS 1.3", link: "https://www.rfc-editor.org/rfc/rfc8446.html" }
    ]
  },
  {
    id: 7,
    question: "What is the expected power consumption of your edge system?",
    answer: <>Power depends on the hardware and inference workload. Raspberry Pi 5 can reach roughly <strong>10–12 W</strong> under demanding board workloads, while Jetson Orin Nano provides <strong>configurable power modes</strong> depending on configuration.</>,
    docs: [
      { name: "Raspberry Pi — Pi 5 Power Discussion", link: "https://www.raspberrypi.com/news/introducing-raspberry-pi-5/" },
      { name: "NVIDIA — Jetson Orin Nano Power Modes", link: "https://docs.nvidia.com/jetson/archives/r36.5/DeveloperGuide/SD/PlatformPowerAndPerformance/JetsonOrinNanoSeriesJetsonOrinNxSeriesAndJetsonAgxOrinSeries.html" }
    ]
  },
  {
    id: 8,
    question: "Why did you choose YOLO for this project?",
    answer: <>Our use case requires <strong>real-time object and road-event detection</strong> on edge hardware. YOLO provides a practical <strong>balance between detection accuracy, inference speed, and deployment complexity</strong>.</>,
    docs: [
      { name: "Ultralytics — YOLO Detection", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 9,
    question: "What metrics will you use to prove your AI model is performing well?",
    answer: <>We evaluate using <strong>precision, recall, F1-score and mAP</strong>, rather than reporting accuracy alone. We also measure <strong>inference latency/FPS</strong> because this is a real-time edge application.</>,
    docs: [
      { name: "Ultralytics — YOLO Performance Metrics", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 10,
    question: "Wi-Fi Aware is not actually a mesh protocol. Then why are you calling your system Urban Swarm Mesh?",
    answer: <>Wi-Fi Aware provides <strong>peer discovery</strong> and <strong>direct P2P communication</strong>. Our application layer implements the <strong>mesh behaviour</strong>—peer selection, forwarding, deduplication, store-carry-forward, and gateway selection.</>,
    docs: [
      { name: "Android Developers — Wi-Fi Aware", link: "https://developer.android.com/develop/connectivity/wifi/wifi-aware" },
      { name: "IETF RFC 9171 — Bundle Protocol / DTN", link: "https://www.rfc-editor.org/rfc/rfc9171.html" }
    ]
  },
  {
    id: 11,
    question: "How do you prevent a shadow or road patch from being falsely detected as a pothole?",
    answer: <>We combine the model confidence with <strong>multiple-frame consistency</strong>, <strong>tracking</strong>, <strong>spatial consistency</strong> and additional observations from other cameras/buses before treating important events as <strong>verified</strong>.</>,
    docs: [
      { name: "Ultralytics — Object Detection", link: "https://docs.ultralytics.com/tasks/detect/" },
      { name: "MDPI Sensors — Cooperative Perception Review", link: "https://www.mdpi.com/1424-8220/22/15/5535" }
    ]
  },
  {
    id: 12,
    question: "If YOLO gives 90% confidence, does that mean the detection is 90% correct?",
    answer: <><strong>No.</strong> A model confidence score should <strong>not automatically be interpreted</strong> as a calibrated probability of correctness. We combine model confidence with <strong>temporal and peer evidence</strong> before assigning system-level trust.</>,
    docs: [
      { name: "Ultralytics — Detection Documentation", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 13,
    question: "How will your model handle rain, night conditions, blur and different camera angles?",
    answer: <>Training data should include different lighting, weather, viewpoints and motion conditions, supported by appropriate <strong>augmentation</strong>. Low-quality observations can also be assigned <strong>lower confidence</strong> and <strong>verified by another sensing node</strong>.</>,
    docs: [
      { name: "Ultralytics — Data Augmentation", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 14,
    question: "Why are you using OpenCV if YOLO already processes images?",
    answer: <>They perform different jobs. <strong>OpenCV</strong> handles video capture, frame processing and preprocessing, while <strong>YOLO</strong> performs the learned object detection.</>,
    docs: [
      { name: "OpenCV — VideoCapture", link: "https://docs.opencv.org/4.x/d8/dfe/classcv_1_1VideoCapture.html" },
      { name: "Ultralytics — YOLO Detection", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 15,
    question: "How do you handle conflicting detections from two buses?",
    answer: <>We <strong>do not blindly accept</strong> either result. The system compares confidence, timestamps, location, repeated observations and <strong>independent peer evidence</strong>, keeping the event uncertain until enough evidence exists.</>,
    docs: [
      { name: "MDPI Sensors — Cooperative Perception Technology Review", link: "https://www.mdpi.com/1424-8220/22/15/5535" }
    ]
  },
  {
    id: 16,
    question: "How do you perform OCR without wasting computation on every video frame?",
    answer: <>OCR runs <strong>only after the relevant object</strong>, such as a number plate, has been detected. The plate region is cropped with OpenCV and sent to OCR, and results can be <strong>stabilized using multiple consecutive frames</strong>.</>,
    docs: [
      { name: "PaddleOCR — Official Documentation", link: "https://github.com/PaddlePaddle/PaddleOCR" },
      { name: "OpenCV Documentation", link: "https://docs.opencv.org/4.x/d8/dfe/classcv_1_1VideoCapture.html" }
    ]
  },
  {
    id: 17,
    question: "How will you know whether your model is overfitting?",
    answer: <>We keep <strong>independent training, validation and test sets</strong> and compare their performance. A large <strong>training-versus-validation gap</strong> indicates poor generalization and possible overfitting.</>,
    docs: [
      { name: "Ultralytics — Model Training", link: "https://docs.ultralytics.com/tasks/detect/" }
    ]
  },
  {
    id: 18,
    question: "What happens when the AI encounters an object or road condition it has never seen before?",
    answer: <>The system should <strong>avoid forcing a confident classification</strong>. Low-confidence or unusual observations can be marked as uncertain, stored as evidence, and sent for <strong>peer or human verification</strong>.</>,
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
