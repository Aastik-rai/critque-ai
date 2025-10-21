import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Schedule,
  Psychology
} from '@mui/icons-material';
import axios from 'axios';

interface Plan {
  _id: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    completed: boolean;
    estimatedTime: number;
  }>;
  confidenceImpact: number;
}

interface Stats {
  averageCompletion: number;
  averageConfidence: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
}

const Dashboard: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [planResponse, statsResponse] = await Promise.all([
        axios.get('/api/plans/today'),
        axios.get('/api/progress/stats')
      ]);

      setPlan(planResponse.data);
      setStats(statsResponse.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No plan found for today. Generate one to get started!');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/plans/generate');
      setPlan(response.data.plan);
      setError('');
    } catch (err: any) {
      setError('Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return '💪';
      case 'career': return '💼';
      case 'health': return '🏥';
      case 'relationships': return '❤️';
      case 'learning': return '📚';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Dashboard
      </Typography>

      {error && (
        <Alert 
          severity="info" 
          action={
            <Button color="inherit" onClick={handleGeneratePlan}>
              Generate Plan
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TrendingUp color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{stats.averageConfidence}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confidence Score
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
                    <Psychology color="secondary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{stats.completedTasks}/{stats.totalTasks}</Typography>
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

        {/* Today's Plan */}
        {plan && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Today's Plan</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.href = '/plan'}
                >
                  View Full Plan
                </Button>
              </Box>

              <Grid container spacing={2}>
                {plan.tasks.slice(0, 4).map((task) => (
                  <Grid item xs={12} sm={6} md={3} key={task.id}>
                    <Card 
                      sx={{ 
                        opacity: task.completed ? 0.7 : 1,
                        border: task.completed ? '2px solid #4caf50' : '1px solid #e0e0e0'
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Typography variant="h6" component="span" sx={{ mr: 1 }}>
                            {getCategoryIcon(task.category)}
                          </Typography>
                          <Chip 
                            label={task.priority} 
                            size="small" 
                            color={getPriorityColor(task.priority) as any}
                          />
                        </Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {task.description}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption">
                            {task.estimatedTime} min
                          </Typography>
                          {task.completed && (
                            <CheckCircle color="success" fontSize="small" />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {plan.tasks.length > 4 && (
                <Box textAlign="center" mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    +{plan.tasks.length - 4} more tasks
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
