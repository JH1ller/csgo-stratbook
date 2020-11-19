import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import VueTribute from 'vue-tribute'
import { TributeCollection, TributeOptions } from 'tributejs';
import { Player } from '@/api/models';
import { authModule, teamModule } from '@/store/namespaces';
import { resolveAvatar } from '@/utils/resolveUrls';
import sanitizeHtml from 'sanitize-html';

@Component({
  components: {
    VueTribute,
  },
})
export default class StratEditor extends Vue {
  @Prop() htmlContent!: string;
  @Ref() textarea!: HTMLDivElement;
  @teamModule.State teamMembers!: Player[];
  @authModule.State profile!: Player;

  private utilityOptionList = [
    { _id: 'flashbang', name: 'Flash' },
    { _id: 'grenade', name: 'Grenade' },
    { _id: 'molotov', name: 'Molotov/Incendiary' },
    { _id: 'smoke', name: 'Smoke' },
    { _id: 'defusekit', name: 'Defuse Kit' },
  ];

  private get mentionOptionList() {
    return [...this.teamMembers, 
      { _id: 'spawn_1', name: 'Spawn-1' },
      { _id: 'spawn_2', name: 'Spawn-2' },
      { _id: 'spawn_3', name: 'Spawn-3' },
      { _id: 'spawn_4', name: 'Spawn-4' },
      { _id: 'spawn_5', name: 'Spawn-5' },
    ]
  }

  private get mentionOptions(): TributeOptions<Partial<Player>> & { collection: Array<TributeCollection<Partial<Player>> & { spaceSelectsMatch: boolean }> } {
    return { 
      collection: [
        { 
          values: this.mentionOptionList,
          lookup: 'name',
          fillAttr: 'name',
          selectTemplate: (item) => (
            `<span contenteditable="false" data-id="${item.original._id}" class="strat-editor__mention ${item.original._id === this.profile._id ? '-is-user' : ''} ${item.original._id?.startsWith('spawn') ? '-is-spawn' : ''}" onclick="console.log('${item.original._id}')">@${item.original.name}</span>`
          ),
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: (item) => (
            `<img class="strat-editor__mention-item-image" src="${resolveAvatar(item.original.avatar)}"/> ${item.original.name} `
          ),
          //noMatchTemplate: () => (`<span class="strat-editor__mention-item -no-match">No players found</span>`),
          noMatchTemplate: () => ('<span style:"visibility: hidden;"></span>'),
          requireLeadingSpace: true,
          spaceSelectsMatch: true
        },
        { 
          values: this.utilityOptionList,
          trigger: '#',
          lookup: 'name',
          fillAttr: 'name',
          selectTemplate: (item) => (
            `<span contenteditable="false" class="strat-editor__utility"><img class="strat-editor__utility-img" src="utility/${item.original._id}.png" />${item.original.name}</span>`
          ),
          itemClass: 'strat-editor__mention-item',
          containerClass: 'strat-editor__mention-container',
          selectClass: 'strat-editor__mention-selected',
          menuItemTemplate: (item) => (
            `<img class="strat-editor__utility-item-image" src="utility/${item.original._id}.png"/> ${item.original.name} `
          ),
          //noMatchTemplate: () => (`<span class="strat-editor__mention-item -no-match">No players found</span>`),
          noMatchTemplate: () => ('<span style:"visibility: hidden;"></span>'),
          requireLeadingSpace: true,
          spaceSelectsMatch: true
        }
      ]
    } 
  }
  private htmlInserted() {
    this.addClickListeners();
  }

  private get sanitizedHtml(): string {
    return sanitizeHtml(this.htmlContent, {
      allowedTags: ['span', 'img'],
      allowedAttributes: {
        'span': ['contenteditable', 'class', 'data-*'],
        'img': ['class', 'src']
      }
    })
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
      if (!(node as HTMLElement).onclick)
        (node as HTMLElement).onclick = () => this.mentionClicked(id as string);
    })
  }

  private mentionClicked(id: string): void {
    console.log(id);
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
