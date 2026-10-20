import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedSEOHead } from '@/components/ui/enhanced-seo-head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS, scoreCharacterQuiz, type QuizMatch } from '@shared/character-quiz';

export default function CharacterQuiz() {
  useEffect(() => {
    document.title = "Which Manhattan Billionaire Is Your Match? | Reese Astor";
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [result, setResult] = useState<QuizMatch | null>(null);

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResult(scoreCharacterQuiz(newAnswers));
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

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-background to-primary/5">
      <EnhancedSEOHead
        title="Which Manhattan Billionaire Is Your Match? | Reese Astor"
        description="Take the fun character quiz to discover which Manhattan Money Kings billionaire is your perfect match. Find your book boyfriend from Reese Astor's romance series."
        canonical="/quiz"
        keywords={["romance character quiz", "book boyfriend quiz", "Manhattan Money Kings quiz", "billionaire romance quiz", "Reese Astor quiz"]}
      />
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
                Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <CardTitle className="text-2xl font-playfair">
              {QUIZ_QUESTIONS[currentQuestion].question}
            </CardTitle>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
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
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See My Match!'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
