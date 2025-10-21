import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Checkbox,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Flag
} from '@mui/icons-material';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  completed: boolean;
  estimatedTime: number;
  difficulty: string;
}

interface Plan {
  _id: string;
  tasks: Task[];
  confidenceImpact: number;
}

const PlanView: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const response = await axios.get('/api/plans/today');
      setPlan(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No plan found for today. Generate one to get started!');
      } else {
        setError('Failed to load plan');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    if (!plan) return;

    setUpdating(taskId);
    try {
      await axios.patch(`/api/plans/tasks/${taskId}`, {
        completed,
        planId: plan._id
      });

      // Update local state
      setPlan(prev => {
        if (!prev) return null;
        return {
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? { ...task, completed } : task
          )
        };
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setUpdating(null);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
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

  const completedTasks = plan?.tasks.filter(task => task.completed).length || 0;
  const totalTasks = plan?.tasks.length || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your plan...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">
          No plan available. Please generate a plan first.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Today's Plan
          </Typography>
          <Chip 
            label={`${completedTasks}/${totalTasks} completed`}
            color={completionRate === 100 ? 'success' : 'primary'}
          />
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={completionRate} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        <Typography variant="body1" color="text.secondary">
          Complete your tasks to boost your confidence score!
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {plan.tasks.map((task) => (
          <Grid item xs={12} md={6} key={task.id}>
            <Card 
              sx={{ 
                opacity: task.completed ? 0.8 : 1,
                border: task.completed ? '2px solid #4caf50' : '1px solid #e0e0e0',
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h6" component="span" sx={{ mr: 1 }}>
                    {getCategoryIcon(task.category)}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3">
                      {task.title}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Chip 
                      label={task.priority} 
                      size="small" 
                      color={getPriorityColor(task.priority) as any}
                    />
                    <Chip 
                      label={task.difficulty} 
                      size="small" 
                      color={getDifficultyColor(task.difficulty) as any}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {task.description}
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="caption">
                      {task.estimatedTime} minutes
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={task.completed}
                        onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                        disabled={updating === task.id}
                        color="success"
                      />
                    }
                    label={
                      task.completed ? (
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="body2" color="success.main">
                            Completed
                          </Typography>
                        </Box>
                      ) : (
                        'Mark as complete'
                      )
                    }
                  />
                </Box>

                {updating === task.id && (
                  <Box display="flex" justifyContent="center" mt={1}>
                    <CircularProgress size={20} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {completionRate === 100 && (
        <Paper sx={{ p: 3, mt: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              🎉 Congratulations!
            </Typography>
            <Typography variant="body1">
              You've completed all your tasks for today! Your confidence score will increase.
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default PlanView;
