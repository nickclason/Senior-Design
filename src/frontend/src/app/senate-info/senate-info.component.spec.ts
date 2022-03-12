import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenateInfoComponent } from './senate-info.component';

describe('SenateInfoComponent', () => {
  let component: SenateInfoComponent;
  let fixture: ComponentFixture<SenateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenateInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
