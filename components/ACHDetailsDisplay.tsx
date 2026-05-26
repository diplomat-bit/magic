import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * TYPES & INTERFACES
 */
export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
  accountType: 'Checking' | 'Savings';
  bankName: string;
  lastVerified?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  metadata: any;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SECURE VAULT - HOMOMORPHIC SIMULATION
 */
class HomomorphicVault {
  private static instance: HomomorphicVault;
  private storage: Map<string, string> = new Map();
  private salt: string = "QUANTUM_SECURE_2024_ALPHA";

  private constructor() {}

  public static getInstance(): HomomorphicVault {
    if (!HomomorphicVault.instance) {
      HomomorphicVault.instance = new HomomorphicVault();
    }
    return HomomorphicVault.instance;
  }

  private encrypt(value: string): string {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const saltCodes = textToChars(this.salt);
    return btoa(
      value
        .split("")
        .map((char) => char.charCodeAt(0))
        .map((code, i) => code ^ saltCodes[i % saltCodes.length])
        .map((c) => c.toString(16))
        .join(",")
    );
  }

  public store(key: string, value: string) {
    this.storage.set(key, this.encrypt(value));
  }

  public get(key: string): string | undefined {
    return this.storage.get(key);
  }
}

const ACHDetailsDisplay: React.FC<{ details: ACHDetails; hideSensitive?: boolean }> = ({
  details: initialDetails,
  hideSensitive = true,
}) => {
  const [details, setDetails] = useState<ACHDetails>(initialDetails);
  const [showFullDetails, setShowFullDetails] = useState(!hideSensitive);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to Quantum Financial. I am your AI Treasury Assistant. How can I help you manage your ACH configurations today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const vault = HomomorphicVault.getInstance();

  const logAudit = (action: string, actor: string, metadata: any) => {
    const entry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 50));
  };

  useEffect(() => {
    logAudit("VIEW_COMPONENT", "System", { component: "ACHDetailsDisplay" });
    vault.store("ACH_ROUTING", initialDetails.routingNumber);
    vault.store("ACH_ACCOUNT", initialDetails.realAccountNumber);
  }, [initialDetails.routingNumber, initialDetails.realAccountNumber]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessingAI(true);
    logAudit("AI_QUERY", "User", { query: userMsg });

    try {
      const genAI = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a financial AI. Current Details: ${JSON.stringify(details)}. Request: "${userMsg}". 
      If user wants to update data, return JSON: { "action": "UPDATE_ACH", "payload": { ... } }. 
      If payment, return { "action": "INITIATE_PAYMENT" }. Else, reply normally.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (responseText.includes("UPDATE_ACH")) {
        const jsonMatch = responseText.match(/\{.*\}/s);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          setDetails(prev => ({ ...prev, ...data.payload }));
          setMessages(prev => [...prev, { role: 'assistant', content: "Configuration updated." }]);
        }
      } else if (responseText.includes("INITIATE_PAYMENT")) {
        setShowPaymentModal(true);
        setMessages(prev => [...prev, { role: 'assistant', content: "Payment gateway opened." }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error." }]);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleStripePayment = () => {
    setStripeStatus('processing');
    setTimeout(() => {
      setStripeStatus('success');
      setTimeout(() => {
        setShowPaymentModal(false);
        setStripeStatus('idle');
      }, 2000);
    }, 2500);
  };

  const obscureNumber = (num: string): string => `****${num.slice(-4)}`;

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">QUANTUM FINANCIAL</h1>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold">AI ASSISTANT</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold">Routing Number</label>
                <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.routingNumber : obscureNumber(details.routingNumber)}</div>
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold">Account Number</label>
                <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.realAccountNumber : obscureNumber(details.realAccountNumber)}</div>
              </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="mt-8 px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm">Edit Configuration</button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl h-[400px] overflow-y-auto p-4 font-mono text-[10px]">
            {auditTrail.map((log) => <div key={log.id} className="border-l-2 border-slate-700 pl-3 py-1 text-slate-300">{log.action}</div>)}
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-slate-800 border border-blue-500/30 rounded-2xl flex flex-col z-50">
          <div className="p-4 border-b border-slate-700 flex justify-between">
            <span className="font-bold text-sm">Quantum AI</span>
            <button onClick={() => setIsChatOpen(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => <div key={i} className={`p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-slate-700'}`}>{m.content}</div>)}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-slate-700">
            <input className="w-full bg-slate-900 p-2 rounded text-sm" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[100]">
          <div className="bg-white text-slate-900 p-8 rounded-2xl w-full max-w-sm">
            <h2 className="font-bold text-lg mb-4">Stripe Checkout</h2>
            <button onClick={handleStripePayment} disabled={stripeStatus !== 'idle'} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">
              {stripeStatus === 'idle' ? "Pay $5,000" : "Processing..."}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;