import { AfterViewInit, Component, computed, ElementRef, Input, OnDestroy, signal, viewChild } from '@angular/core';
import { CollapsibleContent } from '../collapsibleContent/collapsible-content';

@Component({
  selector: 'app-collapsible',
  imports: [CollapsibleContent],
  styleUrl: './collapsible.css',
  templateUrl: "./collapsible.html"
})

export class Collapsible  implements AfterViewInit, OnDestroy {
  @Input() public title = "";
  @Input() public icon: undefined | string = "";

    readonly titleText = computed(() => this.title); 
    protected open = signal(false);
    readonly text = computed(() => (this.open() ? 'schließen' : 'öffen'));
    readonly collapsibleEl = viewChild.required(CollapsibleContent, {
      read: ElementRef,
    });
    readonly height = signal(0);
    ro?: ResizeObserver;

    ngAfterViewInit(): void {
      const el = this.collapsibleEl().nativeElement;
      this.ro = new ResizeObserver(() => this.height.set(el.offsetHeight));
      this.ro.observe(el);
    }

    ngOnDestroy(): void {
      this.ro?.disconnect();
    }

    public setOpen(isOpen: boolean) {
      this.open.set(isOpen);
    }
}
