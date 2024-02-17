export default{
    template: '#toastMsg',
    data(){
        return{ 
            toast: '',
            toast_message: ''
        }
    },
    methods:{
        show_toast(Msg){
            this.toast_message = Msg;
            this.toast.show();
        }
    },
    mounted(){
        this.toast = new bootstrap.Toast(this.$refs.toast)
    },
}