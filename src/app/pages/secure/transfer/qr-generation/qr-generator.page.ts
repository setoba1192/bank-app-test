import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QRCodeService } from 'src/app/services/qr-code/qr-code.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.page.html',
  styleUrls: ['./qr-generator.page.scss'],
})
export class QRGeneratorPage implements OnInit {
  data: string;

  constructor(
    private qrCodeService: QRCodeService,
    private router : Router
  ) {}

  ngOnInit() {
    this.data = Buffer.from(
      JSON.stringify(this.qrCodeService.getQrData())
    ).toString('base64');
  }

  goHome(){
    this.router.navigateByUrl('/account')
  }
}
