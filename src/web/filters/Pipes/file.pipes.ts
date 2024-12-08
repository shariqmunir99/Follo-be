import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Injectable()
export class OptionalFileValidationPipe implements PipeTransform {
  constructor(private readonly validators: ParseFilePipeBuilder) {}

  transform(value: Express.Multer.File | undefined) {
    if (!value) {
      // If no file, skip validation
      return undefined;
    }

    // Apply the validators if a file is provided
    const parseFilePipe = this.validators.build();
    return parseFilePipe.transform(value);
  }
}
