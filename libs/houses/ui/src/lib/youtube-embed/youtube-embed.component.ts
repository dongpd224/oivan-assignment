import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-houses-youtube-embed',
  standalone: true,
  template: `
    @if (isValidYoutubeUrl()) {
      @if (!embedFailed()) {
        <div class="video-container">
          <iframe
            [src]="safeVideoUrl()"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
            (error)="onEmbedError()"></iframe>
        </div>
      } @else {
        <!-- Fallback: thumbnail + link -->
        <a [href]="watchUrl()" target="_blank" rel="noopener" class="video-fallback">
          <img [src]="thumbnailUrl()" [alt]="'Video thumbnail'" class="video-thumbnail">
          <div class="play-overlay">
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
              <path d="M 45,24 27,14 27,34" fill="#fff"></path>
            </svg>
          </div>
          <span class="watch-text">Xem trên YouTube</span>
        </a>
      }
    }
  `,
  styles: [`
    :host {
      display: block;
      max-width: 400px;
    }

    .video-container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      border-radius: 8px;
    }
    
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .video-fallback {
      position: relative;
      display: block;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      text-decoration: none;
    }

    .video-thumbnail {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
    }

    .play-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.9;
      transition: opacity 0.2s;
    }

    .play-overlay svg {
      width: 48px;
      height: 34px;
    }

    .video-fallback:hover .play-overlay {
      opacity: 1;
    }

    .watch-text {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
    }
  `]
})
export class YoutubeEmbedComponent {
  private sanitizer = inject(DomSanitizer);
  
  videoUrl = input.required<string>();
  embedFailed = signal(false);

  isValidYoutubeUrl = computed(() => {
    const url = this.videoUrl();
    return url.includes('youtube.com') || url.includes('youtu.be');
  });

  videoId = computed(() => {
    const url = this.normalizeUrl(this.videoUrl());
    
    if (url.includes('youtube.com/watch')) {
      return new URL(url).searchParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1]?.split('?')[0] || '';
    }
    return '';
  });

  thumbnailUrl = computed(() => {
    const id = this.videoId();
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  });

  watchUrl = computed(() => {
    const id = this.videoId();
    return id ? `https://www.youtube.com/watch?v=${id}` : this.normalizeUrl(this.videoUrl());
  });

  safeVideoUrl = computed(() => {
    if (!this.isValidYoutubeUrl()) {
      return null;
    }
    const id = this.videoId();
    const embedUrl = id ? `https://www.youtube.com/embed/${id}` : this.normalizeUrl(this.videoUrl());
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  });

  onEmbedError() {
    this.embedFailed.set(true);
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }
}
