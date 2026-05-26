import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { APIStatus } from '../types';
import Card from './Card';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

const StatusIndicator: React.FC<{ status: APIStatus['status'] }> = ({ status }) => {
    const colors = {
        'Operational': { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
        'Degraded Performance': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
        'Partial Outage': { bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' },
        'Major Outage': { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
        'Maintenance': { bg: 'bg-blue-500/20', text: 'text-blue-300', dot: 'bg-blue-400' },
        'Unknown': { bg: 'bg-gray-500/20', text: 'text-gray-300', dot: 'bg-gray-400' },
    };
    const style = colors[status] || colors['Unknown'];
    return (
        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
            {status}
        </div>
    );
};

const AIChatAssistant: React.FC<{ geminiApiKey: string | null }> = ({ geminiApiKey }) => {
    const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai', text: string, timestamp: string }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const simulateAICall = async (query: string, apiKey: string | null): Promise<string> => {
        if (!apiKey) return "ERROR: AI Service Key not configured securely via backend vault.";
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500)); 
        query = query.toLowerCase();
        if (query.includes("api status") || query.includes("latency")) return "AI Diagnostics: System APIs are stable. Average latency (Gemini): 88ms, Modern Treasury: 115ms.";
        if (query.includes("cash flow") || query.includes("forecast")) return "AI Financial Insight: Cash flow projection remains positive (Q3 +15%).";
        if (query.includes("fraud detection") || query.includes("risk")) return "AI Security Report: 2 medium-risk transactions flagged for review.";
        if (query.includes("optimize workflow")) return "AI Workflow Recommendation: Optimize payment batching for cost savings.";
        if (query.includes("kpis")) return "AI Business Intelligence: Q2 KPIs show strong LTV (+12%).";
        if (query.includes("hello") || query.includes("hi")) return "Hello! I am your AI Business Assistant.";
        return "AI Response: Processing your request via scalable model architecture.";
    };

    const handleSendMessage = async () => {
        if (chatInput.trim() === '') return;
        const newUserMessage = { sender: 'user' as const, text: chatInput, timestamp: new Date().toLocaleTimeString() };
        setChatMessages(prev => [...prev, newUserMessage]);
        const userQuery = chatInput;
        setChatInput('');
        setIsTyping(true);
        try {
            const aiResponse = await simulateAICall(userQuery, geminiApiKey);
            setChatMessages(prev => [...prev, { sender: 'ai' as const, text: aiResponse, timestamp: new Date().toLocaleTimeString() }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { sender: 'ai' as const, text: "AI service failure.", timestamp: new Date().toLocaleTimeString() }]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [chatMessages]);

    return (
        <Card title="AI Business Assistant">
            <div className="flex flex-col h-96">
                <div id="chat-messages" className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900 rounded-lg border border-gray-700 mb-4">
                    {chatMessages.length === 0 && <div className="text-center text-gray-500 italic">Type a message to start...</div>}
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${msg.sender === 'user' ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-100'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <span className="block text-right text-xs text-gray-400 mt-1">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-700 text-gray-100">...</div>
                        </div>
                    )}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={geminiApiKey ? "Ask your AI assistant..." : "Configure API key to chat..."}
                        className="flex-grow bg-gray-700/50 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        disabled={!geminiApiKey}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-r-lg px-4 py-2 transition-colors duration-200"
                        disabled={!geminiApiKey || chatInput.trim() === ''}
                    >
                        Send
                    </button>
                </div>
            </div>
        </Card>
    );
};

const APIMonitoringDashboard: React.FC<{ apiStatus: APIStatus[], geminiApiKey: string | null }> = ({ apiStatus, geminiApiKey }) => {
    const [selectedAPI, setSelectedAPI] = useState<string | null>(null);
    const [anomalyDetectionEnabled, setAnomalyDetectionEnabled] = useState(true);
    const [aiInsights, setAiInsights] = useState<string[]>([]);

    useEffect(() => {
        if (geminiApiKey && anomalyDetectionEnabled) {
            setAiInsights([
                "AI detected a 15% increase in API latency for Google Gemini.",
                "Anomaly: Modern Treasury API error rates spiked at 02:30 UTC.",
                "Predictive analysis: 70% probability of 'Degraded Performance' for payment gateway."
            ]);
        } else {
            setAiInsights([]);
        }
    }, [geminiApiKey, anomalyDetectionEnabled]);

    const renderAPIDetails = () => {
        if (!selectedAPI) return <p className="text-gray-400">Select an API provider.</p>;
        const api = apiStatus.find(a => a.provider === selectedAPI);
        if (!api) return <p className="text-red-400">API details not found.</p>;

        const historicalData = Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, latency: api.responseTime + Math.random() * 50 - 25, errors: Math.floor(Math.random() * 5) }));

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">{api.provider} - Details</h3>
                <div className="h-64 bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="time" stroke="#9ca3af" />
                            <YAxis yAxisId="left" stroke="#06b6d4" />
                            <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                            <Line yAxisId="left" dataKey="latency" stroke="#06b6d4" dot={false} />
                            <Line yAxisId="right" dataKey="errors" stroke="#ef4444" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <Card title="Advanced API Monitoring & AI Diagnostics">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <ul className="space-y-2">
                        {apiStatus.map(api => (
                            <li key={api.provider}>
                                <button onClick={() => setSelectedAPI(api.provider)} className={`w-full text-left p-3 rounded-lg ${selectedAPI === api.provider ? 'bg-cyan-700' : 'bg-gray-800'}`}>{api.provider}</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-3">{renderAPIDetails()}</div>
            </div>
        </Card>
    );
};

const FinancialOperationsDashboard: React.FC<{ modernTreasuryApiKey: string | null, modernTreasuryOrganizationId: string | null, geminiApiKey: string | null }> = ({ modernTreasuryApiKey, modernTreasuryOrganizationId, geminiApiKey }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
    const isConfigured = modernTreasuryApiKey && modernTreasuryOrganizationId;

    if (!isConfigured) {
        return <Card title="Financial Operations">Not configured.</Card>;
    }

    return (
        <Card title="Financial Operations">
            <div className="border-b border-gray-700 mb-6 flex space-x-8">
                <button onClick={() => setActiveTab('overview')} className="pb-2">Overview</button>
                <button onClick={() => setActiveTab('transactions')} className="pb-2">Transactions</button>
            </div>
            {activeTab === 'overview' ? <div>Finance Overview Content</div> : <div>Transactions Table Content</div>}
        </Card>
    );
};

const BusinessIntelligenceDashboard: React.FC<{ geminiApiKey: string | null }> = ({ geminiApiKey }) => (
    <Card title="Business Intelligence">BI Dashboard Active.</Card>
);

const WorkflowAutomation: React.FC<{ geminiApiKey: string | null }> = ({ geminiApiKey }) => (
    <Card title="Workflow Automation">Automation Rules Management.</Card>
);

const UserProfileManagement: React.FC<{ geminiApiKey: string | null }> = ({ geminiApiKey }) => (
    <Card title="User Profile">Management Settings.</Card>
);

const APIIntegrationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIIntegrationView must be within a DataProvider.");
    const { apiStatus, geminiApiKey, modernTreasuryApiKey, modernTreasuryOrganizationId } = context;
    const [activeMainTab, setActiveMainTab] = useState<'system' | 'finance' | 'bi' | 'automation' | 'profile' | 'chat'>('system');

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Enterprise Operating System Dashboard</h2>
            <nav className="flex space-x-8 border-b border-gray-700">
                {['system', 'finance', 'bi', 'automation', 'profile', 'chat'].map(tab => (
                    <button key={tab} onClick={() => setActiveMainTab(tab as any)} className="capitalize p-2">{tab}</button>
                ))}
            </nav>
            {activeMainTab === 'system' && <APIMonitoringDashboard apiStatus={apiStatus} geminiApiKey={geminiApiKey} />}
            {activeMainTab === 'finance' && <FinancialOperationsDashboard modernTreasuryApiKey={modernTreasuryApiKey} modernTreasuryOrganizationId={modernTreasuryOrganizationId} geminiApiKey={geminiApiKey} />}
            {activeMainTab === 'bi' && <BusinessIntelligenceDashboard geminiApiKey={geminiApiKey} />}
            {activeMainTab === 'automation' && <WorkflowAutomation geminiApiKey={geminiApiKey} />}
            {activeMainTab === 'profile' && <UserProfileManagement geminiApiKey={geminiApiKey} />}
            {activeMainTab === 'chat' && <AIChatAssistant geminiApiKey={geminiApiKey} />}
        </div>
    );
};

export default APIIntegrationView;