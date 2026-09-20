import { Component, computed, Input, signal } from '@angular/core';
import { CollapsibleContent } from '../collapsibleContent/collapsible-content';

@Component({
  selector: 'app-collapsible',
  imports: [CollapsibleContent],
  styleUrl: './collapsible.css',
  templateUrl: "./collapsible.html"
})

export class Collapsible {
  @Input() public title = "";
  @Input() public icon: undefined | string = "";

    protected open = signal(false);
    readonly text = computed(() => (this.open() ? 'schließen' : 'öffen'));

    public setOpen(isOpen: boolean) {
      this.open.set(isOpen);
    }
}
