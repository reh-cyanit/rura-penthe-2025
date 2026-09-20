import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, ElementRef, inject, input, TemplateRef } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-collapsible-content',
  imports: [NgTemplateOutlet],
  styleUrl: './collapsible-content.css',
    host: {
    role: 'region',
    '[class.open]': 'open()',
  },
  template: `
    @if (contentShown()) {
      <div class="collapsible-content">
        @if (template(); as lazy) {
          <ng-container *ngTemplateOutlet="lazy"/>
        }
        <ng-content/>
      </div>
    }
  `,
})
export class CollapsibleContent {
  private readonly el = inject(ElementRef).nativeElement;

  readonly open = input(false);

  readonly contentShown = toSignal(
    toObservable(this.open).pipe(
      switchMap((open) =>
        open
          ? of(true)
          : fromEvent<TransitionEvent>(this.el, 'transitionend').pipe(
              filter(
                (e) =>
                  e.target === e.currentTarget &&
                  e.propertyName === 'grid-template-rows'
              ),
              map(() => false)
            )
      )
    )
  );

  readonly template = contentChild<TemplateRef<unknown>>('collapsibleContent');
}
