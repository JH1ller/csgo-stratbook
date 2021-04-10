import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ImageUploaderService {
  constructor(@InjectQueue('image-uploader') private readonly imageQueue: Queue) {
    const t = setInterval(() => {
      imageQueue.add({ file: 'test.mp3' }).catch((data) => console.log(data));
    }, 1000);

    if (module.hot) {
      module.hot.dispose(() => clearInterval(t));
    }
  }

  getHello(): string {
    return 'test World!';
  }
}
