import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import axios from 'axios';

interface Question {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options?: string[];
  min?: number;
  max?: number;
}

const Assessment: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/assessment/questions');
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to load assessment questions');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId') || 'temp-user-id';
      const response = await axios.post('/api/assessment/submit', {
        userId,
        responses
      });

      if (response.data.plan) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const currentResponse = responses[question.id];

    switch (question.type) {
      case 'single':
        return (
          <RadioGroup
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
          >
            {question.options?.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        );

      case 'multiple':
        return (
          <Box>
            {question.options?.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={currentResponse?.includes(option) || false}
                    onChange={(e) => {
                      const current = currentResponse || [];
                      const updated = e.target.checked
                        ? [...current, option]
                        : current.filter((item: string) => item !== option);
                      handleResponse(question.id, updated);
                    }}
                  />
                }
                label={option}
              />
            ))}
          </Box>
        );

      case 'scale':
        return (
          <Box sx={{ px: 2 }}>
            <Slider
              value={currentResponse || 5}
              onChange={(_, value) => handleResponse(question.id, value)}
              min={question.min || 1}
              max={question.max || 10}
              step={1}
              marks
              valueLabelDisplay="on"
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2">{question.min || 1}</Typography>
              <Typography variant="body2">{question.max || 10}</Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading assessment...
        </Typography>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">No questions available</Alert>
      </Container>
    );
  }

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Personal Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Help us understand your goals and create a personalized plan
          </Typography>
        </Box>

        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {questions.map((_, index) => (
            <Step key={index}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.question}
          </Typography>
          <FormControl component="fieldset" fullWidth>
            {renderQuestion(currentQuestion)}
          </FormControl>
        </Paper>

        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          
          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Complete Assessment'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Assessment;
