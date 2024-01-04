import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsPreviewComponent } from './appointments-preview.component';

describe('AppointmentsPreviewComponent', () => {
  let component: AppointmentsPreviewComponent;
  let fixture: ComponentFixture<AppointmentsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
