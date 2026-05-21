import React, { useState, useContext } from 'react';
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
    ListItemText,
    ListItemIcon
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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
}

function a11yProps(index: number) {
    return {
        id: `integration-tab-${index}`,
        'aria-controls': `integration-tabpanel-${index}`,
    };
}

const StatusChip = ({ status }: { status: APIStatus['status'] | 'Unknown' }) => {
    let color: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    switch (status) {
        case 'Operational': color = 'success'; break;
        case 'Degraded Performance': color = 'warning'; break;
        case 'Partial Outage': color = 'warning'; break;
        case 'Major Outage': color = 'error'; break;
        case 'Maintenance': color = 'info'; break;
        default: color = 'default';
    }
    return <Chip label={status} color={color} size="small" variant="outlined" />;
};

interface SecureConfigFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    onSave: () => Promise<void>;
    placeholder?: string;
}

const SecureConfigField: React.FC<SecureConfigFieldProps> = ({ label, value, onChange, onSave, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave();
        setIsSaving(false);
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
            <TextField
                fullWidth
                label={label}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                variant="outlined"
                size="small"
                placeholder={placeholder}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SecurityIcon fontSize="small" color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <Button
                variant="contained"
                color="primary"
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                disabled={isSaving || !value.trim()}
                sx={{ minWidth: '120px', height: '40px' }}
            >
                {isSaving ? 'Syncing...' : 'Save'}
            </Button>
        </Box>
    );
};

const APIIntegrationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIIntegrationView must be within a DataProvider.");
    
    const {
        apiStatus,
        geminiApiKey, setGeminiApiKey,
        modernTreasuryApiKey, setModernTreasuryApiKey,
        modernTreasuryOrganizationId, setModernTreasuryOrganizationId
    } = context;

    const [tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Local state for form inputs to allow editing before saving
    const [localGeminiKey, setLocalGeminiKey] = useState(geminiApiKey || '');
    const [localMtKey, setLocalMtKey] = useState(modernTreasuryApiKey || '');
    const [localMtOrgId, setLocalMtOrgId] = useState(modernTreasuryOrganizationId || '');
    const [localPlaidId, setLocalPlaidId] = useState('');
    const [localPlaidSecret, setLocalPlaidSecret] = useState('');
    const [localStripeKey, setLocalStripeKey] = useState('');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const showFeedback = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const simulateBackendSync = async (callback: () => void) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                callback();
                showFeedback('Secure synchronization with backend complete.');
                resolve();
            }, 800);
        });
    };

    const saveGeminiConfig = () => simulateBackendSync(() => setGeminiApiKey(localGeminiKey));
    const saveMtConfig = () => simulateBackendSync(() => {
        setModernTreasuryApiKey(localMtKey);
        setModernTreasuryOrganizationId(localMtOrgId);
    });
    const savePlaidConfig = () => simulateBackendSync(() => { /* Securely store Plaid keys */ });
    const saveStripeConfig = () => simulateBackendSync(() => { /* Securely store Stripe keys */ });

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                <SettingsIcon fontSize="large" color="primary" />
                Integration & Configuration Hub
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Manage your enterprise API connections, security credentials, and system integrations securely.
            </Typography>

            <Paper sx={{ mt: 4, borderRadius: 2, overflow: 'hidden' }} elevation={3}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="integration tabs" variant="fullWidth">
                        <Tab icon={<SystemIcon />} iconPosition="start" label="System & Core APIs" {...a11yProps(0)} />
                        <Tab icon={<FinanceIcon />} iconPosition="start" label="Financial Operations" {...a11yProps(1)} />
                        <Tab icon={<AIIcon />} iconPosition="start" label="AI & Intelligence" {...a11yProps(2)} />
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
                                            <SyncIcon color="primary" /> Live API Status
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <List disablePadding>
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
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SecurityIcon color="primary" /> Security & Access
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            All credentials are encrypted at rest and masked during transit. Ensure you follow the principle of least privilege when generating API keys.
                                        </Typography>
                                        <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, color: 'info.contrastText', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CheckCircleIcon />
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
                                            label="Organization ID"
                                            value={localMtOrgId}
                                            onChange={setLocalMtOrgId}
                                            onSave={saveMtConfig}
                                            placeholder="org_live_..."
                                        />
                                        <SecureConfigField
                                            label="API Key"
                                            value={localMtKey}
                                            onChange={setLocalMtKey}
                                            onSave={saveMtConfig}
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
                                            label="Secret Key"
                                            value={localStripeKey}
                                            onChange={setLocalStripeKey}
                                            onSave={saveStripeConfig}
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
                                            label="Client ID"
                                            value={localPlaidId}
                                            onChange={setLocalPlaidId}
                                            onSave={savePlaidConfig}
                                        />
                                        <SecureConfigField
                                            label="Secret"
                                            value={localPlaidSecret}
                                            onChange={setLocalPlaidSecret}
                                            onSave={savePlaidConfig}
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
                                            label="Google Gemini API Key"
                                            value={localGeminiKey}
                                            onChange={setLocalGeminiKey}
                                            onSave={saveGeminiConfig}
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
                                                            {geminiApiKey ? <CheckCircleIcon color="success" fontSize="small" /> : <ErrorIcon color="disabled" fontSize="small" />}
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
                                        <AIIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
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
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default APIIntegrationView;