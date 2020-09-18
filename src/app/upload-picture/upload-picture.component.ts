import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.css']
})
export class UploadPictureComponent {
  @Input() roundCropper: boolean;
  imageChangedEvent: any = '';
  droppedSourceImage: any = '';
  displayValidationError = false;
  isSubmitBtnDisabled = true;
  private browsedImage: any = '';
  // droppedImage is a duplicate of droppedSourceImage.
  // If only droppedSourceImage is used - source image is replaced by the image within cropper, each time cropper is moved.
  private droppedImage: any = '';
  private isFileValid: boolean;
  // Error messages:
  errorMessage: string;
  private invalidFileTypeMsg = 'Image format invalid. \n Allowed formats: .jpeg, .jpg, .png and .gif';
  private loadImageErrorMsg = 'Could not load file. \n Please try again';
  private submitImageErrorMsg = 'Ooops! Something went wrong. \n Changes have not been applied';

  constructor(protected ref: NbDialogRef<any>){}

  getImage(event){
    this.displayValidationError = false;
    this.validateFileType(event);
    if (this.isFileValid){
      event.name ? this.handleDroppedFileUpload(event) : this.imageChangedEvent = event;
      this.isSubmitBtnDisabled = false;
    }else{
      this.reset();
      event = null;
    }
  }

  submitCroppedImage(){
    let croppedImage: any =  '';

    if (this.droppedImage || this.browsedImage){
      croppedImage = this.droppedImage || this.browsedImage;

      // Getting base64 URL as blob:
      const imageAsBlob = base64ToFile(croppedImage);
      console.log(imageAsBlob);

      this.ref.close(croppedImage);
      this.reset();
    }else{
      this.errorMessage = this.submitImageErrorMsg;
      this.displayValidationError = true;
      croppedImage = '';
      this.reset();
    }
  }

  readyCropperImage(event: ImageCroppedEvent){
    this.browsedImage = event.base64;
    this.droppedImage = event.base64;
  }

  closeDialog(){
    this.ref.close();
    this.reset();
  }

  loadImageFailed() {
    this.errorMessage = this.loadImageErrorMsg;
    this.displayValidationError = true;
    this.reset();
  }

  // Converting dropped image to base64
  // Needed for cropper to work on dropped image.
  // After drag-and-dropping image this event returns a File.
  // For more - check 'drag-drop.directive.ts'
  private handleDroppedFileUpload(event) {
    this.imageChangedEvent = event;
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      this.droppedSourceImage = reader.result;
      this.droppedImage = reader.result;
    };
  }

  private validateFileType(event){
    const fileName = (event.name || event.target.files[0].name);
    const identifyDot = fileName.lastIndexOf('.') + 1;
    const fileExt = fileName.substr(identifyDot, fileName.length).toLowerCase();
    if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png' || fileExt === 'gif' ){
      this.isFileValid = true;
    }else{
      this.errorMessage = this.invalidFileTypeMsg;
      this.displayValidationError = true;
      this.isFileValid = false;
    }
  }

  private reset() {
    this.imageChangedEvent = '';
    this.droppedSourceImage = '';
    this.isSubmitBtnDisabled = true;
  }

}
