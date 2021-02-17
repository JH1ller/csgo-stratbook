import { Component, Emit, Inject, Prop, Ref, Vue } from 'vue-property-decorator';
import Tribute, { TributeCollection, TributeOptions } from 'tributejs';
import { appModule, authModule, teamModule, utilityModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import sanitizeHtml from 'sanitize-html';
import { Player } from '@/api/models/Player';
import { Utility } from '@/api/models/Utility';
import { Sides } from '@/api/models/Sides';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { equipmentData, weaponData } from './data/equipment.data';
import { Toast } from '../ToastWrapper/ToastWrapper.models';

export interface LinkOption {
  id?: string;
  icon?: string;
  label: string;
  query: string;
}

@Component({
  components: {},
})
export default class StratEditor extends Vue {
  @Inject('lightbox') readonly showLightboxFunc!: (utility: Utility) => void;
  @Prop() stratSide!: Sides;
  @Prop() htmlContent!: string;
  @Ref() textarea!: HTMLDivElement;
  @teamModule.State teamMembers!: Player[];
  @authModule.State profile!: Player;
  @utilityModule.Getter utilitiesOfCurrentMap!: Utility[];
  @appModule.Action private showToast!: (toast: Toast) => void;
  private tribute!: Tribute<LinkOption>;

  private get utilityOptionList(): LinkOption[] {
    return [
      ...this.utilitiesOfCurrentMap
        .filter(utility => utility.side === this.stratSide)
        .map(utility => ({
          id: utility._id,
          icon: utility.type.toLowerCase(),
          label: utility.name,
          query: `${utility.type} ${utility.name}`,
        })),
      {
        icon: UtilityTypes.FLASH.toLowerCase(),
        query: UtilityTypes.FLASH,
        label: 'Flash',
      },
      {
        icon: UtilityTypes.GRENADE.toLowerCase(),
        query: UtilityTypes.GRENADE,
        label: 'Grenade',
      },
      {
        icon: UtilityTypes.SMOKE.toLowerCase(),
        query: UtilityTypes.SMOKE,
        label: 'Smoke',
      },
      {
        icon: UtilityTypes.MOLOTOV.toLowerCase(),
        query: UtilityTypes.MOLOTOV,
        label: 'Molotov',
      },
    ];
  }

  private get mentionOptionList(): LinkOption[] {
    return [
      ...this.teamMembers.map(member => ({
        id: member._id,
        icon: member.avatar,
        query: member.name,
        label: member.name,
      })),
      { id: 'spawn_1', query: 'spawn 1', label: 'Spawn-1' },
      { id: 'spawn_2', query: 'spawn 2', label: 'Spawn-2' },
      { id: 'spawn_3', query: 'spawn 3', label: 'Spawn-3' },
      { id: 'spawn_4', query: 'spawn 4', label: 'Spawn-4' },
      { id: 'spawn_5', query: 'spawn 5', label: 'Spawn-5' },
    ];
  }

  private get tributeOptions(): TributeOptions<LinkOption> & {
    collection: Array<TributeCollection<LinkOption> & { spaceSelectsMatch?: boolean; menuItemLimit?: number }>;
  } {
    return {
      collection: [
        {
          values: this.mentionOptionList,
          lookup: 'query',
          selectTemplate: item =>
            `<span contenteditable="false" class="strat-editor__mention${
              item.original.id === this.profile._id ? ' -is-user' : ''
            }${item.original.id?.startsWith('spawn') ? ' -is-spawn' : ''}" data-player-id="${item.original.id}">${
              item.original.label
            }</span>`,
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: item =>
            `<img class="strat-editor__mention-item-image" src="${resolveStaticImageUrl(item.original.icon)}"/> ${
              item.original.label
            } `,
          noMatchTemplate: () => '<span style:"visibility: hidden;"></span>', // TODO: doesn't work for some reason, uses tribute fallback
          requireLeadingSpace: true,
          spaceSelectsMatch: true,
        },
        {
          values: this.utilityOptionList,
          trigger: '#',
          lookup: 'query',
          selectTemplate: item =>
            `<span contenteditable="false" ${item.original.id ? `data-util-id="${item.original.id}"` : ''}
             class="strat-editor__utility"><img class="strat-editor__utility-img" src="utility/${
               item.original.icon
             }.png" />${item.original.label}</span>`,
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: item =>
            `<img class="strat-editor__utility-item-image" src="utility/${item.original.icon}.png"/> ${item.original.label} `,
          noMatchTemplate: () => '<span style:"visibility: hidden;"></span>', // TODO: doesn't work for some reason, uses tribute fallback
          requireLeadingSpace: true,
          spaceSelectsMatch: true,
          menuItemLimit: 5,
        },
        {
          values: [
            {
              id: 'w:',
              icon: 'ak47',
              query: 'weapons',
              label: 'Weapons',
            },
            {
              id: 'e:',
              icon: 'kevlar',
              query: 'equipment',
              label: 'Equipment',
            },
          ],
          trigger: '/',
          lookup: 'query',
          selectTemplate: () => '',
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: item =>
            `<img class="strat-editor__utility-item-image" src="utility/${item.original.icon}.png"/> ${item.original.label} `,
          noMatchTemplate: () => '<span style:"visibility: hidden;"></span>', // TODO: doesn't work for some reason, uses tribute fallback
          requireLeadingSpace: true,
          spaceSelectsMatch: true,
        },
        {
          values: [
            ...weaponData,
            {
              label: this.stratSide === Sides.CT ? 'M4' : 'AK47',
              query: this.stratSide === Sides.CT ? 'm4' : 'ak47',
              icon: this.stratSide === Sides.CT ? 'm4a4' : 'ak47',
            },
            {
              label: this.stratSide === Sides.CT ? 'Famas' : 'Galil',
              query: this.stratSide === Sides.CT ? 'famas' : 'galil',
              icon: this.stratSide === Sides.CT ? 'famas' : 'galil',
            },
          ],
          trigger: 'w:',
          lookup: 'query',
          selectTemplate: item =>
            `<span contenteditable="false" class="strat-editor__utility"><img class="strat-editor__utility-img" src="utility/${item.original.icon}.png" />${item.original.label}</span>`,
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: item =>
            `<img class="strat-editor__utility-item-image" src="utility/${item.original.icon}.png"/> ${item.original.label} `,
          noMatchTemplate: () => '<span style:"visibility: hidden;"></span>', // TODO: doesn't work for some reason, uses tribute fallback
          requireLeadingSpace: true,
          spaceSelectsMatch: true,
        },
        {
          values: [
            ...equipmentData,
            {
              icon: this.stratSide === Sides.CT ? 'defusekit' : 'bomb',
              query: this.stratSide === Sides.CT ? 'defusekit' : 'bomb',
              label: this.stratSide === Sides.CT ? 'Defuse Kit' : 'Bomb',
            },
          ],
          trigger: 'e:',
          lookup: 'query',
          selectTemplate: item =>
            `<span contenteditable="false" class="strat-editor__utility"><img class="strat-editor__utility-img" src="utility/${item.original.icon}.png" />${item.original.label}</span>`,
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: item =>
            `<img class="strat-editor__utility-item-image" src="utility/${item.original.icon}.png"/> ${item.original.label} `,
          noMatchTemplate: () => '<span style:"visibility: hidden;"></span>', // TODO: doesn't work for some reason, uses tribute fallback
          requireLeadingSpace: true,
          spaceSelectsMatch: true,
        },
      ],
    };
  }

  private htmlInserted(e: CustomEvent) {
    const command: string = e.detail.item.original.id;
    if (command?.endsWith(':')) {
      const collectionIndex = this.tributeOptions.collection.findIndex(collection => collection.trigger === command);
      // * hack to prevent new menu being immediately closed
      this.$nextTick().then(() => this.tribute.showMenuForCollection(this.textarea, collectionIndex));
    }

    this.addClickListeners();
  }

  private get sanitizedHtml(): string {
    return sanitizeHtml(this.htmlContent, {
      allowedTags: ['span', 'img', 'div'],
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
    this.tribute = new Tribute(this.tributeOptions);
    this.tribute.attach(this.textarea);
    this.addClickListeners();
  }

  private addClickListeners() {
    const nodes: NodeListOf<HTMLElement> = this.textarea.querySelectorAll('[data-util-id]');
    nodes.forEach(node => {
      const id = node.getAttribute('data-util-id');
      if (!node.onclick) {
        if (this.utilitiesOfCurrentMap.find(utility => utility._id === id)) {
          node.onclick = () => this.utilClicked(id as string);
          node.classList.add('-linked');
        } else {
          node.onclick = () =>
            this.showToast({
              id: 'strat-editor/invalid-link',
              text: 'Cannot find linked utility. It may have been deleted.',
            });
        }
      }
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
