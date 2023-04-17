import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QRReader } from './qr-reader.page';

describe('AccountPage', () => {
  let component: QRReader;
  let fixture: ComponentFixture<QRReader>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QRReader],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(QRReader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
