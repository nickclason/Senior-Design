import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioHoldingsComponent } from './portfolio-holdings.component';

describe('PortfolioHoldingsComponent', () => {
  let component: PortfolioHoldingsComponent;
  let fixture: ComponentFixture<PortfolioHoldingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioHoldingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
