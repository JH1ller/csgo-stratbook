import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';

@Component({
    components: {
    }
})
export default class ViewTitle extends Vue {

    private title: any = 'EsportBERG'; // TODO: replace with team name

    private mounted() {
        this.title = this.$route.name;
    }

    @Watch('$route')
    onRouteChanged(to: any, from: any) {
        this.title = to.name;
    }


}
