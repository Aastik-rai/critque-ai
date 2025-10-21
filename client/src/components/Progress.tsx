import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Schedule,
  Psychology
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface ProgressData {
  date: string;
  confidence: number;
}

interface Stats {
  averageCompletion: number;
  averageConfidence: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
}

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [confidenceResponse, statsResponse] = await Promise.all([
        axios.get('/api/progress/confidence'),
        axios.get('/api/progress/stats')
      ]);

      setProgressData(confidenceResponse.data);
      setStats(statsResponse.data);
    } catch (err: any) {
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4caf50';
    if (confidence >= 60) return '#ff9800';
    return '#f44336';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Excellent';
    if (confidence >= 60) return 'Good';
    if (confidence >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your progress...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Progress
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Psychology color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{stats.averageConfidence}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Confidence
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircle color="success" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{stats.averageCompletion}%</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completion Rate
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Schedule color="warning" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{stats.streak}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Day Streak
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TrendingUp color="secondary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{stats.completedTasks}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasks Completed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Confidence Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confidence Trend
            </Typography>
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Confidence']}
                    labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No progress data available yet. Complete some tasks to see your confidence trend!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Current Status */}
        {stats && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Status
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Typography variant="body1" gutterBottom>
                      Confidence Level
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress 
                        variant="determinate" 
                        value={stats.averageConfidence} 
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="h6">
                        {stats.averageConfidence}
                      </Typography>
                    </Box>
                    <Chip 
                      label={getConfidenceLabel(stats.averageConfidence)}
                      color={stats.averageConfidence >= 60 ? 'success' : 'warning'}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Typography variant="body1" gutterBottom>
                      Task Completion
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress 
                        variant="determinate" 
                        value={stats.averageCompletion} 
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="h6">
                        {stats.averageCompletion}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {stats.completedTasks} of {stats.totalTasks} tasks completed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Progress;
