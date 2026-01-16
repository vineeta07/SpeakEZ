import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gauge,
  Zap,
  Eye,
  User,
  MessageSquare,
  Brain,
  TrendingUp
} from 'lucide-react';

import { Header } from './components/Header';
import { ConfidenceGauge } from './components/ConfidenceGauge';
import { MetricCard } from './components/MetricCard';
import { ScenarioSelector } from './components/ScenarioSelector';
import { FeedbackStream } from './components/FeedbackStream';
import { VideoFeed } from './components/VideoFeed';
import { ParticleSystem } from './components/ParticleSystem';

import { useSpeechEngine, useMediaDevices } from './hooks/useSpeechEngine';
import type { ScenarioType } from './types';
import { SCENARIOS } from './config/scenarios';

import './index.css';

function App() {
  const [scenario, setScenario] = useState<ScenarioType>('interview');
  const [isSessionActive, setIsSessionActive] = useState(false);

  const {
    stream,
    isVideoActive,
    isAudioActive,
    toggleVideo,
    toggleAudio,
  } = useMediaDevices();

  const { metrics, particles } = useSpeechEngine(isSessionActive);

  const handleReset = () => {
    setIsSessionActive(false);
    window.location.reload();
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
    toggleVideo();
  };

  const currentScenario = SCENARIOS[scenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Particle System */}
      <ParticleSystem particles={particles} />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: currentScenario.colorScheme.gradient,
            top: '10%',
            left: '10%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: currentScenario.colorScheme.gradient,
            bottom: '10%',
            right: '10%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <Header
          isAudioActive={isAudioActive}
          isVideoActive={isVideoActive}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onReset={handleReset}
        />

        {/* Main Dashboard */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full grid grid-cols-12 gap-6">
            {/* Left Panel - Video Feed */}
            <div className="col-span-5 flex flex-col gap-6">
              <div className="flex-1">
                <VideoFeed
                  stream={stream}
                  isActive={isVideoActive}
                  eyeContact={metrics.eyeContact}
                  posture={metrics.posture}
                />
              </div>

              {/* Scenario Selector */}
              <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Select Scenario
                </h3>
                <ScenarioSelector selected={scenario} onSelect={setScenario} />
              </div>
            </div>

            {/* Center Panel - Confidence & Metrics */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* Confidence Gauge */}
              <div className="glass rounded-xl p-6 flex items-center justify-center">
                <ConfidenceGauge
                  confidence={metrics.confidence}
                  trend={metrics.confidenceTrend}
                  scenario={scenario}
                />
              </div>

              {/* Metrics Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Voice Engine Metrics */}
                <MetricCard
                  title="Pace"
                  value={metrics.pace}
                  unit="wpm"
                  icon={Zap}
                  target={currentScenario.targetRanges.pace}
                  type="number"
                />
                <MetricCard
                  title="Stress"
                  value={metrics.stress}
                  unit="%"
                  icon={Gauge}
                  target={{ max: currentScenario.targetRanges.stress.max }}
                  type="percentage"
                />
                <MetricCard
                  title="Eye Contact"
                  value={metrics.eyeContact}
                  unit="%"
                  icon={Eye}
                  target={{ min: currentScenario.targetRanges.eyeContact.min }}
                  type="percentage"
                />
                <MetricCard
                  title="Posture"
                  value={metrics.posture}
                  unit="%"
                  icon={User}
                  type="percentage"
                />
                <MetricCard
                  title="Clarity"
                  value={metrics.clarity}
                  unit="%"
                  icon={MessageSquare}
                  type="percentage"
                />
                <MetricCard
                  title="Logic"
                  value={metrics.logic}
                  unit="%"
                  icon={Brain}
                  type="percentage"
                />
              </div>

              {/* Fillers Counter */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <MessageSquare className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      Filler Words
                    </span>
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-white"
                    key={metrics.fillerCount}
                    initial={{ scale: 1.5, color: '#ef4444' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    transition={{ duration: 0.3 }}
                  >
                    {metrics.fillerCount}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right Panel - Feedback Stream */}
            <div className="col-span-3 glass rounded-xl p-4">
              <FeedbackStream metrics={metrics} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="glass-dark border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-400">
                  {isSessionActive ? 'Session Active' : 'Ready to Start'}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Scenario: {currentScenario.name}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isSessionActive && (
                <motion.button
                  onClick={handleStartSession}
                  className="px-6 py-3 rounded-lg font-bold text-white"
                  style={{
                    background: currentScenario.colorScheme.gradient,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Start Session</span>
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
