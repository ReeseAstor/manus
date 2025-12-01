import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Heart, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const questions = [
  {
    question: "What's your ideal date night?",
    options: [
      "Fancy dinner at a Michelin-star restaurant",
      "Adventure like skydiving or rock climbing",
      "Quiet night at home with wine and conversation",
    ],
  },
  {
    question: "What quality do you value most in a partner?",
    options: [
      "Ambition and success",
      "Spontaneity and fun",
      "Loyalty and depth",
    ],
  },
  {
    question: "How do you handle conflict?",
    options: [
      "Direct and decisive - address it immediately",
      "Avoid it with humor and distraction",
      "Take time to process, then discuss deeply",
    ],
  },
  {
    question: "What's your perfect vacation?",
    options: [
      "Luxury resort with spa and fine dining",
      "Backpacking through Europe",
      "Secluded cabin in the mountains",
    ],
  },
  {
    question: "What attracts you most?",
    options: [
      "Power and confidence",
      "Charm and wit",
      "Mystery and intensity",
    ],
  },
];

export default function CharacterQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const quizMutation = trpc.ai.submitQuiz.useMutation({
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit quiz
      quizMutation.mutate({ answers: newAnswers });
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
    setResult(null);
  };

  if (result) {
    return (
      <div className="min-h-screen py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container max-w-3xl">
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-playfair">
                Your Perfect Match: {result.character}
              </CardTitle>
              <div className="text-5xl font-bold text-primary">
                {result.matchPercentage}% Match
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold mb-3">Your Personality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {result.personality}
                </p>
              </div>

              <div className="bg-primary/5 rounded-lg p-6 space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Recommended Book
                </h3>
                <p className="text-lg font-medium">{result.bookRecommendation}</p>
                <p className="text-muted-foreground">{result.reason}</p>
                <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90">
                  <a href={result.bookLink} target="_blank" rel="noopener noreferrer">
                    <Heart className="mr-2 h-4 w-4" />
                    Get Your Book
                  </a>
                </Button>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleRestart} variant="outline" className="flex-1">
                  Take Quiz Again
                </Button>
                <Button asChild variant="default" className="flex-1">
                  <a href="/books">View All Books</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Analyzing your answers...</p>
            <p className="text-sm text-muted-foreground">
              Finding your perfect Manhattan Money King match!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Which Manhattan Money King is Your Perfect Match?
          </h1>
          <p className="text-lg text-muted-foreground">
            Answer 5 quick questions to discover your ideal billionaire romance!
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <CardTitle className="text-2xl font-playfair">
              {questions[currentQuestion].question}
            </CardTitle>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                      selectedAnswer === option
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => setSelectedAnswer(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See My Match!'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
