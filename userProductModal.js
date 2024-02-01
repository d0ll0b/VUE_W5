import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

export default{
    template: '#userProductModal',
    props:['product'],
    data(){
        return{ 
            userProductModal: '',
            qty: 1
        }
    },
    methods:{
        show_Model(){
            this.userProductModal.show();
        },
        hide_Model(){
            this.userProductModal.hide();
        },
        add_cart(id, qty, flg){
            this.$emit('add_cart', id, qty, flg);
        }
    },
    mounted(){
        this.userProductModal = new bootstrap.Modal(this.$refs.modal,{
            keyboard: false
        });
    },
}