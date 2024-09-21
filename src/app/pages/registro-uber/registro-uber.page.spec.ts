import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroUberPage } from './registro-uber.page';

describe('RegistroUberPage', () => {
  let component: RegistroUberPage;
  let fixture: ComponentFixture<RegistroUberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroUberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
