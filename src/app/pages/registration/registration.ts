import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-registration",
  imports: [],
  templateUrl: "./registration.html",
  styleUrl: "./registration.css"
})

export class Registration {
  @Output() public jump = new EventEmitter<string>;

  protected handleClick(event: KeyboardEvent | MouseEvent) {
    if (event instanceof MouseEvent || event.key === "Enter" || event.key === " ") {
      this.jump.emit("calculator");
    }
  }
}
