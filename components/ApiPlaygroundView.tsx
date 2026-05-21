import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Importing the OpenAPI specification type and the new API client
import { OpenAPISpec } from '../types/openapi';
import apiClient from '../api/client';

const ApiPlaygroundView: React.FC = () => {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Dynamic fetcher using the new API client
        const response = await apiClient.get<OpenAPISpec>('/api/docs/spec.json');
        setSpec(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load OpenAPI specification. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!spec) {
    return (
      <Box p={3}>
        <Alert severity="info">No API specification data available.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {spec.info?.title || 'API Playground'}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={`Version: ${spec.info?.version || '1.0.0'}`} color="primary" variant="outlined" />
          {spec.openapi && (
            <Chip label={`OAS ${spec.openapi}`} color="secondary" variant="outlined" />
          )}
        </Stack>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
          {spec.info?.description || 'Explore and test the API endpoints.'}
        </Typography>

        {spec.servers && spec.servers.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Available Servers
            </Typography>
            <Stack direction="row" spacing={1}>
              {spec.servers.map((server, index) => (
                <Chip key={index} label={server.url} size="small" sx={{ fontFamily: 'monospace' }} />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Endpoints
      </Typography>

      {spec.paths && Object.entries(spec.paths).map(([path, methods]) => (
        <Box key={path} sx={{ mb: 3 }}>
          {Object.entries(methods).map(([method, details]: [string, any]) => {
            const methodColor = 
              method === 'get' ? 'info' : 
              method === 'post' ? 'success' : 
              method === 'put' ? 'warning' : 
              method === 'delete' ? 'error' : 'default';

            return (
              <Accordion key={`${path}-${method}`} variant="outlined" sx={{ mb: 1, borderLeft: 4, borderColor: `${methodColor}.main` }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <Chip 
                      label={method.toUpperCase()} 
                      color={methodColor as any}
                      size="small"
                      sx={{ fontWeight: 'bold', minWidth: 80, borderRadius: 1 }}
                    />
                    <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {path}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', mr: 2, display: { xs: 'none', sm: 'block' } }}>
                      {details.summary}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'background.default', borderTop: 1, borderColor: 'divider', pt: 3 }}>
                  <Typography variant="body1" paragraph>
                    {details.description || details.summary || 'No description available.'}
                  </Typography>
                  
                  {details.tags && details.tags.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                      {details.tags.map((tag: string) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  )}

                  {details.parameters && details.parameters.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Parameters
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        {details.parameters.map((param: any, idx: number) => (
                          <Box key={param.name} sx={{ mb: idx !== details.parameters.length - 1 ? 2 : 0 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {param.name} <Typography component="span" variant="caption" color="error">{param.required ? '*' : ''}</Typography>
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              in: {param.in}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {param.description}
                            </Typography>
                            {idx !== details.parameters.length - 1 && <Divider sx={{ mt: 2 }} />}
                          </Box>
                        ))}
                      </Paper>
                    </Box>
                  )}

                  {details.responses && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Responses
                      </Typography>
                      <Stack spacing={1}>
                        {Object.entries(details.responses).map(([statusCode, response]: [string, any]) => (
                          <Paper key={statusCode} variant="outlined" sx={{ p: 1.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Chip 
                              label={statusCode} 
                              size="small" 
                              color={statusCode.startsWith('2') ? 'success' : statusCode.startsWith('4') || statusCode.startsWith('5') ? 'error' : 'default'}
                              sx={{ fontWeight: 'bold' }}
                            />
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {response.description}
                            </Typography>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default ApiPlaygroundView;