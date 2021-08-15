import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
interface ImageFile {
  file?: File;
  uri: string;
}

@Component({})
export default class UploadPreview extends Vue {
  @Prop() value!: (File | string)[];
  @Prop({ default: 1 }) limit!: number;

  private images: ImageFile[] = [];

  private filesSelected($event: InputEvent): void {
    const fileList = Array.from(($event.target as HTMLInputElement).files!);
    if (fileList.length) {
      this.input([...this.value, ...fileList]);
    }
  }

  private removeImage(image: ImageFile) {
    this.input(
      this.value.filter((file) => {
        if (image.file) {
          return file !== image.file;
        } else {
          return !image.uri.includes(file as string);
        }
      })
    );
  }

  private get fileString() {
    return this.value.length
      ? `${this.value.length} file${this.value.length > 1 ? 's' : ''} selected. ${
          this.value.length > this.limit
            ? `Remove ${this.value.length - this.limit} file${this.value.length > 1 ? 's' : ''}.`
            : ''
        }`
      : `Choose ${this.limit > 1 ? 'up to ' + this.limit : 'a'} file${this.limit > 1 ? 's' : ''}...`;
  }

  @Emit()
  private input(files: (File | string)[]): (File | string)[] {
    return files;
  }

  @Watch('value')
  private filesChanged(currentFiles: (File | string)[]) {
    this.images = [];

    currentFiles.forEach((file) => {
      if (typeof file === 'string') {
        this.images.push({
          uri: resolveStaticImageUrl(file),
        });
      } else {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          this.images.push({
            file: file,
            uri: fileReader.result as string,
          });
        };

        fileReader.readAsDataURL(file);
      }
    });
  }
}
