import { FileValidator } from '@nestjs/common';
import * as fileType from 'file-type-mime';
import { Express } from 'express';

export interface CustomUploadTypeValidatorOptions {
  fileType: string[];
}

export class CustomUploadFileTypeValidator extends FileValidator {
  private _allowedMimeTypes: string[];

  constructor(
    protected readonly validationOptions: CustomUploadTypeValidatorOptions,
  ) {
    super(validationOptions);
    this._allowedMimeTypes = this.validationOptions.fileType;
  }

  public isValid(file?: Express.Multer.File): boolean {
    // If the next uncommented line doesn't work due to package updates on file-type-mime,
    // try this line instead:
    // const response = fileType.parse(file.buffer);
    // <--Correction courtesy of Sven Stadhouders from the comments-->
    const response = fileType.parse(file.buffer);
    return this._allowedMimeTypes.includes(response.mime);
  }

  public buildErrorMessage(): string {
    return `Upload not allowed. Upload only files of type: ${this._allowedMimeTypes.join(
      ', ',
    )}`;
  }
}
