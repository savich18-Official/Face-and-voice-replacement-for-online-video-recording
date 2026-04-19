
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Camera, Video, Download, Square, Shield, Ghost, Cpu, Scan, Zap, Settings, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import * as faceapi from '@vladmandic/face-api';

const DEFAULT_FACE = "https://i.imgur.com/jbvlrax.gif";
const DEFAULT_BG = "https://i.pinimg.com/originals/a4/d4/3e/a4d43eb1957573dc17df168c1a16e5ee.gif";
const MODEL_URL = 'https://cdn.jsdelivr.net/gh/vladmandic/face-api@master/model';

const getProxyUrl = (url: string) => `/api/proxy?url=${encodeURIComponent(url)}`;

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [status, setStatus] = useState<string>("СИСТЕМА_ОЖИДАНИЯ");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  const [faceMaskUrl, setFaceMaskUrl] = useState(DEFAULT_FACE);
  const [backgroundUrl, setBackgroundUrl] = useState(DEFAULT_BG);
  const [tempFaceUrl, setTempFaceUrl] = useState(DEFAULT_FACE);
  const [tempBgUrl, setTempBgUrl] = useState(DEFAULT_BG);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  
  const faceImgRef = useRef<HTMLImageElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const detectionsRef = useRef<faceapi.FaceDetection | null>(null);
  const smoothDetectionsRef = useRef<{ x: number, y: number, w: number, h: number } | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Load Neural Models once
  useEffect(() => {
    const loadModels = async () => {
      setStatus("ЗАГРУЗКА_МОДЕЛЕЙ...");
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        setStatus("МОДУЛИ_ГОТОВЫ");
      } catch (err) {
        console.error("Model load error:", err);
        setStatus("ОШИБКА_МОДЕЛЕЙ");
      }
    };
    loadModels();
  }, []);

  // Handle Asset Loading
  useEffect(() => {
    const loadAssets = () => {
      const face = new Image();
      face.crossOrigin = "anonymous";
      face.onload = () => { faceImgRef.current = face; };
      face.onerror = () => { setStatus("ОШИБКА_МАСКИ"); };
      face.src = getProxyUrl(faceMaskUrl);

      const bg = new Image();
      bg.crossOrigin = "anonymous";
      bg.onload = () => { bgImgRef.current = bg; };
      bg.onerror = () => { setStatus("ОШИБКА_ФОНА"); };
      bg.src = getProxyUrl(backgroundUrl);
    };

    loadAssets();
  }, [faceMaskUrl, backgroundUrl]);

  // Tracking Loop (Throttled for performance)
  useEffect(() => {
    if (!isCameraActive || !modelsLoaded) return;

    let isRunning = true;
    const detect = async () => {
      const video = videoRef.current;
      if (!video || !isRunning) return;

      if (video.readyState < 2) {
        setTimeout(() => isRunning && detect(), 500);
        return;
      }
      
      try {
        const detections = await faceapi.detectSingleFace(
          video, 
          new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.3 })
        );

        if (detections) {
          detectionsRef.current = detections;
        }

        if (isRunning) setTimeout(detect, 100); 
      } catch (err) {
        console.error("Detection error:", err);
        if (isRunning) setTimeout(detect, 1000);
      }
    };

    detect();
    return () => { isRunning = false; };
  }, [isCameraActive, modelsLoaded]);

  // Compositing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      try {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (bgImgRef.current && bgImgRef.current.complete && bgImgRef.current.naturalWidth > 0) {
          ctx.drawImage(bgImgRef.current, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = "#020617";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "rgba(34, 197, 94, 0.05)";
          for(let i=0; i<canvas.width; i+=40) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
          }
        }

        const detection = detectionsRef.current;
        if (detection && faceImgRef.current && faceImgRef.current.complete) {
          const { x, y, width, height } = detection.box;
          const video = videoRef.current;
          
          if (video) {
            const scaleX = canvas.width / video.videoWidth;
            const scaleY = canvas.height / video.videoHeight;

            if (!smoothDetectionsRef.current) {
               smoothDetectionsRef.current = { x, y, w: width, h: height };
            } else {
               const ease = 0.3;
               smoothDetectionsRef.current.x += (x - smoothDetectionsRef.current.x) * ease;
               smoothDetectionsRef.current.y += (y - smoothDetectionsRef.current.y) * ease;
               smoothDetectionsRef.current.w += (width - smoothDetectionsRef.current.w) * ease;
               smoothDetectionsRef.current.h += (height - smoothDetectionsRef.current.h) * ease;
            }

            const sm = smoothDetectionsRef.current;
            const paddingHorizontal = sm.w * 0.12;
            const maskWidth = (sm.w + paddingHorizontal * 2) * scaleX;
            const maskHeight = (faceImgRef.current.height / faceImgRef.current.width) * maskWidth;
            
            const drawX = (sm.x - paddingHorizontal) * scaleX;
            const drawY = (sm.y - (sm.h * 0.15)) * scaleY;

            ctx.drawImage(faceImgRef.current, drawX, drawY, maskWidth, maskHeight);

            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 1;
            ctx.strokeRect(drawX, drawY, maskWidth, maskHeight);
          }
        }

        animationFrameId = requestAnimationFrame(draw);
      } catch (err) {
        console.error("Draw loop error:", err);
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRecording, isCameraActive]);

  const activateNeuralLink = async () => {
    try {
      setStatus("УСТАНОВКА_СВЯЗИ...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setStatus("СВЯЗЬ_УСТАНОВЛЕНА");
    } catch (err) {
      console.error(err);
      setStatus("ОШИБКА_СВЯЗИ");
    }
  };

  const setupAudioModulation = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    const destination = audioCtx.createMediaStreamDestination();
    audioDestinationRef.current = destination;

    const distortion = audioCtx.createWaveShaper();
    function makeDistortionCurve(amount: number) {
      const k = typeof amount === 'number' ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      for (let i = 0 ; i < n_samples; ++i ) {
        const x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * (Math.PI / 180) / ( Math.PI + k * Math.abs(x) );
      }
      return curve;
    }
    distortion.curve = makeDistortionCurve(600);
    distortion.oversample = '4x';

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1000;

    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);

    source.connect(distortion);
    distortion.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(destination);
  };

  const startRecording = async () => {
    if (!isCameraActive) await activateNeuralLink();
    
    try {
      setStatus("ПОДГОТОВКА...");
      await setupAudioModulation();

      const canvasStream = canvasRef.current!.captureStream(30);
      const audioStream = audioDestinationRef.current!.stream;

      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);

      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
        ? 'video/mp4;codecs=avc1'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
          ? 'video/webm;codecs=vp9' 
          : 'video/webm';

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const type = mimeType.includes('mp4') ? 'video/mp4' : 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setStatus("СОХРАНЕНО");
      };

      setDownloadUrl(null);
      recorder.start(1000); 
      setIsRecording(true);
      setStatus("ИДЕТ_ЗАПИСЬ");
    } catch (err) {
      console.error(err);
      setStatus("ОШИБКА");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-green-500 selection:text-black overflow-hidden flex flex-col items-center">
      <div className="scanline" />
      <div className="noise" />
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full" />
      </div>

      <header className="w-full max-w-7xl px-8 py-6 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-green-500/30 flex items-center justify-center">
              <Ghost className="text-green-500" size={24} />
            </div>
            {isCameraActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(34,197,94,1)]" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
              PHANTOM<span className="text-green-500">CRYPT</span>
            </h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 font-mono text-[10px] uppercase font-bold tracking-widest text-slate-500">
           <div className="flex items-center gap-2"><Cpu size={12} /> {modelsLoaded ? 'READY' : 'LOADING'}</div>
           <div className="flex items-center gap-2"><Zap size={12} /> STABLE</div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl px-8 pb-8 flex flex-col lg:flex-row gap-8 min-h-0 overflow-hidden relative">
        <video ref={videoRef} playsInline muted autoPlay className="hidden" />
        
        {/* Left Control Panel */}
        <div className="lg:w-72 flex flex-col gap-6 shrink-0 z-10">
          <div className="hud-panel p-6 space-y-6">
            <div>
              {!isCameraActive ? (
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={activateNeuralLink} 
                  className="w-full h-14 bg-green-500 text-slate-950 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <Camera size={20} /> Включить
                </motion.button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)} 
                      className={`flex-1 h-12 rounded-lg flex items-center justify-center transition-all ${isAudioEnabled ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-500'}`}
                    >
                      {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    {!isRecording ? (
                      <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={startRecording} 
                        className="flex-[2] h-12 bg-red-600 text-white rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                      >
                        <Video size={18} /> Запись
                      </motion.button>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={stopRecording} 
                        className="flex-[2] h-12 bg-white text-black rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Square size={16} fill="currentColor" /> Стоп
                      </motion.button>
                    )}
                  </div>
                  {downloadUrl && (
                    <motion.a 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      href={downloadUrl} 
                      download={`phantom_${Date.now()}.mp4`} 
                      className="w-full h-12 border border-green-500/50 text-green-500 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Download size={18} /> Скачать
                    </motion.a>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 font-mono text-[11px] h-full overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex justify-between items-center text-slate-500 bg-black/20 p-3 rounded">
                <span>СТАТУС:</span>
                <span className="text-green-500">{status}</span>
              </div>

              <div className="h-px bg-slate-800 my-2" />

              <div className="space-y-3">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={10} /> Маска (GIF URL)
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tempFaceUrl} 
                    onChange={(e) => setTempFaceUrl(e.target.value)}
                    className="flex-1 bg-black/40 border border-slate-800 rounded px-2 py-1.5 text-[9px] text-slate-300 focus:border-green-500/50 outline-none"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => setFaceMaskUrl(tempFaceUrl)} 
                    className="bg-slate-800 hover:bg-green-500 hover:text-black p-1.5 rounded transition-colors text-[9px] font-bold"
                  >
                    ПРИМ
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Scan size={10} /> Фон (GIF URL)
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tempBgUrl} 
                    onChange={(e) => setTempBgUrl(e.target.value)}
                    className="flex-1 bg-black/40 border border-slate-800 rounded px-2 py-1.5 text-[9px] text-slate-300 focus:border-green-500/50 outline-none"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => setBackgroundUrl(tempBgUrl)} 
                    className="bg-slate-800 hover:bg-green-500 hover:text-black p-1.5 rounded transition-colors text-[9px] font-bold"
                  >
                    ПРИМ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 tactical-corners shadow-2xl">
            <canvas ref={canvasRef} width={1280} height={720} className="w-full h-full object-contain" />
            
            {isRecording && (
              <div className="absolute top-8 left-8 z-20 flex items-center gap-3 bg-red-600/90 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-red-500/50">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                REC
              </div>
            )}

            <div className="absolute bottom-6 left-8 pointer-events-none">
              <div className="text-[10px] text-slate-500 font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800 backdrop-blur-sm">
                 Neural Anonymization Active
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-10">
              <motion.div animate={{ translateY: ['0%', '100%'] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="w-full h-[1px] bg-green-500" />
            </div>
          </div>
        </div>
      </main>

      <div className="hidden">
        <img src={getProxyUrl(faceMaskUrl)} crossOrigin="anonymous" alt="" />
        <img src={getProxyUrl(backgroundUrl)} crossOrigin="anonymous" alt="" />
      </div>
    </div>
  );
}
