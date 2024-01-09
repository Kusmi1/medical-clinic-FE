import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorNurseComponent } from './add-doctor-nurse.component';

describe('AddDoctorNurseComponent', () => {
  let component: AddDoctorNurseComponent;
  let fixture: ComponentFixture<AddDoctorNurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoctorNurseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorNurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
