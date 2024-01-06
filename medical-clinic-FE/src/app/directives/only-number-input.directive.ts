import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumberInput]',
})
export class OnlyNumberInputDirective {
  private readonly regEx = new RegExp('^[0-9]*$');

  constructor(private el: ElementRef) {}

  @Input() OnlyNumber = true;
  @Input() maxlength = 11;
  @Input() minlength = 11;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.OnlyNumber) {
      if (
        [46, 8, 9, 27, 13, 110, 190].indexOf(event.keyCode) !== -1 ||
        (event.keyCode == 65 && event.ctrlKey === true) ||
        (event.keyCode == 67 && event.ctrlKey === true) ||
        (event.keyCode == 86 && event.ctrlKey === true) ||
        (event.keyCode == 88 && event.ctrlKey === true) ||
        (event.keyCode >= 35 && event.keyCode <= 39)
      ) {
        return;
      }

      if (!this.isValid(event.key)) event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    const pastedText = e.clipboardData!.getData('text/plain');
    if (pastedText && !this.isValid(pastedText)) {
      e.preventDefault();
    }
  }
  private isValid(eligible: string): boolean {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(eligible);
    return this.regEx.test(eligible) && !this.isOverSize(next);
  }
  private isOverSize(str: string): boolean {
    if (this.maxlength && str) {
      return str.length > this.maxlength;
    }
    return false;
  }
}
