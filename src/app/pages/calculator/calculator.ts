import { registerLocaleData, CurrencyPipe } from "@angular/common";
import { MatSelectModule } from "@angular/material/select"
import { Component, LOCALE_ID, NgModule } from "@angular/core";

import de from "@angular/common/locales/de";
import { MatRadioModule } from "@angular/material/radio";
registerLocaleData(de);


@Component({
  selector: "app-calculator",
  imports: [
    MatRadioModule,
    MatSelectModule,
    CurrencyPipe
  ],
  templateUrl: "./calculator.html",
  styleUrl: "./calculator.css"
})

export class Calculator {

  protected nightSelection = [
    { count: 1, value: "1 Übernachtung" },
    { count: 2, value: "2 Übernachtungen" },
    { count: 3, value: "3 Übernachtungen" },
    { count: 4, value: "4 Übernachtungen" },
    { count: 5, value: "5 Übernachtungen" },
    { count: 6, value: "6 Übernachtungen" },
    { count: 7, value: "7 Übernachtungen" },
    { count: 8, value: "8 Übernachtungen" }, 
  ];

  protected ageSelection = [
    {"name": "Erwachsener", value: 1.0, "checked": true},
    {"name": "0 - 5 Jahre", value: 0.0, "checked": false},
    {"name": "6 - 10 Jahre", value: 0.3333, "checked": false},
    {"name": "11 - 15 Jahre", value: 0.6666, "checked": false}
  ];

  private discount: number = 0.01;
  private ageDiscount: number = 1.0;
  
  protected nightPrice: number = 42.0;
  protected amount: number = 0;
  protected nightCount: number = 0;


  protected onDaySelectionChange(event: any) {
    if (event.value) {
      this.nightCount = event.value;
      this.calculateAmount(1);
    }
  }

  protected onAgeSelectionChange(event: any) {

     this.ageDiscount = event.value;
     this.calculateAmount(1);
  }

  protected calculateAmount(dayCount: number) {
    this.amount = this.calculate(dayCount, this.nightPrice, 0.0) * this.ageDiscount;
  }

  private calculate(calculatedDays: number, sub: number, perc: number): number {

    if (calculatedDays === this.nightCount) {
      return sub;
    }
    
    calculatedDays = calculatedDays + 1;
    let percent = calculatedDays *  this.discount + perc;
    let discount = this.nightPrice * percent;
    sub = (sub + this.nightPrice) - discount;

    return this.calculate(calculatedDays, sub, percent);
  }
}
