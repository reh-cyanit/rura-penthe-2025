import { Component, computed, OnDestroy, OnInit, signal } from "@angular/core";

@Component({
  selector: "app-time-capsule",
  imports: [],
  templateUrl: "./time-capsule.html",
  styleUrl: "./time-capsule.css"
})
export class TimeCapsule implements OnInit, OnDestroy {
  private countDownDate: Date = new Date(2028, 1, 29, 12, 0, 0);

  private remainingMs = signal(0);
  private intervalId?: ReturnType<typeof setInterval>;

  readonly days = computed(() => Math.max(0, Math.floor(this.remainingMs() / (1000 * 60 * 60 * 24))));
  readonly hours = computed(() => Math.max(0, Math.floor((this.remainingMs() / (1000 * 60 * 60)) % 24)));
  readonly minutes = computed(() => Math.max(0, Math.floor((this.remainingMs() / (1000 * 60)) % 60)));
  readonly seconds = computed(() => Math.max(0, Math.floor((this.remainingMs() / 1000) % 60)));

  ngOnInit(): void {
    this.updateCountDown();
    this.intervalId = setInterval(() => this.updateCountDown(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private updateCountDown() {
    this.remainingMs.set(this.countDownDate.getTime() - Date.now());
  }
}
