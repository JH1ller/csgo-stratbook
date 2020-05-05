import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faTools, faUtensils, faBoxes, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const remote = require('electron').remote;
const { app } = remote;

config.autoAddCss = false;
library.add(faTools, faUtensils, faBoxes, faNewspaper);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
    components: {
    }
})
export default class MainMenu extends Vue {

    private menuItems = [
        {
            label: 'Tools',
            icon: 'tools',
            link: '/tools'
        },
        {
            label: 'Lunch',
            icon: 'utensils',
            link: '/lunch'
        },
        {
            label: 'Extensions',
            icon: 'boxes',
            link: '/extensions'
        },
        {
            label: 'News',
            icon: 'newspaper',
            link: '/news'
        }
    ]

    private mounted() {
        const win = remote.getCurrentWindow();
        win?.setMinimumSize(580, this.calculateMinHeight());
    }

    private calculateMinHeight() {
        return ((this.menuItems.length + 1) * 70) + 30;
    }
}
