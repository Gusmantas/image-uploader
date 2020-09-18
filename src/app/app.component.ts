import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-image';
  imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/1200px-SNice.svg.png';

  constructor(private dialogService: NbDialogService){}

  openDialog(roundCropper: boolean) {
    this.dialogService.open(UploadPictureComponent, {closeOnBackdropClick: false, context: { roundCropper } as any})
    .onClose.subscribe(image => {
      if (image){
        this.imageUrl = image;
      }else{
        image = this.imageUrl;
      }
    });
  }

}
