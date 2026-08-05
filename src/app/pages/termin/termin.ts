import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-termin",
  imports: [],
  templateUrl: "./termin.html",
  styleUrl: "./termin.css"
})

export class Termin {
@Output() public jump = new EventEmitter<string>;

protected handleClick(event: KeyboardEvent | MouseEvent) {
  if (event instanceof MouseEvent || event.key === "Enter" || event.key === " ") {
    console.log("Div button clicked!");
    this.jump.emit("calculator");
  }
}


}
