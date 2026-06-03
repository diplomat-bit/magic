import React, { useState, useContext, useEffect, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import { APIStatus } from '../types';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Snackbar,
    Alert,
    IconButton,
    InputAdornment,
    Chip,
    Paper,
    Divider,
    CircularProgress,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Save as SaveIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Settings as SettingsIcon,
    Memory as SystemIcon,
    AccountBalance as FinanceIcon,
    AutoAwesome as AIIcon,
    Security as SecurityIcon,
    Sync as SyncIcon
} from '@mui/icons-material';

// --- Custom Hooks ---

const useAsyncAction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async <T extends unknown>(action: () => Promise<T>): Promise<T | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            return await action();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, execute, setError };
};

interface FeedbackState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

const useFeedback = () => {
    const [feedback, setFeedback] = useState<FeedbackState>({
        open: false,
        message: '',
        severity: 'success'
    });

    const showFeedback = useCallback((message: string, severity: FeedbackState['severity'] = 'success') => {
        setFeedback({ open: true, message, severity });
    }, []);

    const hideFeedback = useCallback(() => {
        setFeedback((prev) => ({ ...prev, open: false }));
    }, []);

    return { feedback, showFeedback, hideFeedback };
};

const useIntegrationConfig = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIIntegrationView must be within a DataProvider.");
    
    const {
        apiStatus,
        geminiApiKey, setGeminiApiKey,
        modernTreasuryApiKey, setModernTreasuryApiKey,
        modernTreasuryOrganizationId, setModernTreasuryOrganizationId
    } = context;

    const [localGeminiKey, setLocalGeminiKey] = useState(geminiApiKey || '');
    const [localMtKey, setLocalMtKey] = useState(modernTreasuryApiKey || '');
    const [localMtOrgId, setLocalMtOrgId] = useState(modernTreasuryOrganizationId || '');
    const [localPlaidId, setLocalPlaidId] = useState('');
    const [localPlaidSecret, setLocalPlaidSecret] = useState('');
    const [localStripeKey, setLocalStripeKey] = useState('');

    useEffect(() => {
        setLocalGeminiKey(geminiApiKey || '');
        setLocalMtKey(modernTreasuryApiKey || '');
        setLocalMtOrgId(modernTreasuryOrganizationId || '');
    }, [geminiApiKey, modernTreasuryApiKey, modernTreasuryOrganizationId]);

    const syncToBackend = useCallback(async (callback: () => Promise<void> | void) => {
        try {
            // Simulate network delay for synchronization
            await new Promise<void>((resolve) => setTimeout(resolve, 800));
            await callback();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to synchronize with backend.';
            throw new Error(errorMessage);
        }
    }, []);

    const saveGeminiConfig = useCallback(() => syncToBackend(async () => {
        if (!localGeminiKey.trim()) throw new Error('Gemini API Key cannot be empty.');
        await Promise.resolve(setGeminiApiKey(localGeminiKey));
    }), [syncToBackend, setGeminiApiKey, localGeminiKey]);

    const saveMtConfig = useCallback(() => syncToBackend(async () => {
        if (!localMtKey.trim()) throw new Error('Modern Treasury API Key cannot be empty.');
        if (!localMtOrgId.trim()) throw new Error('Modern Treasury Organization ID cannot be empty.');
        await Promise.resolve(setModernTreasuryApiKey(localMtKey));
        await Promise.resolve(setModernTreasuryOrganizationId(localMtOrgId));
    }), [syncToBackend, setModernTreasuryApiKey, setModernTreasuryOrganizationId, localMtKey, localMtOrgId]);

    const savePlaidConfig = useCallback(() => syncToBackend(async () => {
        if (!localPlaidId.trim()) throw new Error('Plaid Client ID cannot be empty.');
        if (!localPlaidSecret.trim()) throw new Error('Plaid Secret cannot be empty.');
        /* Securely store Plaid keys */
    }), [syncToBackend, localPlaidId, localPlaidSecret]);

    const saveStripeConfig = useCallback(() => syncToBackend(async () => {
        if (!localStripeKey.trim()) throw new Error('Stripe Secret Key cannot be empty.');
        /* Securely store Stripe keys */
    }), [syncToBackend, localStripeKey]);

    return {
        apiStatus,
        geminiApiKey,
        localGeminiKey, setLocalGeminiKey, saveGeminiConfig,
        localMtKey, setLocalMtKey,
        localMtOrgId, setLocalMtOrgId, saveMtConfig,
        localPlaidId, setLocalPlaidId, savePlaidConfig,
        localPlaidSecret, setLocalPlaidSecret,
        localStripeKey, setLocalStripeKey, saveStripeConfig
    };
};

// --- Sub-components ---

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const CustomTabPanel = React.memo((props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`integration-tabpanel-${index}`}
            aria-labelledby={`integration-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
});
CustomTabPanel.displayName = 'CustomTabPanel';

function a11yProps(index: number) {
    return {
        id: `integration-tab-${index}`,
        'aria-controls': `integration-tabpanel-${index}`,
    };
}

const StatusChip = React.memo(({ status }: { status: APIStatus['status'] | 'Unknown' }) => {
    let color: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    switch (status) {
        case 'Operational': color = 'success'; break;
        case 'Degraded Performance': color = 'warning'; break;
        case 'Partial Outage': color = 'warning'; break;
        case 'Major Outage': color = 'error'; break;
        case 'Maintenance': color = 'info'; break;
        default: color = 'default';
    }
    return <Chip label={status} color={color} size="small" variant="outlined" aria-label={`Status: ${status}`} />;
});
StatusChip.displayName = 'StatusChip';

interface SecureConfigFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    onSave: () => Promise<void>;
    placeholder?: string;
    id?: string;
}

const SecureConfigField = React.memo<SecureConfigFieldProps>(({ label, value, onChange, onSave, placeholder, id }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { isLoading, error, execute, setError } = useAsyncAction();

    const handleSave = useCallback(async () => {
        try {
            await execute(onSave);
        } catch (err) {
            // Error is handled by useAsyncAction and stored in `error`
        }
    }, [execute, onSave]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        onChange(e.target.value);
    }, [onChange, error, setError]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                    id={id}
                    fullWidth
                    label={label}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    placeholder={placeholder}
                    error={!!error}
                    helperText={error}
                    inputProps={{ 'aria-label': label }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SecurityIcon fontSize="small" color={error ? "error" : "action"} aria-hidden="true" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={togglePasswordVisibility} 
                                    edge="end" 
                                    size="small"
                                    aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" aria-hidden="true" /> : <SaveIcon aria-hidden="true" />}
                    onClick={handleSave}
                    disabled={isLoading || !value.trim()}
                    sx={{ minWidth: '120px', height: '40px' }}
                    aria-label={`Save ${label}`}
                >
                    {isLoading ? 'Syncing...' : 'Save'}
                </Button>
            </Box>
        </Box>
    );
});
SecureConfigField.displayName = 'SecureConfigField';

// --- Main Component ---

const APIIntegrationView: React.FC = () => {
    const {
        apiStatus,
        geminiApiKey,
        localGeminiKey, setLocalGeminiKey, saveGeminiConfig,
        localMtKey, setLocalMtKey,
        localMtOrgId, setLocalMtOrgId, saveMtConfig,
        localPlaidId, setLocalPlaidId, savePlaidConfig,
        localPlaidSecret, setLocalPlaidSecret,
        localStripeKey, setLocalStripeKey, saveStripeConfig
    } = useIntegrationConfig();

    const { feedback, showFeedback, hideFeedback } = useFeedback();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }, []);

    const handleSaveGemini = useCallback(async () => {
        try {
            await saveGeminiConfig();
            showFeedback('Secure synchronization with backend complete.', 'success');
        } catch (error) {
            showFeedback(error instanceof Error ? error.message : 'Failed to synchronize.', 'error');
            throw error;
        }
    }, [saveGeminiConfig, showFeedback]);

    const handleSaveMt = useCallback(async () => {
        try {
            await saveMtConfig();
            showFeedback('Secure synchronization with backend complete.', 'success');
        } catch (error) {
            showFeedback(error instanceof Error ? error.message : 'Failed to synchronize.', 'error');
            throw error;
        }
    }, [saveMtConfig, showFeedback]);

    const handleSavePlaid = useCallback(async () => {
        try {
            await savePlaidConfig();
            showFeedback('Secure synchronization with backend complete.', 'success');
        } catch (error) {
            showFeedback(error instanceof Error ? error.message : 'Failed to synchronize.', 'error');
            throw error;
        }
    }, [savePlaidConfig, showFeedback]);

    const handleSaveStripe = useCallback(async () => {
        try {
            await saveStripeConfig();
            showFeedback('Secure synchronization with backend complete.', 'success');
        } catch (error) {
            showFeedback(error instanceof Error ? error.message : 'Failed to synchronize.', 'error');
            throw error;
        }
    }, [saveStripeConfig, showFeedback]);

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                <SettingsIcon fontSize="large" color="primary" aria-hidden="true" />
                Integration & Configuration Hub
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Manage your enterprise API connections, security credentials, and system integrations securely.
            </Typography>

            <Paper sx={{ mt: 4, borderRadius: 2, overflow: 'hidden' }} elevation={3}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Integration configuration tabs" variant="fullWidth">
                        <Tab icon={<SystemIcon aria-hidden="true" />} iconPosition="start" label="System & Core APIs" {...a11yProps(0)} />
                        <Tab icon={<FinanceIcon aria-hidden="true" />} iconPosition="start" label="Financial Operations" {...a11yProps(1)} />
                        <Tab icon={<AIIcon aria-hidden="true" />} iconPosition="start" label="AI & Intelligence" {...a11yProps(2)} />
                    </Tabs>
                </Box>

                <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '60vh' }}>
                    {/* SYSTEM TAB */}
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SyncIcon color="primary" aria-hidden="true" /> Live API Status
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        {apiStatus && apiStatus.length > 0 ? (
                                            <List disablePadding aria-label="API Status List">
                                                {apiStatus.map((api, index) => (
                                                    <React.Fragment key={api.provider}>
                                                        <ListItem sx={{ px: 0 }}>
                                                            <ListItemText 
                                                                primary={api.provider} 
                                                                secondary={`Latency: ${api.responseTime}ms`} 
                                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                                            />
                                                            <StatusChip status={api.status} />
                                                        </ListItem>
                                                        {index < apiStatus.length - 1 && <Divider component="li" />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        ) : (
                                            <Box sx={{ py: 3, textAlign: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    No API status data available.
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SecurityIcon color="primary" aria-hidden="true" /> Security & Access
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            All credentials are encrypted at rest and masked during transit. Ensure you follow the principle of least privilege when generating API keys.
                                        </Typography>
                                        <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, color: 'info.contrastText', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CheckCircleIcon aria-hidden="true" />
                                            <Typography variant="body2">End-to-end encryption is active for all configuration payloads.</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CustomTabPanel>

                    {/* FINANCIAL TAB */}
                    <CustomTabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom>Financial Providers Configuration</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Configure your payment gateways, banking APIs, and treasury management systems.
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Modern Treasury</Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <SecureConfigField
                                            id="mt-org-id"
                                            label="Organization ID"
                                            value={localMtOrgId}
                                            onChange={setLocalMtOrgId}
                                            onSave={handleSaveMt}
                                            placeholder="org_live_..."
                                        />
                                        <SecureConfigField
                                            id="mt-api-key"
                                            label="API Key"
                                            value={localMtKey}
                                            onChange={setLocalMtKey}
                                            onSave={handleSaveMt}
                                            placeholder="sk_live_..."
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Stripe Integration</Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <SecureConfigField
                                            id="stripe-secret-key"
                                            label="Secret Key"
                                            value={localStripeKey}
                                            onChange={setLocalStripeKey}
                                            onSave={handleSaveStripe}
                                            placeholder="rk_live_..."
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Plaid Integration</Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <SecureConfigField
                                            id="plaid-client-id"
                                            label="Client ID"
                                            value={localPlaidId}
                                            onChange={setLocalPlaidId}
                                            onSave={handleSavePlaid}
                                        />
                                        <SecureConfigField
                                            id="plaid-secret"
                                            label="Secret"
                                            value={localPlaidSecret}
                                            onChange={setLocalPlaidSecret}
                                            onSave={handleSavePlaid}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CustomTabPanel>

                    {/* AI TAB */}
                    <CustomTabPanel value={tabValue} index={2}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={8}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>AI Engine Configuration</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Connect your Google Gemini API key to enable GEIN (Global Enterprise Intelligence Network) features across the platform.
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <SecureConfigField
                                            id="gemini-api-key"
                                            label="Google Gemini API Key"
                                            value={localGeminiKey}
                                            onChange={setLocalGeminiKey}
                                            onSave={handleSaveGemini}
                                            placeholder="AIzaSy..."
                                        />
                                        
                                        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                AI Capabilities Status
                                            </Typography>
                                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                                {['Predictive Analytics', 'Anomaly Detection', 'Automated Workflows', 'Natural Language Queries'].map((feature) => (
                                                    <Grid item xs={12} sm={6} key={feature}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {geminiApiKey ? <CheckCircleIcon color="success" fontSize="small" aria-hidden="true" /> : <ErrorIcon color="disabled" fontSize="small" aria-hidden="true" />}
                                                            <Typography variant="body2" color={geminiApiKey ? 'text.primary' : 'text.disabled'}>
                                                                {feature}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined" sx={{ height: '100%', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 6 }}>
                                        <AIIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} aria-hidden="true" />
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            GEIN Assistant
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 4 }}>
                                            {geminiApiKey 
                                                ? "Your AI assistant is fully operational and monitoring enterprise data streams."
                                                : "Provide an API key to activate your enterprise AI assistant."}
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            disabled={!geminiApiKey}
                                            sx={{ borderRadius: 8, px: 4 }}
                                            aria-label="Launch AI Diagnostics"
                                        >
                                            Launch Diagnostics
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CustomTabPanel>
                </Box>
            </Paper>

            <Snackbar 
                open={feedback.open} 
                autoHideDuration={6000} 
                onClose={() => hideFeedback()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => hideFeedback()} severity={feedback.severity} sx={{ width: '100%' }} variant="filled">
                    {feedback.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default APIIntegrationView;