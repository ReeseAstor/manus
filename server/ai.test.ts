import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('AI Features', () => {
  it('should have AI router available', () => {
    expect(appRouter.ai).toBeDefined();
  });

  it('should have chat procedure', () => {
    expect(appRouter.ai.chat).toBeDefined();
  });

  it('should have submitQuiz procedure', () => {
    expect(appRouter.ai.submitQuiz).toBeDefined();
  });

  it('should have generateBlogPost procedure', () => {
    expect(appRouter.ai.generateBlogPost).toBeDefined();
  });

  it('should have generateStoryIdea procedure', () => {
    expect(appRouter.ai.generateStoryIdea).toBeDefined();
  });

  it('should have generateBookCover procedure', () => {
    expect(appRouter.ai.generateBookCover).toBeDefined();
  });

  it('should have generateCharacterPortrait procedure', () => {
    expect(appRouter.ai.generateCharacterPortrait).toBeDefined();
  });

  it('should have generateSocialGraphic procedure', () => {
    expect(appRouter.ai.generateSocialGraphic).toBeDefined();
  });
});
