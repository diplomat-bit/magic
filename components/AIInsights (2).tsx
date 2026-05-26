// components/AIInsights.tsx
import React, { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';

const UrgencyIndicator: React.FC<{ urgency: 'low' | 'medium' | 'high' }> = ({ urgency }) => {
    const colors: Record<'low' | 'medium' | 'high', string> = {
        low: 'bg-cyan-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };
    return <div className={`w-2.5 h-2.5 rounded-full ${colors[urgency]}`} title={`Urgency: ${urgency}`}></div>;
};

const AIInsights: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        return null;
    }

    const { aiInsights, isInsightsLoading, generateDashboardInsights } = context;
    
    useEffect(() => {
        if (aiInsights && aiInsights.length === 0 && !isInsightsLoading) {
            generateDashboardInsights();
        }
    }, [aiInsights, isInsightsLoading, generateDashboardInsights]);

    return (
        <Card title="AI Insights">
            {isInsightsLoading ? (
                <div className="text-center text-gray-400">Quantum is analyzing your data...</div>
            ) : aiInsights && aiInsights.length > 0 ? (
                <ul className="space-y-3">
                    {aiInsights.map(insight => (
                        <li key={insight.id} className="flex items-start gap-3">
                            <UrgencyIndicator urgency={insight.urgency} />
                            <div>
                                <p className="font-semibold text-white">{insight.title}</p>
                                <p className="text-sm text-gray-300">{insight.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-400">No insights available at this time.</div>
            )}
        </Card>
    );
};

export default AIInsights;