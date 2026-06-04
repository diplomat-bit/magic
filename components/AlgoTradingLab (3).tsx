import React, { useState, useCallback, useMemo, ChangeEvent, FormEvent } from 'react';
import {
  RefreshCw, Play, Save, History, Code, Settings, TrendingUp, DollarSign, X, User, LogOut,
  Plus, Search, Filter, ChevronDown, ChevronUp, BrainCircuit, Bot, SlidersHorizontal,
  LayoutDashboard, Repeat, Send, Target, Trophy, Heart, Briefcase, Link, Zap, Lock,
  Atom, Users, Megaphone, CreditCard, Handshake, Activity, Phone, Shield, Sparkles, Eye,
  Globe, Key, Receipt, Rocket, PieChart, Palette, Building, Wheat, Scale, Crown, FileText,
  Server, Network, GitBranch, HardDrive, Cpu, Database, Cloud, Terminal, BookOpen,
  BarChart2, CheckSquare, Calendar, MessageSquare, LifeBuoy, MonitorCheck, Info, Lightbulb
} from 'lucide-react';
import { Badge } from './badge';
import * as JBOIII from './jboiii_modules'; // The James Burvel O’Callaghan III Code Library - External Module Access

// --- The James Burvel O’Callaghan III Code: Expanded Data Models ---
// Company: QuantumLeap Analytics, API Endpoint: /system/metrics, Use Case: Real-time System Performance Monitoring, Feature: Dynamic Metric Aggregation - A
interface A_SystemMetric extends JBOIII.JBOSystemMetric {
  id: string; // A1
  label: string; // A2
  value: number; // A3
  unit: string; // A4
  trend: 'up' | 'down' | 'stable'; // A5
  change: number; // A6
  aiPrediction: number; // A7
  subMetrics?: { label: string; value: string }[]; // A8
  timestamp?: string; //A9
  max?: number; // Added for N_ProgressBar compatibility
}

// Company: QuantumLeap Analytics, API Endpoint: /ai/insights, Use Case: Proactive Anomaly Detection, Feature: Contextual AI Insight Generation - B
interface B_AIInsight extends JBOIII.JBOAIInsight {
  id: string; // B1
  timestamp: string; // B2
  severity: 'low' | 'medium' | 'high' | 'critical'; // B3
  category: 'market' | 'system' | 'security' | 'optimization' | 'regulatory' | 'data'; // B4 - Added 'data' category for completeness
  message: string; // B5
  confidence: number; // B6 (0-1)
  actionable: boolean; // B7
  relatedEntityId?: string; // B8
  sourceModule?: string; // B9
}

// Company: Algorithmics Inc., API Endpoint: /algorithms/parameters, Use Case: Algorithm Configuration & Tuning, Feature: Parameter Validation & Constraint Enforcement - C
interface C_AlgorithmParameter extends JBOIII.JBOAlgorithmParameter {
  name: string; // C1
  type: 'number' | 'string' | 'boolean' | 'enum'; // C2 - Added 'enum' type
  value: any; // C3
  range?: [number, number]; // C4 (for type 'number')
  options?: string[]; // Added for type 'enum'
  description: string; // C5
  validationRegex?: string; // C6 (for type 'string')
  defaultValue?: any; // C7
}

// Company: Algorithmics Inc., API Endpoint: /algorithms, Use Case: Algorithm Management & Deployment, Feature: Advanced Algorithm Versioning & Rollback - D
interface D_Algorithm extends JBOIII.JBOAlgorithm {
  id: string; // D1
  name: string; // D2
  description: string; // D3
  tags: string[]; // D4
  code: string; // D5 Can be JSON for No-Code or raw script
  language: 'nocode' | 'python' | 'rust' | 'javascript'; // D6 - Added 'javascript'
  status: 'draft' | 'backtesting' | 'live' | 'error' | 'optimizing' | 'archived' | 'paused'; // D7 - Added 'paused'
  version: number; // D8
  lastModified: string; // D9
  author: string; // DA
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'; // DB
  aiScore: number; // DC 0-100, AI's confidence in the algo's viability
  parameters: C_AlgorithmParameter[]; // DD
  deploymentTarget: 'cloud-cluster-a' | 'edge-node-tokyo' | 'quantum-fabric-1' | 'local-dev'; // DE - Added 'local-dev'
  performanceMetrics?: {
    pnl: number; // DF
    return: number; // DG
    sharpe: number; // DH
    sortino: number; // DI
    alpha: number; // DJ
    beta: number; // DK
    volatility: number; // DL
    winRate: number; // DM
    maxDrawdown: number; // DN
    calmarRatio?: number; // Added Calmar Ratio
  };
  geinFactor: number; // DO (Generalized Entropy Index - a custom complexity metric)
  interactionMatrix: number[][]; // DP (Represents inter-component dependencies/influences)
  dataPointSensitivity: Record<string, number>; // DQ (How sensitive the algo is to specific data points)
  layerMetrics: Record<string, { gein: number; activation: number }>; // DR (Metrics for different layers/stages of the algorithm)
  executionPriority: 'low' | 'normal' | 'high' | 'critical' | 'quantum'; // DS
  computeProfile: 'cpu-bound' | 'memory-bound' | 'io-bound' | 'gpu-accelerated' | 'hybrid'; // DT - Added 'hybrid'
  dataSources: string[]; // DU
  dependencies: { name: string; version: string }[]; // DV
  permissions: string[]; // DW
  ownerTeam: string; // DX
  isAudited: boolean; // DY
  auditHistory: { date: string; auditor: string; result: 'pass' | 'fail' | 'partial' }[]; // DZ - Added 'partial'
  optimizationHistory?: { date: string; optimizer: string; version: number; performanceImprovement: number }[]; //E0
  isLocked?: boolean; // New: indicates if the algo is locked for editing
  deploymentHistory?: { date: string; version: number; status: 'deployed' | 'rolled_back' | 'failed' }[]; // New: deployment tracking
}

// Company: Backtest Pro, API Endpoint: /backtests/results, Use Case: Backtest Result Analysis, Feature: Equity Curve Visualization & Analysis - E
interface E_BacktestResult extends JBOIII.JBOBacktestResult {
  runId: string; // E1
  algorithmId: string; // E2
  algorithmVersion: number; // E3
  startDate: string; // E4
  endDate: string; // E5
  initialCapital: number; // E6
  finalCapital: number; // E7
  equityCurve: { date: string; value: number; aiForecast: number }[]; // E8
  metrics: {
    totalReturn: number; // E9
    sharpeRatio: number; // EA
    maxDrawdown: number; // EB
    trades: number; // EC
    profitFactor: number; // ED
    expectancy: number; // EE
    avgTradeReturn: number; // EF
    calmarRatio?: number; // Added for consistency with D_Algorithm
    sortinoRatio?: number; // Added for consistency with D_Algorithm
  };
  parametersSnapshot: C_AlgorithmParameter[]; // EG
  aiAnalysis: string; // EH
  tradeLog: { timestamp: string; type: 'buy' | 'sell' | 'hold'; asset: string; quantity: number; price: number; pnl: number }[]; // EI - Added 'hold'
  riskAdjustedReturn?: number; // EJ
  status: 'completed' | 'running' | 'failed' | 'queued'; // New: status of the backtest
  errorMessage?: string; // New: if backtest failed
}

// Company: User Profile Systems, API Endpoint: /users/profile, Use Case: User Profile Management, Feature: Customizable User Preferences & Settings - F
interface F_UserProfile extends JBOIII.JBOUserProfile {
  id: string; // F1
  name: string; // F2
  role: 'Administrator' | 'Trader' | 'Quant' | 'Observer' | 'Developer'; // F3 - Added 'Developer'
  clearanceLevel: number; // F4
  email: string; // F5
  preferences: {
    theme: 'light' | 'dark' | 'auto' | 'matrix' | 'nebula'; // F6 - Added 'nebula'
    notifications: 'all' | 'critical' | 'none'; // F7
    aiAssistanceLevel: 'minimal' | 'standard' | 'proactive' | 'autonomous'; // F8 - Added 'autonomous'
    defaultView: string; // F9
    timezone?: string; //FA
    currencySymbol?: string; // New: preferred currency symbol
  };
  apiKeys: { service: string; key: string; lastUsed: string; status: 'active' | 'revoked' | 'expired' }[]; // FB - Added status
  security: {
    twoFactorEnabled: boolean; // FC
    lastLogin: string; // FD
    loginHistory: { timestamp: string; ip: string; status: 'success' | 'failed' | 'pending' }[]; // FE - Added 'pending'
  };
  stats: {
    loginCount: number; // FF
    actionsPerformed: number; // FG
    uptime: string; // FH (e.g., "99.99%")
    pnlContribution: number; // FI
    algorithmsManaged?: number; // New: count of algorithms managed by user
  };
  permissions?: string[]; // FJ
  avatarUrl?: string; // New: user's avatar image URL
}

// --- The James Burvel O’Callaghan III Code: Data Utilities & Mocks ---
// Company: DataGen Dynamics, API Endpoint: /data/timeseries, Use Case: Simulated Time-Series Generation, Feature: Volatility Control & AI Forecasting - G
const G_generateTimeSeries = (points: number, startValue: number, volatility: number) => {
  const data = [];
  let currentValue = startValue;
  const now = new Date();
  for (let i = 0; i < points; i++) {
    const date = new Date(now.getTime() - (points - i) * 86400000).toISOString().split('T')[0];
    const change = (Math.random() - 0.5) * volatility;
    currentValue = currentValue * (1 + change);
    data.push({
      date,
      value: parseFloat(currentValue.toFixed(2)), // Ensure consistent precision
      aiForecast: parseFloat((currentValue * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2))
    });
  }
  return data;
};

// Company: AI Insights Corp., API Endpoint: /ai/insights, Use Case: AI Insight Display, Feature: Dynamic Insight Filtering and Categorization - H
const H_mockInsights: B_AIInsight[] = [
  { id: 'ins-1', timestamp: '2023-10-27 09:15:00', severity: 'high', category: 'market', message: 'Detected arbitrage opportunity in FOREX/CRYPTO bridge.', confidence: 0.98, actionable: true, relatedEntityId: 'algo-3', sourceModule: 'QuantArbEngine' },
  { id: 'ins-2', timestamp: '2023-10-27 09:30:00', severity: 'medium', category: 'optimization', message: 'Algorithm "Alpha-1" logic can be compressed by 15%. Suggest refactor.', confidence: 0.85, actionable: true, relatedEntityId: 'algo-1', sourceModule: 'CodeOptimizer' },
  { id: 'ins-3', timestamp: '2023-10-27 10:00:00', severity: 'low', category: 'system', message: 'Global latency reduced by 4ms via AI routing.', confidence: 0.99, actionable: false, sourceModule: 'NetworkAI' },
  { id: 'ins-4', timestamp: '2023-10-27 10:45:00', severity: 'critical', category: 'security', message: 'Anomalous login attempt blocked by Neural Firewall.', confidence: 0.99, actionable: false, sourceModule: 'NeuralFirewall' },
  { id: 'ins-5', timestamp: '2023-10-27 11:00:00', severity: 'medium', category: 'regulatory', message: 'New SEC filing detected for AAPL. Potential volatility increase.', confidence: 0.92, actionable: true, sourceModule: 'RegWatch' },
  { id: 'ins-6', timestamp: '2023-10-27 11:30:00', severity: 'low', category: 'data', message: 'Detected minor inconsistency in historical ETH/USD data feed.', confidence: 0.75, actionable: true, sourceModule: 'DataValidator' },
  { id: 'ins-7', timestamp: '2023-10-27 12:00:00', severity: 'high', category: 'market', message: 'Flash crash potential detected in JPY pairs due to geopolitical news.', confidence: 0.95, actionable: true, sourceModule: 'GeoPoliticalScanner' },
  { id: 'ins-8', timestamp: '2023-10-27 12:30:00', severity: 'medium', category: 'optimization', message: 'Backtest for algo-2 shows 5% higher Sharpe with adjusted parameters.', confidence: 0.89, actionable: true, relatedEntityId: 'algo-2', sourceModule: 'AutoParamTuner' },
];

// Company: AlgoGenesis, API Endpoint: /algorithms, Use Case: Algorithm Seed Data, Feature: Comprehensive Algorithm Initialization - I
const I_initialAlgorithms: D_Algorithm[] = [
  {
    id: 'algo-1',
    name: 'Quantum Momentum Scalper v4',
    description: 'High-frequency scalping strategy utilizing quantum-inspired principles for momentum prediction.',
    tags: ['HFT', 'Scalping', 'Momentum', 'Quantum'],
    code: '{"nodes":["Input: L2 Market Data Stream", "Filter: Volatility > 1.5", "AI Model: Quantum Trend Predictor", "Logic: If confidence > 0.95", "Action: Buy/Sell 100 units"]}',
    language: 'nocode',
    status: 'live',
    version: 4,
    lastModified: '2023-10-26',
    author: 'System Admin',
    riskLevel: 'high',
    aiScore: 94,
    parameters: [
      { name: 'Volatility Threshold', type: 'number', value: 1.5, range: [0.5, 5], description: 'Minimum volatility to activate trading.' },
      { name: 'Trade Size', type: 'number', value: 100, range: [10, 1000], description: 'Number of units per trade.' },
      { name: 'Execution Model', type: 'enum', value: 'aggressive', options: ['aggressive', 'passive', 'hybrid'], description: 'Strategy for order execution.' }
    ],
    deploymentTarget: 'cloud-cluster-a',
    performanceMetrics: { pnl: 125000, return: 45.2, sharpe: 2.1, sortino: 2.8, alpha: 0.15, beta: 0.8, volatility: 12.5, winRate: 68, maxDrawdown: -8.2, calmarRatio: 5.5 },
    geinFactor: 0.98,
    interactionMatrix: [[1, 0.2, -0.1], [0.2, 1, 0.5], [-0.1, 0.5, 1]],
    dataPointSensitivity: { 'L2.bid_price': 0.8, 'L2.ask_price': 0.8, 'volatility': 0.9 },
    layerMetrics: { 'input': { gein: 1.0, activation: 0.95 }, 'quantum_core': { gein: 0.99, activation: 0.98 }, 'output': { gein: 1.0, activation: 0.96 } },
    executionPriority: 'quantum',
    computeProfile: 'gpu-accelerated',
    dataSources: ['L2 Market Data Stream', 'Global News Feed API'],
    dependencies: [{ name: 'quantum-tensor-lib', version: '2.5.1' }],
    permissions: ['read:market_data', 'execute:trades'],
    ownerTeam: 'Quantum Core Team',
    isAudited: true,
    auditHistory: [{ date: '2023-09-15', auditor: 'Internal Security', result: 'pass' }],
    deploymentHistory: [{ date: '2023-10-26', version: 4, status: 'deployed' }]
  },
  {
    id: 'algo-2',
    name: 'Mean Reversion HFT (Neural)',
    description: 'Neural network-based strategy that capitalizes on short-term mean reversion in liquid assets.',
    tags: ['HFT', 'Mean Reversion', 'AI', 'Market Making'],
    code: '{"nodes":["Input: Order Book Depth", "AI: Sentiment Analysis (News Feeds)", "Logic: Spread > 0.02% AND Reversion Signal", "Action: Market Make (Bid/Ask)"]}',
    language: 'nocode',
    status: 'backtesting',
    version: 12,
    lastModified: '2023-10-27',
    author: 'AI Architect',
    riskLevel: 'medium',
    aiScore: 88,
    parameters: [
      { name: 'Spread Threshold', type: 'number', value: 0.02, range: [0.01, 0.1], description: 'Minimum bid-ask spread to engage.' },
      { name: 'Sentiment Weight', type: 'number', value: 0.3, range: [0, 1], description: 'Influence of news sentiment on trade logic.' },
      { name: 'Max Position Size', type: 'number', value: 500, range: [100, 5000], description: 'Maximum position size per asset.' }
    ],
    deploymentTarget: 'edge-node-tokyo',
    performanceMetrics: { pnl: 45000, return: 12.5, sharpe: 1.8, sortino: 1.9, alpha: 0.05, beta: 0.2, volatility: 4.2, winRate: 55, maxDrawdown: -4.1, calmarRatio: 3.0 },
    geinFactor: 0.85,
    interactionMatrix: [[1, 0.7], [0.7, 1]],
    dataPointSensitivity: { 'spread': 0.9, 'sentiment': 0.6 },
    layerMetrics: { 'input': { gein: 1.0, activation: 0.9 }, 'neural_net': { gein: 0.8, activation: 0.92 }, 'output': { gein: 1.0, activation: 0.88 } },
    executionPriority: 'high',
    computeProfile: 'cpu-bound',
    dataSources: ['Order Book Depth', 'News Feeds'],
    dependencies: [{ name: 'sentiment-analyzer', version: '4.2.0' }],
    permissions: ['read:market_data', 'execute:trades'],
    ownerTeam: 'AI Research',
    isAudited: true,
    auditHistory: [{ date: '2023-08-20', auditor: 'External Audit Co.', result: 'pass' }]
  },
  {
    id: 'algo-3',
    name: 'Global Macro Arbitrage',
    description: 'Long-term strategy identifying and exploiting price discrepancies between correlated global assets.',
    tags: ['Macro', 'Arbitrage', 'Global', 'Low-Risk'],
    code: '{"nodes":["Input: Global Indices (S&P, FTSE, NIKKEI)", "Input: Forex Rates (USD, EUR, JPY)", "Logic: Correlation Divergence > 2-sigma", "Action: Hedge Pair Trade"]}',
    language: 'nocode',
    status: 'draft',
    version: 1,
    lastModified: '2023-10-27',
    author: 'User',
    riskLevel: 'low',
    aiScore: 72,
    parameters: [
      { name: 'Correlation Window', type: 'number', value: 90, range: [30, 365], description: 'Lookback period for correlation calculation (days).' },
      { name: 'Sigma Threshold', type: 'number', value: 2, range: [1, 3], description: 'Standard deviation for divergence signal.' },
      { name: 'Hedging Instrument', type: 'string', value: 'futures', description: 'Instrument used for hedging positions.' }
    ],
    deploymentTarget: 'quantum-fabric-1',
    geinFactor: 0.7,
    interactionMatrix: [[1, 0.85, 0.7], [0.85, 1, 0.75], [0.7, 0.75, 1]],
    dataPointSensitivity: { 'correlation_divergence': 0.95 },
    layerMetrics: { 'input': { gein: 1.0, activation: 0.99 }, 'logic': { gein: 0.9, activation: 0.9 }, 'output': { gein: 1.0, activation: 0.92 } },
    executionPriority: 'normal',
    computeProfile: 'memory-bound',
    dataSources: ['Global Indices API', 'Forex Rates API'],
    dependencies: [],
    permissions: ['read:market_data', 'execute:trades'],
    ownerTeam: 'Macro Analysis Desk',
    isAudited: false,
    auditHistory: []
  },
];

// Company: User Data Solutions, API Endpoint: /users/profile, Use Case: User Profile Initialization, Feature: Default User Profile Creation - J
const J_mockUserProfile: F_UserProfile = {
  id: 'u-001',
  name: 'Trader',
  role: 'Administrator',
  clearanceLevel: 5,
  email: 'admin@local',
  preferences: { theme: 'dark', notifications: 'all', aiAssistanceLevel: 'proactive', defaultView: 'Executive Dashboard', timezone: 'America/New_York', currencySymbol: '$' },
  apiKeys: [{ service: 'Binance', key: 'bin_..._xyz', lastUsed: '2023-10-27 10:30:00', status: 'active' }],
  security: {
    twoFactorEnabled: true,
    lastLogin: '2023-10-27 09:00:00',
    loginHistory: [{ timestamp: '2023-10-27 09:00:00', ip: '127.0.0.1', status: 'success' }]
  },
  stats: { loginCount: 1420, actionsPerformed: 54300, uptime: '99.99%', pnlContribution: 170000, algorithmsManaged: 3 },
  permissions: ['read:all_data', 'execute:trades', 'admin:system'],
  avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Trader'
};

// --- The James Burvel O’Callaghan III Code: Expanded UI Components ---
// Company: UI Elements Inc., API Endpoint: /ui/button, Use Case: Consistent Button Rendering, Feature: Advanced Button Styling and State Management - K
interface K_ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ElementType;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'link' | 'outline'; // Added 'outline'
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  styleOverrides?: React.CSSProperties;
}

const K_Button: React.FC<K_ButtonProps> = ({ icon: Icon, children, onClick, variant = 'primary', disabled = false, className = '', size = 'md', styleOverrides = {}, ...props }) => {
  const baseClasses = "flex items-center justify-center space-x-2 rounded-lg text-sm transition duration-200 ease-in-out font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  let colorClasses = "";

  switch (variant) {
    case 'primary': colorClasses = "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"; break;
    case 'secondary': colorClasses = "bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600 focus:ring-indigo-500 disabled:bg-gray-800 disabled:text-gray-500"; break;
    case 'danger': colorClasses = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"; break;
    case 'success': colorClasses = "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:cursor-not-allowed"; break;
    case 'ghost': colorClasses = "bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white disabled:text-gray-600 shadow-none disabled:cursor-not-allowed"; break;
    case 'link': colorClasses = "bg-transparent text-indigo-500 hover:text-indigo-700 disabled:text-gray-500 shadow-none disabled:cursor-not-allowed"; break;
    case 'outline': colorClasses = "border border-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-indigo-500 disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"; break;
  }

  const mergedStyles = { ...styleOverrides };

  return (
    <button className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${colorClasses} ${className}`} onClick={onClick} disabled={disabled} style={mergedStyles} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {children && <span>{children}</span>}
    </button>
  );
};

// Company: UI Elements Inc., API Endpoint: /ui/card, Use Case: Flexible Card Layout, Feature: Advanced Card Content and Action Integration - L
interface L_CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  noPadding?: boolean;
  headerClassName?: string;
  footer?: React.ReactNode;
}

const L_Card: React.FC<L_CardProps> = ({ title, subtitle, children, className = '', actions = null, noPadding = false, headerClassName = '', footer = null }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-xl border border-gray-700 flex flex-col ${className}`}>
    {(title || actions || subtitle) && (
      <div className={`px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/30 rounded-t-xl ${headerClassName}`}>
        <div>
          {title && (typeof title === 'string' ? <h3 className="text-lg font-bold text-gray-100">{title}</h3> : title)}
          {subtitle && (typeof subtitle === 'string' ? <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p> : subtitle)}
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    )}
    <div className={`${noPadding ? '' : 'p-6'} flex-grow overflow-auto custom-scrollbar`}>
      {children}
    </div>
    {footer && (
      <div className="px-6 py-3 border-t border-gray-700 bg-gray-900/30 rounded-b-xl">
        {footer}
      </div>
    )}
  </div>
);

// Company: UI Elements Inc., API Endpoint: /ui/badge, Use Case: Status Badges, Feature: Customizable Badge Variants and Colors - M
const M_StatusBadge = ({ color, children }: { color: 'green' | 'yellow' | 'gray' | 'red' | 'blue' | 'purple', children: React.ReactNode }) => {
    let variant: "default" | "secondary" | "destructive" | "outline" | "live" = "default";
    switch(color) {
        case 'green': variant = "live"; break; // Using 'live' for success/green
        case 'yellow': variant = "secondary"; break;
        case 'gray': variant = "outline"; break;
        case 'red': variant = 'destructive'; break;
        case 'blue': variant = "default"; break; // 'default' could be blue or similar
        case 'purple': variant = "default"; break; // Could introduce a new variant if needed
        default: variant = "default"; break;
    }

    return <Badge variant={variant} className={`
      ${color === 'green' && 'bg-emerald-500 text-emerald-50 hover:bg-emerald-600'}
      ${color === 'yellow' && 'bg-yellow-500 text-yellow-50 hover:bg-yellow-600'}
      ${color === 'gray' && 'bg-gray-600 text-gray-200 hover:bg-gray-700 border-gray-500'}
      ${color === 'red' && 'bg-red-500 text-red-50 hover:bg-red-600'}
      ${color === 'blue' && 'bg-blue-500 text-blue-50 hover:bg-blue-600'}
      ${color === 'purple' && 'bg-purple-500 text-purple-50 hover:bg-purple-600'}
    `}>{children}</Badge>;
};

// Company: UI Elements Inc., API Endpoint: /ui/progressbar, Use Case: Progress Bar Display, Feature: Animated Progress Bar with Dynamic Labels - N
interface N_ProgressBarProps {
  value: number;
  max?: number;
  color?: 'indigo' | 'green' | 'red' | 'yellow' | 'blue' | 'purple'; // Extended color options
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

const N_ProgressBar: React.FC<N_ProgressBarProps> = ({ value, max = 100, color = 'indigo', label, showPercentage = true, className = '' }) => {
  const percentage = Math.round((value / max) * 100);

  let gradientColorClasses = '';
  switch (color) {
    case 'indigo': gradientColorClasses = 'from-indigo-500 to-indigo-400'; break;
    case 'green': gradientColorClasses = 'from-emerald-500 to-emerald-400'; break;
    case 'red': gradientColorClasses = 'from-red-500 to-red-400'; break;
    case 'yellow': gradientColorClasses = 'from-yellow-500 to-yellow-400'; break;
    case 'blue': gradientColorClasses = 'from-blue-500 to-blue-400'; break;
    case 'purple': gradientColorClasses = 'from-purple-500 to-purple-400'; break;
    default: gradientColorClasses = 'from-indigo-500 to-indigo-400'; break;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1">
        {label && <span className="text-xs font-medium text-gray-300">{label}</span>}
        {showPercentage && <span className="text-xs font-medium text-gray-400">{percentage}%</span>}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${gradientColorClasses}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

// Company: UI Elements Inc., API Endpoint: /ui/input, Use Case: Form Input Fields, Feature: Input Field Styling and Error Handling - O
interface O_InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  description?: string;
}

const O_Input: React.FC<O_InputProps> = ({ label, type = 'text', value, onChange, placeholder, name, error, onBlur, description, ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
    {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onBlur={onBlur}
      className={`w-full bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// Company: UI Elements Inc., API Endpoint: /ui/select, Use Case: Select Input Fields, Feature: Select Field Styling and Option Groups - P
interface P_SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  name: string;
  error?: string;
  description?: string;
}

const P_Select: React.FC<P_SelectProps> = ({ label, value, onChange, children, name, error, description, ...props }) => (
  <div className="mb-4">
    {label && <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
    {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// Company: UI Elements Inc., API Endpoint: /ui/tabs, Use Case: Tabbed Navigation, Feature: Dynamic Tab Rendering and Active State Management - Q
interface Q_TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

const Q_Tabs: React.FC<Q_TabsProps> = ({ tabs, activeTab, setActiveTab, className = '' }) => (
  <div className={`border-b border-gray-700 overflow-hidden ${className}`}>
    <div className="overflow-x-auto custom-scrollbar">
      <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${
              tab === activeTab
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

// --- The James Burvel O’Callaghan III Code: Dashboard Widgets & Views ---
// Company: QuantumLeap Analytics, API Endpoint: /dashboard/aistatus, Use Case: Real-time AI System Overview, Feature: Dynamic Status Indicators and Process Monitoring - R
const R_AIStatusMonitor: React.FC = () => {
  const stats: A_SystemMetric[] = useMemo(() => [
    { id: 'sm-1', label: 'Quantum Core Load', value: 78, unit: '%', trend: 'up', change: 2.3, aiPrediction: 80, subMetrics: [{ label: 'CPU Usage', value: '85%' }, { label: 'Memory', value: '60%' }], max: 100, timestamp: new Date().toISOString() },
    { id: 'sm-2', label: 'Global Latency', value: 8, unit: 'ms', trend: 'down', change: -1.1, aiPrediction: 6, subMetrics: [{ label: 'Network', value: '7ms' }, { label: 'Processing', value: '1ms' }], max: 50, timestamp: new Date().toISOString() },
    { id: 'sm-3', label: 'Predictive Accuracy', value: 98.2, unit: '%', trend: 'up', change: 0.5, aiPrediction: 98.7, max: 100, timestamp: new Date().toISOString() },
    { id: 'sm-4', label: 'Neural Firewall Threat', value: 2, unit: '%', trend: 'up', change: 0.1, aiPrediction: 3, max: 100, timestamp: new Date().toISOString() },
    { id: 'sm-5', label: 'Data Ingestion Rate', value: 1200, unit: 'TPS', trend: 'up', change: 50, aiPrediction: 1300, max: 2000, timestamp: new Date().toISOString() },
  ], []); // Depend on nothing to make it constant mock, or add refresh logic

  const activeProcesses = useMemo(() => [
    { name: 'Market Sentiment Analysis', pid: 2000, status: 'OK', icon: BrainCircuit, color: 'text-cyan-400' },
    { name: 'Risk Vector Calculation', pid: 2015, status: 'OK', icon: Atom, color: 'text-purple-400' },
    { name: 'Liquidity Optimization', pid: 2030, status: 'OK', icon: TrendingUp, color: 'text-emerald-400' },
    { name: 'User Behavior Modeling', pid: 2045, status: 'OK', icon: Users, color: 'text-yellow-400' },
    { name: 'Regulatory Compliance Scan', pid: 2060, status: 'OK', icon: Scale, color: 'text-red-400' }
  ], []);

  return (
    <L_Card title="AI System Status" subtitle="Real-time Quantum Core Monitoring" headerClassName="bg-gray-900/70" className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.id}>
            <N_ProgressBar
              label={stat.label}
              value={stat.value}
              max={stat.max}
              color={stat.trend === 'up' ? 'green' : stat.trend === 'down' ? 'red' : 'indigo'}
            />
            {stat.subMetrics && (
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                {stat.subMetrics.map((sm, i) => <div key={i}> {sm.label}: {sm.value}</div>)}
              </div>
            )}
            <div className="flex items-center text-xs text-gray-500 mt-1">
              {stat.trend === 'up' && <ChevronUp className="w-3 h-3 text-emerald-400 mr-1" />}
              {stat.trend === 'down' && <ChevronDown className="w-3 h-3 text-red-400 mr-1" />}
              {stat.trend === 'stable' && <Repeat className="w-3 h-3 text-indigo-400 mr-1 rotate-90" />}
              {stat.change > 0 ? `+${stat.change}` : stat.change}% ({stat.unit})
              <span className="ml-2 text-gray-600">AI: {stat.aiPrediction}{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Active AI Processes</h4>
        <div className="space-y-2 text-sm font-mono">
          {activeProcesses.map((proc, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded border border-gray-700">
              <span className={`flex items-center ${proc.color}`}><proc.icon className="w-4 h-4 mr-2"/>{proc.name} [PID: {proc.pid}]</span>
              <span className="text-gray-500">{proc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </L_Card>
  );
};

// Company: Global Market Insights, API Endpoint: /market/pulse, Use Case: Market Trend Analysis, Feature: Real-time Market Data Display and Sentiment Analysis - S
interface S_MarketData {
  name: string;
  price: string;
  change: string;
  sentiment: 'Bullish' | 'Very Bullish' | 'Neutral' | 'Bearish' | 'Very Bearish';
  volatility: 'Low' | 'Medium' | 'High' | 'Extreme';
  id: string;
  icon: React.ElementType; // Icon for the market
}

const S_GlobalMarketPulse: React.FC = () => {
  const markets: S_MarketData[] = useMemo(() => [
    { name: 'S&P 500', price: '4,120.50', change: '+0.45%', sentiment: 'Bullish', volatility: 'Low', id: 'm-1', icon: TrendingUp },
    { name: 'BTC/USD', price: '64,230.00', change: '+2.10%', sentiment: 'Very Bullish', volatility: 'High', id: 'm-2', icon: Atom },
    { name: 'EUR/USD', price: '1.0850', change: '-0.12%', sentiment: 'Neutral', volatility: 'Low', id: 'm-3', icon: Globe },
    { name: 'Gold', price: '1,980.20', change: '+0.80%', sentiment: 'Bullish', volatility: 'Medium', id: 'm-4', icon: DollarSign },
    { name: 'Crude Oil', price: '78.40', change: '-1.20%', sentiment: 'Bearish', volatility: 'Medium', id: 'm-5', icon: Wheat },
    { name: '10Y Treasury', price: '4.50%', change: '+0.02%', sentiment: 'Neutral', volatility: 'Low', id: 'm-6', icon: Receipt },
    { name: 'NASDAQ 100', price: '13,500.15', change: '+1.10%', sentiment: 'Bullish', volatility: 'Medium', id: 'm-7', icon: Rocket },
    { name: 'AAPL', price: '175.30', change: '-0.55%', sentiment: 'Neutral', volatility: 'Medium', id: 'm-8', icon: PieChart },
  ], []);

  const getSentimentColor = (sentiment: S_MarketData['sentiment']) => {
    switch (sentiment) {
      case 'Very Bullish': return 'text-emerald-400';
      case 'Bullish': return 'text-emerald-300';
      case 'Neutral': return 'text-gray-400';
      case 'Bearish': return 'text-red-300';
      case 'Very Bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getVolatilityBadgeColor = (volatility: S_MarketData['volatility']) => {
    switch (volatility) {
      case 'Low': return 'green';
      case 'Medium': return 'yellow';
      case 'High': return 'red';
      case 'Extreme': return 'purple'; // Using purple for extreme
      default: return 'gray';
    }
  };

  return (
    <L_Card title="Global Market Pulse" subtitle="Real-time Trends & Sentiment Analysis" headerClassName="bg-gray-900/70" className="h-full">
      <div className="space-y-4">
        {markets.map((market) => (
          <div key={market.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-200">
            <div className="flex items-center">
              <market.icon className="w-5 h-5 text-indigo-400 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-100">{market.name}</h4>
                <p className="text-sm text-gray-400">{market.price} <span className={`ml-2 ${market.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{market.change}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-xs font-medium ${getSentimentColor(market.sentiment)}`}>{market.sentiment}</span>
              <M_StatusBadge color={getVolatilityBadgeColor(market.volatility)}>{market.volatility}</M_StatusBadge>
            </div>
          </div>
        ))}
      </div>
    </L_Card>
  );
};

// Company: AI Insights Corp., API Endpoint: /ai/insights, Use Case: AI Insight Display, Feature: Dynamic Insight Filtering and Categorization - T
const T_AIInsightsFeed: React.FC = () => {
  const [insights, setInsights] = useState<B_AIInsight[]>(H_mockInsights);
  const [filterSeverity, setFilterSeverity] = useState<'all' | B_AIInsight['severity']>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | B_AIInsight['category']>('all');
  const [filterActionable, setFilterActionable] = useState<'all' | 'true' | 'false'>('all');

  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      const severityMatch = filterSeverity === 'all' || insight.severity === filterSeverity;
      const categoryMatch = filterCategory === 'all' || insight.category === filterCategory;
      const actionableMatch = filterActionable === 'all' || insight.actionable.toString() === filterActionable;
      return severityMatch && categoryMatch && actionableMatch;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [insights, filterSeverity, filterCategory, filterActionable]);

  const getSeverityColor = (severity: B_AIInsight['severity']) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: B_AIInsight['category']) => {
    switch (category) {
      case 'market': return TrendingUp;
      case 'system': return Server;
      case 'security': return Shield;
      case 'optimization': return SlidersHorizontal;
      case 'regulatory': return Scale;
      case 'data': return Database;
      default: return Info;
    }
  };

  const allCategories = useMemo(() => {
    const categories = new Set<B_AIInsight['category']>();
    H_mockInsights.forEach(insight => categories.add(insight.category));
    return ['all', ...Array.from(categories)].sort();
  }, []);

  const allSeverities = useMemo(() => {
    const severities = new Set<B_AIInsight['severity']>();
    H_mockInsights.forEach(insight => severities.add(insight.severity));
    return ['all', ...Array.from(severities)].sort((a, b) => {
      const order = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2, 'all': 1 };
      return (order[b] || 0) - (order[a] || 0);
    });
  }, []);


  return (
    <L_Card
      title="AI Insights Feed"
      subtitle="Proactive Alerts & Actionable Intelligence"
      actions={
        <K_Button variant="ghost" icon={RefreshCw} onClick={() => setInsights(H_mockInsights)}>
          Refresh
        </K_Button>
      }
      headerClassName="bg-gray-900/70"
      className="h-full"
    >
      <div className="flex flex-wrap gap-4 mb-6">
        <P_Select
          name="filterSeverity"
          label="Severity"
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value as 'all' | B_AIInsight['severity'])}
          className="flex-grow min-w-[120px]"
        >
          {allSeverities.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </P_Select>

        <P_Select
          name="filterCategory"
          label="Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as 'all' | B_AIInsight['category'])}
          className="flex-grow min-w-[120px]"
        >
          {allCategories.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </P_Select>

        <P_Select
          name="filterActionable"
          label="Actionable"
          value={filterActionable}
          onChange={(e) => setFilterActionable(e.target.value as 'all' | 'true' | 'false')}
          className="flex-grow min-w-[120px]"
        >
          <option value="all">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </P_Select>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => {
            const InsightIcon = getCategoryIcon(insight.category);
            return (
              <div key={insight.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 relative group hover:border-indigo-500 transition-all duration-200">
                <div className="flex items-start">
                  <InsightIcon className="w-5 h-5 text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-gray-100">{insight.message}</h4>
                      <M_StatusBadge color={getSeverityColor(insight.severity)}>{insight.severity.toUpperCase()}</M_StatusBadge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      <span className="font-mono text-gray-500 mr-2">{insight.sourceModule || 'System'}</span>
                      {new Date(insight.timestamp).toLocaleString()}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {insight.actionable && (
                        <Badge variant="live" className="bg-emerald-600">Actionable</Badge>
                      )}
                      <Badge variant="secondary">Confidence: {(insight.confidence * 100).toFixed(0)}%</Badge>
                      {insight.relatedEntityId && (
                        <Badge variant="outline">Related: {insight.relatedEntityId}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500">
            No insights found for the selected filters.
          </div>
        )}
      </div>
    </L_Card>
  );
};

// Company: Algorithmics Inc., API Endpoint: /algorithms, Use Case: Algorithm Management, Feature: CRUD Operations & Live Status Display - U
const U_AlgorithmManager: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<D_Algorithm[]>(I_initialAlgorithms);
  const [selectedAlgo, setSelectedAlgo] = useState<D_Algorithm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Parameters', 'Code', 'Metrics', 'History'

  const [formState, setFormState] = useState<D_Algorithm>({
    id: '',
    name: '',
    description: '',
    tags: [],
    code: '',
    language: 'nocode',
    status: 'draft',
    version: 1,
    lastModified: '',
    author: J_mockUserProfile.name,
    riskLevel: 'medium',
    aiScore: 0,
    parameters: [],
    deploymentTarget: 'cloud-cluster-a',
    geinFactor: 0,
    interactionMatrix: [],
    dataPointSensitivity: {},
    layerMetrics: {},
    executionPriority: 'normal',
    computeProfile: 'cpu-bound',
    dataSources: [],
    dependencies: [],
    permissions: [],
    ownerTeam: J_mockUserProfile.ownerTeam || 'Unknown', // Use user's team or default
    isAudited: false,
    auditHistory: [],
    // Initialize optional fields for creation
    performanceMetrics: undefined,
    optimizationHistory: undefined,
    isLocked: false,
    deploymentHistory: []
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const algorithmStatusColors: Record<D_Algorithm['status'], 'green' | 'yellow' | 'gray' | 'red' | 'blue' | 'purple'> = {
    live: 'green',
    backtesting: 'yellow',
    draft: 'gray',
    error: 'red',
    optimizing: 'blue',
    archived: 'gray',
    paused: 'purple',
  };

  const riskLevelColors: Record<D_Algorithm['riskLevel'], 'green' | 'yellow' | 'gray' | 'red' | 'blue' | 'purple'> = {
    low: 'green',
    medium: 'yellow',
    high: 'red',
    extreme: 'purple',
  };

  const handleSelectAlgo = useCallback((algo: D_Algorithm) => {
    setSelectedAlgo(algo);
    setFormState(algo); // Load into form for potential editing
    setIsEditing(false);
    setIsCreating(false);
    setActiveTab('Overview');
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  }, []);

  const handleArrayInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof D_Algorithm) => {
    const { value } = e.target;
    setFormState(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  }, []);

  const handleParameterChange = useCallback((index: number, field: keyof C_AlgorithmParameter, value: any) => {
    setFormState(prev => {
      const newParameters = [...prev.parameters];
      if (newParameters[index]) {
        newParameters[index] = {
          ...newParameters[index],
          [field]: value,
        };
        // Type coercion for value based on type field
        if (field === 'type') {
          newParameters[index].value = (() => {
            switch (value) {
              case 'number': return 0;
              case 'boolean': return false;
              case 'string': return '';
              case 'enum': return ''; // Default for enum
              default: return newParameters[index].value;
            }
          })();
        } else if (field === 'value') {
          if (newParameters[index].type === 'number') {
            newParameters[index].value = parseFloat(value);
          } else if (newParameters[index].type === 'boolean') {
            newParameters[index].value = value === 'true';
          }
        }
      }
      return { ...prev, parameters: newParameters };
    });
  }, []);

  const handleAddParameter = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      parameters: [...prev.parameters, { name: '', type: 'string', value: '', description: '' }]
    }));
  }, []);

  const handleRemoveParameter = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  }, []);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!formState.name.trim()) errors.name = 'Algorithm name is required.';
    if (!formState.description.trim()) errors.description = 'Description is required.';
    if (!formState.code.trim()) errors.code = 'Code or No-Code JSON is required.';
    if (formState.aiScore < 0 || formState.aiScore > 100) errors.aiScore = 'AI Score must be between 0 and 100.';
    if (formState.parameters.some(p => !p.name.trim())) errors.parameters = 'All parameter names must be filled.';
    if (formState.parameters.some(p => p.type === 'number' && typeof p.value !== 'number' && !isNaN(parseFloat(p.value)))) errors.parameters = 'Number parameter values must be valid numbers.';
    if (formState.tags.length === 0) errors.tags = 'At least one tag is required.';
    if (formState.dataSources.length === 0) errors.dataSources = 'At least one data source is required.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formState]);

  const handleSave = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setAlgorithms(prev => {
      if (isCreating) {
        const newAlgo = {
          ...formState,
          id: `algo-${(prev.length + 1).toString().padStart(3, '0')}`, // Simple ID generation
          lastModified: new Date().toISOString().split('T')[0],
          version: 1,
        };
        setSelectedAlgo(newAlgo);
        setIsCreating(false);
        setIsEditing(false);
        return [...prev, newAlgo];
      } else if (selectedAlgo) {
        const updatedAlgo = {
          ...formState,
          lastModified: new Date().toISOString().split('T')[0],
          version: selectedAlgo.version + 1, // Increment version on save
        };
        setSelectedAlgo(updatedAlgo);
        setIsEditing(false);
        return prev.map(algo => algo.id === updatedAlgo.id ? updatedAlgo : algo);
      }
      return prev;
    });
  }, [formState, isCreating, selectedAlgo, validateForm]);

  const handleDelete = useCallback(() => {
    if (selectedAlgo && window.confirm(`Are you sure you want to delete algorithm "${selectedAlgo.name}"?`)) {
      setAlgorithms(prev => prev.filter(algo => algo.id !== selectedAlgo.id));
      setSelectedAlgo(null);
      setIsEditing(false);
      setIsCreating(false);
    }
  }, [selectedAlgo]);

  const handleNewAlgorithm = useCallback(() => {
    setSelectedAlgo(null);
    setIsEditing(true);
    setIsCreating(true);
    setActiveTab('Overview');
    setFormState({
      id: '', // Will be generated on save
      name: '',
      description: '',
      tags: [],
      code: '',
      language: 'nocode',
      status: 'draft',
      version: 1,
      lastModified: new Date().toISOString().split('T')[0],
      author: J_mockUserProfile.name,
      riskLevel: 'medium',
      aiScore: 50,
      parameters: [],
      deploymentTarget: 'cloud-cluster-a',
      geinFactor: 0.5,
      interactionMatrix: [],
      dataPointSensitivity: {},
      layerMetrics: {},
      executionPriority: 'normal',
      computeProfile: 'cpu-bound',
      dataSources: [],
      dependencies: [],
      permissions: [],
      ownerTeam: J_mockUserProfile.ownerTeam || 'Unknown',
      isAudited: false,
      auditHistory: [],
      performanceMetrics: undefined,
      optimizationHistory: undefined,
      isLocked: false,
      deploymentHistory: []
    });
    setValidationErrors({});
  }, []);

  const handleCancel = useCallback(() => {
    if (selectedAlgo && !isCreating) {
      setFormState(selectedAlgo); // Revert to selected algo's state
    } else {
      setFormState({ // Reset to initial empty form for new algo
        id: '',
        name: '',
        description: '',
        tags: [],
        code: '',
        language: 'nocode',
        status: 'draft',
        version: 1,
        lastModified: '',
        author: J_mockUserProfile.name,
        riskLevel: 'medium',
        aiScore: 0,
        parameters: [],
        deploymentTarget: 'cloud-cluster-a',
        geinFactor: 0,
        interactionMatrix: [],
        dataPointSensitivity: {},
        layerMetrics: {},
        executionPriority: 'normal',
        computeProfile: 'cpu-bound',
        dataSources: [],
        dependencies: [],
        permissions: [],
        ownerTeam: J_mockUserProfile.ownerTeam || 'Unknown',
        isAudited: false,
        auditHistory: [],
        performanceMetrics: undefined,
        optimizationHistory: undefined,
        isLocked: false,
        deploymentHistory: []
      });
    }
    setIsEditing(false);
    setIsCreating(false);
    setValidationErrors({});
  }, [selectedAlgo, isCreating]);

  const renderParameters = useMemo(() => (
    <div className="space-y-4">
      {formState.parameters.map((param, index) => (
        <L_Card key={index} className="!p-4 bg-gray-900/50" noPadding>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="text-md font-semibold text-gray-200">Parameter {index + 1}</h5>
              <K_Button variant="danger" size="sm" icon={X} onClick={() => handleRemoveParameter(index)}>Remove</K_Button>
            </div>
            <O_Input
              label="Name"
              name={`param-name-${index}`}
              value={param.name}
              onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
              error={validationErrors.parameters && !param.name.trim() ? 'Name required' : undefined}
              disabled={!isEditing}
            />
            <P_Select
              label="Type"
              name={`param-type-${index}`}
              value={param.type}
              onChange={(e) => handleParameterChange(index, 'type', e.target.value as C_AlgorithmParameter['type'])}
              disabled={!isEditing}
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="enum">Enum</option>
            </P_Select>

            {param.type === 'enum' ? (
              <P_Select
                label="Value"
                name={`param-value-${index}`}
                value={param.value}
                onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                disabled={!isEditing}
              >
                {param.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
                {(!param.options || param.options.length === 0) && (
                  <option value="" disabled>No options defined</option>
                )}
              </P_Select>
            ) : param.type === 'boolean' ? (
              <P_Select
                label="Value"
                name={`param-value-${index}`}
                value={param.value.toString()} // Convert boolean to string for select
                onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                disabled={!isEditing}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </P_Select>
            ) : (
              <O_Input
                label="Value"
                name={`param-value-${index}`}
                type={param.type === 'number' ? 'number' : 'text'}
                value={param.value}
                onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                error={validationErrors.parameters && (param.type === 'number' && isNaN(parseFloat(param.value))) ? 'Invalid number' : undefined}
                disabled={!isEditing}
              />
            )}

            <O_Input
              label="Description"
              name={`param-description-${index}`}
              value={param.description}
              onChange={(e) => handleParameterChange(index, 'description', e.target.value)}
              disabled={!isEditing}
            />
            {param.type === 'number' && (
              <div className="flex gap-4">
                <O_Input
                  label="Min Range"
                  type="number"
                  value={param.range?.[0] ?? ''}
                  onChange={(e) => handleParameterChange(index, 'range', [parseFloat(e.target.value), param.range?.[1]])}
                  disabled={!isEditing}
                />
                <O_Input
                  label="Max Range"
                  type="number"
                  value={param.range?.[1] ?? ''}
                  onChange={(e) => handleParameterChange(index, 'range', [param.range?.[0], parseFloat(e.target.value)])}
                  disabled={!isEditing}
                />
              </div>
            )}
            {param.type === 'enum' && (
              <O_Input
                label="Options (comma-separated)"
                value={param.options?.join(', ') || ''}
                onChange={(e) => handleParameterChange(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                disabled={!isEditing}
              />
            )}
            {param.type === 'string' && (
              <O_Input
                label="Validation Regex"
                value={param.validationRegex || ''}
                onChange={(e) => handleParameterChange(index, 'validationRegex', e.target.value)}
                disabled={!isEditing}
              />
            )}
          </div>
        </L_Card>
      ))}
      {isEditing && (
        <K_Button variant="secondary" icon={Plus} onClick={handleAddParameter} className="w-full">
          Add Parameter
        </K_Button>
      )}
    </div>
  ), [formState.parameters, handleParameterChange, handleRemoveParameter, handleAddParameter, isEditing, validationErrors]);


  const renderOverview = useMemo(() => (
    <form onSubmit={handleSave} className="space-y-6">
      <O_Input
        label="Algorithm Name"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
        error={validationErrors.name}
        disabled={!isEditing}
      />
      <O_Input
        label="Description"
        name="description"
        value={formState.description}
        onChange={handleInputChange}
        type="textarea" // Changed to textarea for multiline input
        error={validationErrors.description}
        disabled={!isEditing}
      />
      <O_Input
        label="Tags (comma-separated)"
        name="tags"
        value={formState.tags.join(', ')}
        onChange={(e) => handleArrayInputChange(e, 'tags')}
        error={validationErrors.tags}
        disabled={!isEditing}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <P_Select
          label="Language"
          name="language"
          value={formState.language}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          <option value="nocode">No-Code (JSON)</option>
          <option value="python">Python</option>
          <option value="rust">Rust</option>
          <option value="javascript">JavaScript</option>
        </P_Select>

        <P_Select
          label="Status"
          name="status"
          value={formState.status}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          {Object.keys(algorithmStatusColors).map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </P_Select>

        <P_Select
          label="Risk Level"
          name="riskLevel"
          value={formState.riskLevel}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          {Object.keys(riskLevelColors).map(risk => (
            <option key={risk} value={risk}>
              {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </option>
          ))}
        </P_Select>

        <O_Input
          label="AI Score (0-100)"
          name="aiScore"
          type="number"
          value={formState.aiScore}
          onChange={handleInputChange}
          error={validationErrors.aiScore}
          disabled={!isEditing}
          min={0}
          max={100}
        />

        <P_Select
          label="Deployment Target"
          name="deploymentTarget"
          value={formState.deploymentTarget}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          <option value="cloud-cluster-a">Cloud Cluster A</option>
          <option value="edge-node-tokyo">Edge Node Tokyo</option>
          <option value="quantum-fabric-1">Quantum Fabric 1</option>
          <option value="local-dev">Local Development</option>
        </P_Select>

        <P_Select
          label="Execution Priority"
          name="executionPriority"
          value={formState.executionPriority}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
          <option value="quantum">Quantum</option>
        </P_Select>

        <P_Select
          label="Compute Profile"
          name="computeProfile"
          value={formState.computeProfile}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          <option value="cpu-bound">CPU-Bound</option>
          <option value="memory-bound">Memory-Bound</option>
          <option value="io-bound">IO-Bound</option>
          <option value="gpu-accelerated">GPU-Accelerated</option>
          <option value="hybrid">Hybrid</option>
        </P_Select>

        <O_Input
          label="Owner Team"
          name="ownerTeam"
          value={formState.ownerTeam}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>

      <O_Input
        label="Data Sources (comma-separated)"
        name="dataSources"
        value={formState.dataSources.join(', ')}
        onChange={(e) => handleArrayInputChange(e, 'dataSources')}
        error={validationErrors.dataSources}
        disabled={!isEditing}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAudited"
          name="isAudited"
          checked={formState.isAudited}
          onChange={(e) => setFormState(prev => ({ ...prev, isAudited: e.target.checked }))}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out bg-gray-900 border-gray-600 rounded"
          disabled={!isEditing}
        />
        <label htmlFor="isAudited" className="text-sm font-medium text-gray-300">Is Audited?</label>
      </div>

      {(isEditing || isCreating) && (
        <div className="flex justify-end space-x-3 mt-6">
          <K_Button type="button" variant="secondary" onClick={handleCancel}>Cancel</K_Button>
          <K_Button type="submit" variant="primary" disabled={Object.keys(validationErrors).length > 0}>Save Algorithm</K_Button>
        </div>
      )}
    </form>
  ), [formState, handleInputChange, handleArrayInputChange, handleSave, isEditing, isCreating, validationErrors, algorithmStatusColors, riskLevelColors]);

  const renderCode = useMemo(() => (
    <div className="space-y-4">
      <h3 className="text-md font-semibold text-gray-200">Algorithm Code / No-Code JSON</h3>
      <textarea
        className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm p-3 text-white font-mono text-sm h-96 resize-y focus:ring-indigo-500 focus:border-indigo-500"
        value={formState.code}
        onChange={handleInputChange}
        name="code"
        disabled={!isEditing}
        placeholder={formState.language === 'nocode' ? 'Enter No-Code JSON configuration here...' : 'Enter your script code here...'}
      />
      {validationErrors.code && <p className="mt-1 text-xs text-red-500">{validationErrors.code}</p>}

      {formState.language !== 'nocode' && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-200 mb-2">Dependencies</h3>
          <div className="space-y-2">
            {formState.dependencies.map((dep, index) => (
              <div key={index} className="flex items-center gap-2">
                <O_Input
                  label="Name"
                  value={dep.name}
                  onChange={(e) => setFormState(prev => {
                    const newDeps = [...prev.dependencies];
                    newDeps[index] = { ...newDeps[index], name: e.target.value };
                    return { ...prev, dependencies: newDeps };
                  })}
                  name={`dep-name-${index}`}
                  disabled={!isEditing}
                  noPadding // Added noPadding prop to O_Input
                />
                <O_Input
                  label="Version"
                  value={dep.version}
                  onChange={(e) => setFormState(prev => {
                    const newDeps = [...prev.dependencies];
                    newDeps[index] = { ...newDeps[index], version: e.target.value };
                    return { ...prev, dependencies: newDeps };
                  })}
                  name={`dep-version-${index}`}
                  disabled={!isEditing}
                  noPadding // Added noPadding prop to O_Input
                />
                {isEditing && (
                  <K_Button
                    variant="danger"
                    size="sm"
                    icon={X}
                    onClick={() => setFormState(prev => ({
                      ...prev,
                      dependencies: prev.dependencies.filter((_, i) => i !== index)
                    }))}
                  />
                )}
              </div>
            ))}
            {isEditing && (
              <K_Button
                variant="secondary"
                icon={Plus}
                onClick={() => setFormState(prev => ({
                  ...prev,
                  dependencies: [...prev.dependencies, { name: '', version: '' }]
                }))}
                className="w-full"
              >
                Add Dependency
              </K_Button>
            )}
          </div>
        </div>
      )}
      {(isEditing || isCreating) && (
        <div className="flex justify-end space-x-3 mt-6">
          <K_Button type="button" variant="secondary" onClick={handleCancel}>Cancel</K_Button>
          <K_Button type="submit" variant="primary" onClick={handleSave} disabled={Object.keys(validationErrors).length > 0}>Save Algorithm</K_Button>
        </div>
      )}
    </div>
  ), [formState.code, formState.language, formState.dependencies, handleInputChange, isEditing, isCreating, validationErrors.code, handleSave, handleCancel]);

  const renderMetrics = useMemo(() => (
    <div className="space-y-4">
      <h3 className="text-md font-semibold text-gray-200">Performance Metrics</h3>
      {formState.performanceMetrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formState.performanceMetrics).map(([key, value]) => (
            <div key={key} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-lg font-bold text-gray-100 mt-1">{typeof value === 'number' ? value.toFixed(2) : value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No performance metrics available yet. Run a backtest or deploy to live to generate metrics.</p>
      )}

      <h3 className="text-md font-semibold text-gray-200 mt-6">AI Layer Metrics (Gein Factor & Activation)</h3>
      {Object.keys(formState.layerMetrics).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formState.layerMetrics).map(([layerName, metrics]) => (
            <div key={layerName} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">Layer: {layerName}</p>
              <p className="text-lg font-bold text-gray-100 mt-1">Gein: {metrics.gein.toFixed(3)}</p>
              <p className="text-sm text-gray-300">Activation: {metrics.activation.toFixed(3)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No AI layer metrics available.</p>
      )}

      <h3 className="text-md font-semibold text-gray-200 mt-6">Data Point Sensitivity</h3>
      {Object.keys(formState.dataPointSensitivity).length > 0 ? (
        <div className="space-y-2">
          {Object.entries(formState.dataPointSensitivity).map(([dataPoint, sensitivity]) => (
            <div key={dataPoint} className="flex justify-between items-center p-2 bg-gray-900/50 rounded border border-gray-700">
              <span className="text-gray-300">{dataPoint}</span>
              <span className="text-indigo-400 font-mono">{sensitivity.toFixed(3)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No data point sensitivity metrics available.</p>
      )}
    </div>
  ), [formState.performanceMetrics, formState.layerMetrics, formState.dataPointSensitivity]);

  const renderHistory = useMemo(() => (
    <div className="space-y-6">
      <h3 className="text-md font-semibold text-gray-200">Audit History</h3>
      {formState.auditHistory && formState.auditHistory.length > 0 ? (
        <div className="space-y-3">
          {formState.auditHistory.map((audit, index) => (
            <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-100 font-medium">Auditor: {audit.auditor}</p>
                <p className="text-xs text-gray-400">Date: {audit.date}</p>
              </div>
              <M_StatusBadge color={audit.result === 'pass' ? 'green' : audit.result === 'fail' ? 'red' : 'yellow'}>
                {audit.result.toUpperCase()}
              </M_StatusBadge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No audit history available.</p>
      )}

      <h3 className="text-md font-semibold text-gray-200">Optimization History</h3>
      {formState.optimizationHistory && formState.optimizationHistory.length > 0 ? (
        <div className="space-y-3">
          {formState.optimizationHistory.map((opt, index) => (
            <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-100 font-medium">Optimizer: {opt.optimizer}</p>
                <p className="text-xs text-gray-400">Date: {opt.date}, Version: {opt.version}</p>
              </div>
              <M_StatusBadge color={opt.performanceImprovement > 0 ? 'green' : 'yellow'}>
                +{opt.performanceImprovement.toFixed(2)}% Improvement
              </M_StatusBadge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No optimization history available.</p>
      )}

      <h3 className="text-md font-semibold text-gray-200">Deployment History</h3>
      {formState.deploymentHistory && formState.deploymentHistory.length > 0 ? (
        <div className="space-y-3">
          {formState.deploymentHistory.map((dep, index) => (
            <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-100 font-medium">Version: {dep.version}</p>
                <p className="text-xs text-gray-400">Date: {dep.date}</p>
              </div>
              <M_StatusBadge color={
                dep.status === 'deployed' ? 'green' :
                dep.status === 'rolled_back' ? 'yellow' : 'red'
              }>
                {dep.status.replace('_', ' ').toUpperCase()}
              </M_StatusBadge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No deployment history available.</p>
      )}
    </div>
  ), [formState.auditHistory, formState.optimizationHistory, formState.deploymentHistory]);


  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'Overview': return renderOverview;
      case 'Parameters': return renderParameters;
      case 'Code': return renderCode;
      case 'Metrics': return renderMetrics;
      case 'History': return renderHistory;
      default: return null;
    }
  }, [activeTab, renderOverview, renderParameters, renderCode, renderMetrics, renderHistory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <L_Card
        title="Algorithms"
        subtitle="Manage & Deploy Trading Strategies"
        actions={
          <K_Button variant="primary" icon={Plus} onClick={handleNewAlgorithm}>
            New Algo
          </K_Button>
        }
        headerClassName="bg-gray-900/70"
        className="lg:col-span-1"
      >
        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          {algorithms.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No algorithms found. Create a new one!</div>
          ) : (
            algorithms.map((algo) => (
              <div
                key={algo.id}
                onClick={() => handleSelectAlgo(algo)}
                className={`flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border ${
                  selectedAlgo?.id === algo.id ? 'border-indigo-500 shadow-lg' : 'border-gray-700 hover:border-gray-500'
                } cursor-pointer transition-all duration-200`}
              >
                <div>
                  <h4 className="font-semibold text-gray-100">{algo.name}</h4>
                  <p className="text-xs text-gray-400">v{algo.version} by {algo.author}</p>
                </div>
                <M_StatusBadge color={algorithmStatusColors[algo.status]}>{algo.status.toUpperCase()}</M_StatusBadge>
              </div>
            ))
          )}
        </div>
      </L_Card>

      <L_Card
        title={selectedAlgo ? (isCreating ? 'Create New Algorithm' : `Algorithm: ${selectedAlgo.name}`) : 'Select an Algorithm'}
        subtitle={selectedAlgo ? `v${isCreating ? 1 : selectedAlgo.version} - Last Modified: ${isCreating ? new Date().toISOString().split('T')[0] : selectedAlgo.lastModified}` : ''}
        actions={selectedAlgo && !isCreating && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <K_Button variant="secondary" icon={SlidersHorizontal} onClick={() => setIsEditing(true)}>
                  Edit
                </K_Button>
                <K_Button variant="danger" icon={X} onClick={handleDelete}>
                  Delete
                </K_Button>
                {selectedAlgo.status === 'live' ? (
                  <K_Button variant="outline" icon={Code} onClick={() => alert('Code deployment paused!')}>
                    Pause
                  </K_Button>
                ) : (
                  <K_Button variant="success" icon={Play} onClick={() => alert('Code deployed!')}>
                    Deploy
                  </K_Button>
                )}
              </>
            ) : null}
          </div>
        )}
        headerClassName="bg-gray-900/70"
        className="lg:col-span-2"
      >
        {!selectedAlgo && !isCreating ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center py-20">
            <Lightbulb className="w-12 h-12 mb-4 text-indigo-400"/>
            <p className="text-lg mb-2">Select an algorithm from the left panel or create a new one.</p>
            <K_Button variant="ghost" icon={Plus} onClick={handleNewAlgorithm}>
              Create New Algorithm
            </K_Button>
          </div>
        ) : (
          <>
            <Q_Tabs
              tabs={['Overview', 'Parameters', 'Code', 'Metrics', 'History']}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              className="-mt-6 -mx-6 mb-6"
            />
            <div className="max-h-[calc(100vh-380px)] overflow-y-auto custom-scrollbar">
              {renderTabContent()}
            </div>
          </>
        )}
      </L_Card>
    </div>
  );
};

// Company: User Interface, API Endpoint: /, Use Case: Main Application Layout, Feature: Dynamic Dashboard Rendering & Navigation - V
const V_AlgoTradingLab: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'algorithms' | 'insights' | 'settings'>('dashboard');
  const userProfile = J_mockUserProfile; // Mock user profile

  const renderView = useCallback(() => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
            <R_AIStatusMonitor />
            <S_GlobalMarketPulse />
            <T_AIInsightsFeed />
            <L_Card title="Quick Actions" subtitle="Rapid Deployment & Monitoring" headerClassName="bg-gray-900/70">
              <div className="grid grid-cols-2 gap-4">
                <K_Button variant="primary" size="lg" icon={Play}>Deploy New Strategy</K_Button>
                <K_Button variant="secondary" size="lg" icon={History}>Run Backtest</K_Button>
                <K_Button variant="outline" size="lg" icon={MonitorCheck}>Monitor Live Algos</K_Button>
                <K_Button variant="ghost" size="lg" icon={Zap}>Trigger Quantum Rebalance</K_Button>
              </div>
            </L_Card>
          </div>
        );
      case 'algorithms':
        return <U_AlgorithmManager />;
      case 'insights':
        return <div className="p-6"><T_AIInsightsFeed /></div>; // T_AIInsightsFeed as a standalone view
      case 'settings':
        return (
          <L_Card title="User Settings" subtitle="Manage your profile and preferences" className="p-6 max-w-2xl mx-auto">
            <O_Input label="Name" name="name" value={userProfile.name} onChange={() => {}} disabled />
            <O_Input label="Email" name="email" value={userProfile.email} onChange={() => {}} disabled />
            <P_Select label="Theme" name="theme" value={userProfile.preferences.theme} onChange={() => {}}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="matrix">Matrix</option>
              <option value="nebula">Nebula</option>
            </P_Select>
            <O_Input label="AI Assistance Level" name="aiAssistanceLevel" value={userProfile.preferences.aiAssistanceLevel} onChange={() => {}} disabled />
            <K_Button variant="primary" className="mt-4">Save Settings</K_Button>
          </L_Card>
        );
      default:
        return <div className="p-6 text-gray-400">View not found.</div>;
    }
  }, [activeView, userProfile]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4 shadow-lg z-10">
        <div className="flex items-center justify-center p-4 mb-8">
          <BrainCircuit className="w-8 h-8 text-indigo-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-100">JBOIII Lab</h1>
        </div>
        <ul className="flex-grow space-y-2">
          <li>
            <K_Button
              variant={activeView === 'dashboard' ? 'primary' : 'ghost'}
              icon={LayoutDashboard}
              onClick={() => setActiveView('dashboard')}
              className="w-full justify-start"
            >
              Dashboard
            </K_Button>
          </li>
          <li>
            <K_Button
              variant={activeView === 'algorithms' ? 'primary' : 'ghost'}
              icon={Code}
              onClick={() => setActiveView('algorithms')}
              className="w-full justify-start"
            >
              Algorithms
            </K_Button>
          </li>
          <li>
            <K_Button
              variant={activeView === 'insights' ? 'primary' : 'ghost'}
              icon={Lightbulb}
              onClick={() => setActiveView('insights')}
              className="w-full justify-start"
            >
              AI Insights
            </K_Button>
          </li>
          <li>
            <K_Button
              variant={activeView === 'settings' ? 'primary' : 'ghost'}
              icon={Settings}
              onClick={() => setActiveView('settings')}
              className="w-full justify-start"
            >
              Settings
            </K_Button>
          </li>
        </ul>
        <div className="mt-8 pt-4 border-t border-gray-800">
          <K_Button
            variant="ghost"
            icon={User}
            onClick={() => setActiveView('settings')}
            className="w-full justify-start"
          >
            {userProfile.name}
          </K_Button>
          <K_Button
            variant="ghost"
            icon={LogOut}
            onClick={() => alert('Logged Out')}
            className="w-full justify-start text-red-400 hover:text-red-300"
          >
            Logout
          </K_Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto custom-scrollbar bg-gray-800/80">
        {renderView()}
      </main>
    </div>
  );
};

export default V_AlgoTradingLab;