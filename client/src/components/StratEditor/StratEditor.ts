import { Component, Emit, Inject, Prop, Ref, Vue } from 'vue-property-decorator';
import VueTribute from 'vue-tribute';
import { TributeCollection, TributeOptions } from 'tributejs';
import { authModule, teamModule, utilityModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import sanitizeHtml from 'sanitize-html';
import { Player } from '@/api/models/Player';
import { Utility } from '@/api/models/Utility';

@Component({
  components: {
    VueTribute,
  },
})
export default class StratEditor extends Vue {
  @Inject('lightbox') readonly showLightboxFunc!: (utility: Utility) => void;

  @Prop() htmlContent!: string;
  @Ref() textarea!: HTMLDivElement;
  @teamModule.State teamMembers!: Player[];
  @authModule.State profile!: Player;
  @utilityModule.Getter utilitiesOfCurrentMap!: Utility[];

  private get utilityOptionList() {
    return this.utilitiesOfCurrentMap.map(utility => ({
      ...utility,
      query: `${utility.type} ${utility.name}`,
    }));
  }

  private get mentionOptionList() {
    return [
      ...this.teamMembers,
      { _id: 'spawn_1', name: 'Spawn-1' },
      { _id: 'spawn_2', name: 'Spawn-2' },
      { _id: 'spawn_3', name: 'Spawn-3' },
      { _id: 'spawn_4', name: 'Spawn-4' },
      { _id: 'spawn_5', name: 'Spawn-5' },
    ];
  }

  private get mentionOptions(): TributeOptions<Partial<Player | Utility>> & {
    collection: Array<TributeCollection<Partial<Player | Utility>> & { spaceSelectsMatch: boolean }>;
  } {
    return {
      collection: [
        {
          values: this.mentionOptionList,
          lookup: 'name',
          fillAttr: 'name',
          selectTemplate: item =>
            `<span contenteditable="false" class="strat-editor__mention ${
              item.original._id === this.profile._id ? '-is-user' : ''
            } ${item.original._id?.startsWith('spawn') ? '-is-spawn' : ''}">@${item.original.name}</span>`,
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: item =>
            `<img class="strat-editor__mention-item-image" src="${resolveStaticImageUrl(
              (item.original as Player).avatar
            )}"/> ${item.original.name} `,
          //noMatchTemplate: () => (`<span class="strat-editor__mention-item -no-match">No players found</span>`),
          noMatchTemplate: () => '<span style:"visibility: hidden;"></span>',
          requireLeadingSpace: true,
          spaceSelectsMatch: true,
        },
        {
          values: this.utilityOptionList,
          trigger: '#',
          lookup: 'query',
          fillAttr: 'name',
          selectTemplate: item =>
            `<span contenteditable="false" data-id="${
              item.original._id
            }" class="strat-editor__utility"><img class="strat-editor__utility-img" src="utility/${(item.original as Utility).type.toLowerCase()}.png" />${
              item.original.name
            }</span>`,
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: item =>
            `<img class="strat-editor__utility-item-image" src="utility/${(item.original as Utility).type.toLowerCase()}.png"/> ${
              item.original.name
            } `,
          //noMatchTemplate: () => (`<span class="strat-editor__mention-item -no-match">No players found</span>`),
          noMatchTemplate: () => '<span style:"visibility: hidden;"></span>',
          requireLeadingSpace: true,
          spaceSelectsMatch: true,
        },
      ],
    };
  }
  private htmlInserted() {
    this.addClickListeners();
  }

  private get sanitizedHtml(): string {
    return sanitizeHtml(this.htmlContent, {
      allowedTags: ['span', 'img'],
      allowedAttributes: {
        span: ['contenteditable', 'class', 'data-*'],
        img: ['class', 'src'],
      },
    });
  }

  private updated() {
    this.addClickListeners();
  }

  private mounted() {
    this.addClickListeners();
  }

  private addClickListeners() {
    const nodes = this.textarea.querySelectorAll('[data-id]');
    nodes.forEach(node => {
      const id = node.getAttribute('data-id');
      if (!(node as HTMLElement).onclick) (node as HTMLElement).onclick = () => this.utilClicked(id as string);
    });
  }

  private utilClicked(id: string) {
    const utility = this.utilitiesOfCurrentMap.find(utility => utility._id === id);
    if (utility) this.showLightboxFunc(utility);
  }

  @Emit()
  private update() {
    return this.textarea.innerHTML;
  }

  @Emit()
  private focus() {
    return;
  }

  @Emit()
  private blur() {
    return;
  }
}
