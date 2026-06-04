import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Scan, Shield, Lock, ArrowRight, Fingerprint, Globe, Building2, Infinity, Terminal, AlertTriangle, RefreshCw } from 'lucide-react';

export const LoginView: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('visionary@sovereign-ai-nexus.io');
    const [password, setPassword] = useState('');
    const [authMethod, setAuthMethod] = useState<'credentials' | 'biometric' | 'sso'>('sso');
    const [handshakeStep, setHandshakeStep] = useState(0);
    const [watchdogError, setWatchdogError] = useState<string | null>(null);

    // Safeguard against broken context initialization from import-maps
    if (!authContext) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans text-white">
                <div className="bg-black/80 border border-red-500/30 rounded-3xl p-8 max-w-md text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold">Context Handshake Failed</h2>
                    <p className="text-sm text-gray-400 font-mono text-left bg-gray-900 p-4 rounded-xl border border-gray-800">
                        AuthContext is undefined. Check if AuthProvider wraps your application tree inside index.tsx or if the module configuration failed to resolve.
                    </p>
                </div>
            </div>
        );
    }

    const { loginWithCredentials, loginWithBiometrics, loginWithSSO, isAuthenticated, isLoading } = authContext;

    const handshakeMessages = [
        "Initializing secure tunnel...",
        "Validating RS256 signature chain...",
        "Synchronizing with identity provider...",
        "Identity verified. Encrypting session token...",
        "Handshake finalized. Decrypting persona data..."
    ];

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Message cycler effect
    useEffect(() => {
        if (isLoading && authMethod === 'sso') {
            const interval = setInterval(() => {
                setHandshakeStep(prev => (prev + 1) % handshakeMessages.length);
            }, 800);
            return () => clearInterval(interval);
        }
    }, [isLoading, authMethod]);

    // Watchdog Timeout: Break out of the loop if the auth handshake stays stuck for more than 5 seconds
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (isLoading) {
            timeoutId = setTimeout(() => {
                setWatchdogError("Handshake timed out. The authentication server or identity provider is not responding to the current domain framework.");
            }, 5000);
        } else {
            setWatchdogError(null);
        }
        return () => clearTimeout(timeoutId);
    }, [isLoading]);

    const handleSSO = async () => {
        setWatchdogError(null);
        setAuthMethod('sso');
        try {
            await loginWithSSO();
        } catch (err: any) {
            setWatchdogError(err.message || "SSO initialization intercepted an unhandled routing rejection.");
        }
    };

    const handleCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setWatchdogError(null);
        try {
            await loginWithCredentials(email, password);
        } catch (err: any) {
            setWatchdogError(err.message || "Credentials verification failed.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b,transparent)] opacity-40"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="bg-black/60 backdrop-blur-2xl border border-gray-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden p-10 transform transition-all duration-700 hover:shadow-indigo-500/10">
                    
                    {/* Brand */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 group cursor-pointer">
                            <Infinity className="w-8 h-8 text-white transition-transform group-hover:rotate-180 duration-1000" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tighter">Infinite Intelligence</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-mono">Access Terminal Alpha-1</p>
                    </div>

                    {/* Error Override Display */}
                    {watchdogError ? (
                        <div className="py-6 space-y-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-12 h-12 bg-red-950/50 border border-red-500/40 rounded-xl mx-auto flex items-center justify-center text-red-400">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Handshake Aborted</h3>
                                <p className="text-xs text-gray-400 bg-gray-900/80 p-4 rounded-xl border border-gray-800 text-left font-mono leading-relaxed">
                                    {watchdogError}
                                </p>
                            </div>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium py-3 rounded-xl transition-all"
                            >
                                <RefreshCw size={16} /> Force Reset Connection
                            </button>
                        </div>
                    ) : isLoading ? (
                        <div className="py-12 space-y-8 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="w-8 h-8 text-indigo-400 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-sm font-mono text-indigo-400 animate-pulse">{handshakeMessages[handshakeStep]}</p>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest">Secure Handshake in Progress</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {authMethod === 'sso' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <button 
                                        onClick={handleSSO}
                                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Building2 size={20} />
                                        Sign In
                                    </button>
                                    <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                        <p className="text-[10px] font-mono text-gray-500 leading-relaxed">
                                            Handshake Protocol: OIDC / RS256<br/>
                                            Auth0 Instance: Verified
                                        </p>
                                    </div>
                                </div>
                            )}

                            {authMethod === 'credentials' && (
                                <form onSubmit={handleCredentials} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Identity Identifier</label>
                                        <div className="relative">
                                            <input 
                                                type="email" 
                                                value={email} 
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-all pl-11"
                                                placeholder="identity@sovereign.io"
                                            />
                                            <Terminal className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Security Key</label>
                                        <div className="relative">
                                            <input 
                                                type="password" 
                                                value={password} 
                                                onChange={e => setPassword(e.target.value)}
                                                className="w-full bg-gray-800/50 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-all pl-11"
                                                placeholder="••••••••••••"
                                            />
                                            <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-white text-black font-extrabold py-3 rounded-xl hover:bg-gray-200 transition-all mt-4 flex items-center justify-center gap-2">
                                        Authenticate <ArrowRight size={18} />
                                    </button>
                                </form>
                            )}

                            {authMethod === 'biometric' && (
                                <div className="flex flex-col items-center justify-center space-y-6 py-8 animate-in fade-in zoom-in duration-500">
                                    <button 
                                        onClick={loginWithBiometrics}
                                        className="w-24 h-24 rounded-full bg-cyan-600/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-600/30 transition-all relative group"
                                    >
                                        <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-20 animate-ping group-hover:animate-none"></div>
                                        <Fingerprint size={48} />
                                    </button>
                                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Scan for Biometric Pulse</p>
                                </div>
                            )}

                            {/* Options Toggle */}
                            <div className="pt-6 border-t border-gray-800 flex justify-center gap-6">
                                <button onClick={() => setAuthMethod('sso')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${authMethod === 'sso' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>SSO</button>
                                <button onClick={() => setAuthMethod('biometric')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${authMethod === 'biometric' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>Biometric</button>
                                <button onClick={() => setAuthMethod('credentials')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${authMethod === 'credentials' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}>Password</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <footer className="absolute bottom-8 text-center space-y-1">
                <p className="text-[10px] text-gray-700 font-mono">ENCRYPTION: AES-256-GCM // QUANTUM_RESISTANT_LINK: ACTIVE</p>
                <p className="text-[10px] text-gray-800">UNAUTHORIZED ACCESS ATTEMPTS ARE LOGGED TO THE PERMANENT LEDGER.</p>
            </footer>
        </div>
    );
};
