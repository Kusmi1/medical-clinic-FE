import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent {
  languages = ['pl', 'en'];
  constructor(public translate: TranslateService) {
    translate.addLangs(['pl', 'en']);
    translate.setDefaultLang('pl');
    translate.use('pl');
  }
  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
