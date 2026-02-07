import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YoutubeEmbedComponent } from './youtube-embed.component';

describe('YoutubeEmbedComponent', () => {
  let component: YoutubeEmbedComponent;
  let fixture: ComponentFixture<YoutubeEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeEmbedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(YoutubeEmbedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should validate youtube.com URLs', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.isValidYoutubeUrl()).toBeTruthy();
  });

  it('should validate youtu.be URLs', () => {
    fixture.componentRef.setInput('videoUrl', 'https://youtu.be/dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.isValidYoutubeUrl()).toBeTruthy();
  });

  it('should reject non-youtube URLs', () => {
    fixture.componentRef.setInput('videoUrl', 'https://vimeo.com/123456');
    fixture.detectChanges();
    expect(component.isValidYoutubeUrl()).toBeFalsy();
  });

  it('should extract video ID from youtube.com/watch URL', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.videoId()).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from youtu.be URL', () => {
    fixture.componentRef.setInput('videoUrl', 'https://youtu.be/dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.videoId()).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from embed URL', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.videoId()).toBe('dQw4w9WgXcQ');
  });

  it('should generate correct thumbnail URL', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.thumbnailUrl()).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  });

  it('should generate correct watch URL', () => {
    fixture.componentRef.setInput('videoUrl', 'https://youtu.be/dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.watchUrl()).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });

  it('should create safe video URL for embedding', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.safeVideoUrl()).toBeTruthy();
  });

  it('should handle URLs without protocol', () => {
    fixture.componentRef.setInput('videoUrl', 'youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    expect(component.isValidYoutubeUrl()).toBeTruthy();
    expect(component.videoId()).toBe('dQw4w9WgXcQ');
  });

  it('should set embedFailed on error', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    
    expect(component.embedFailed()).toBeFalsy();
    component.onEmbedError();
    expect(component.embedFailed()).toBeTruthy();
  });

  it('should render iframe when valid URL and not failed', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();

    const iframe = fixture.nativeElement.querySelector('iframe');
    expect(iframe).toBeTruthy();
  });

  it('should render fallback when embed fails', () => {
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    fixture.detectChanges();
    component.onEmbedError();
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('.video-fallback');
    expect(fallback).toBeTruthy();
  });

  it('should not render anything for invalid URLs', () => {
    fixture.componentRef.setInput('videoUrl', 'https://vimeo.com/123456');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.video-container');
    const fallback = fixture.nativeElement.querySelector('.video-fallback');
    expect(container).toBeFalsy();
    expect(fallback).toBeFalsy();
  });
});
