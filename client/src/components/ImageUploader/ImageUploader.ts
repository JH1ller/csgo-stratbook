import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

interface ImageFile {
  file: File;
  uri: string;
}

@Component({})
export default class UploadPreview extends Vue {
  @Prop() value!: File[];
  @Prop({ default: 1 }) limit!: number;

  private images: ImageFile[] = [];

  private filesSelected($event: InputEvent): void {
    const fileList = Array.from(($event.target as HTMLInputElement).files!);
    if (fileList.length) {
      this.input([...this.value, ...fileList]);
    }
  }

  private removeImage(image: ImageFile) {
    this.input(this.value.filter(file => file !== image.file));
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
  private input(files: File[]): File[] {
    return files;
  }

  @Watch('value')
  private filesChanged(currentFiles: File[]) {
    this.images = [];

    currentFiles.forEach(file => {
      const fileReader = new FileReader();

      fileReader.onload = () =>
        this.images.push({
          file: file,
          uri: fileReader.result as string,
        });

      fileReader.readAsDataURL(file);
    });
  }
}
