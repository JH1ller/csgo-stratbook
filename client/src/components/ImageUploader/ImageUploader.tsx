import { computed, defineComponent, PropType, ref, toRefs, unref, watch } from '@vue/composition-api';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { resolveStaticImageUrl } from '@/utils/resolveUrls';

import './ImageUploader.scss';

interface ImageFile {
  file?: File;
  uri: string;
}

type FileType = File | string;

export default defineComponent({
  name: 'image-uploader',

  props: {
    value: {
      type: [Array] as PropType<FileType[]>,
      required: true,
    },

    limit: {
      type: Number,
      default: 1,
    },
  },

  emits: {
    input: () => true,
  },

  setup(props, { emit }) {
    const { value, limit } = toRefs(props);
    const images = ref<ImageFile[]>([]);

    const input = ref<HTMLInputElement>();

    const fileString = computed(() => {
      const rawValue = unref(value);

      return rawValue.length
        ? `${rawValue.length} file${rawValue.length > 1 ? 's' : ''} selected. ${
            rawValue.length > limit.value
              ? `Remove ${rawValue.length - limit.value} file${rawValue.length > 1 ? 's' : ''}.`
              : ''
          }`
        : `Choose ${limit.value > 1 ? 'up to ' + limit.value : 'a'} file${limit.value > 1 ? 's' : ''}...`;
    });

    watch(
      () => value.value,
      (newFiles: FileType[]) => {
        images.value = [];

        for (const file of newFiles) {
          if (typeof file === 'string') {
            images.value.push({
              uri: resolveStaticImageUrl(file),
            });
          } else {
            const fileReader = new FileReader();

            fileReader.onload = () => {
              images.value.push({
                file: file,
                uri: fileReader.result as string,
              });
            };

            fileReader.readAsDataURL(file);
          }
        }
      }
    );

    const onFileSelected = () => {
      const imageInput = unref(input);

      if (imageInput && imageInput.files) {
        const fileList = Array.from(imageInput.files);

        if (fileList.length) {
          emit('input', [...value.value, ...fileList]);
        }
      }
    };

    const onRemoveImage = (image: ImageFile) => {
      const files = value.value.filter((file) => {
        if (image.file) {
          return file !== image.file;
        } else {
          return !image.uri.includes(file as string);
        }
      });

      emit('input', files);
    };

    return {
      input,
      valueRef: value,
      fileLimit: limit,

      images,

      fileString,

      onFileSelected,
      onRemoveImage,
    };
  },

  render() {
    return (
      <div class="image-uploader">
        <label class="image-uploader__input">
          <input
            accept="image/*"
            disabled={this.valueRef.length >= this.fileLimit}
            id="file"
            multiple={this.fileLimit > 1}
            onChange={this.onFileSelected}
            ref="input" // another vue2 caveat, ref bindings do not work atm :(
            type="file"
          />
          <span file-input-value={this.fileString} />
        </label>

        <div class="image-uploader__preview">
          {this.images.map((image) => (
            <div class="image-uploader__preview-item" key={image.uri}>
              <img alt="" class="image-uploader__image" src={image.uri} />

              <FontAwesomeIcon class="image-uploader__icon" icon="times" onClick={() => this.onRemoveImage(image)} />
            </div>
          ))}

          <span class={['image-uploader__preview-placeholder', { '-has-content': this.images.length }]}>
            No images selected
          </span>
        </div>
      </div>
    );
  },
});
