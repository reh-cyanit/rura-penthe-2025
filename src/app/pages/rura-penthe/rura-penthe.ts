import { Component, ViewChild } from "@angular/core";
import { Registration } from "../registration/registration";
import { WhatsIs } from "../whats-is/whats-is";
import { Termin } from "../termin/termin";
import { Impressum } from "../impressum/impressum";
import { Calculator } from "../calculator/calculator";
import { Collapsible } from "../../components/collapsible/collapsible";
import { Endor } from "../endor/endor";
import { TimeCapsule } from "../time-capsule/time-capsule";

@Component({
  selector: "app-rura-penthe",
  imports: [
    WhatsIs,
    Termin,
    Endor,
    Registration,
    Impressum,
    Calculator,
    Collapsible,
    TimeCapsule
],
  templateUrl: "./rura-penthe.html",
  styleUrl: './rura-penthe.css'
})

export class RuraPenthe  {
  @ViewChild("colWhatsIs") colWhatsIs!: Collapsible; 
  @ViewChild("colTermin") colTermin!: Collapsible;
  @ViewChild("colEndor") colEndor!: Collapsible;
  @ViewChild("colCalcalculator") colCalcalculator!: Collapsible;
  @ViewChild("colRegistration") colRegistration!: Collapsible;
  @ViewChild("colImpressum") colImpressum!: Collapsible;

  protected openCollapsible(col: string) {
    
      if (col === "calculator") {
        this.colWhatsIs.setOpen(false);
        this.colTermin.setOpen(false);
        this.colEndor.setOpen(false);
        this.colCalcalculator.setOpen(true);
        this.colRegistration.setOpen(false);
        this.colImpressum.setOpen(false);
      }
  }
}
