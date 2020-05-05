import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';

@Component({
    components: {
    }
})
export default class ViewTitle extends Vue {

    private title: any = 'Home';

    private mounted() {
        this.title = this.$route.name;
    }

    @Watch('$route')
    onRouteChanged(to: any, from: any) {
        this.title = to.name;
    }


}
