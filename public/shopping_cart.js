// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import userProductModal from './userProductModal.js';
import MessageToast from './MessageToast.js';

// 定義 VeeValidate規則(全部載入)
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
//   validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

VeeValidate.defineRule('minMaxLength', (value, [min, max]) => {
    // The field is empty so it should pass
    if (!value || !value.length) {
      return true;
    }
    const length = value.length;
    if (length < min) {
      return `字數必須大於 ${min}`;
    }
    if (length > max) {
      return `字數必須小於 ${max}`;
    }
    return true;
});

const api_url = "https://ec-course-api.hexschool.io/v2";
const api_path = "dollob_api";

const app = Vue.createApp({
    data(){
        return{ 
            products: [],
            product: {},
            carts: {},
            total: '',
            final_total: '',
            isloading: false,
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: ''
                },
                message: ''
            },
        }
    },
    methods:{
        // 取得所有商品
        get_products(){
            const api = `${api_url}/api/${api_path}/products`;
            axios.get(api).then((res) => {
                const { products } = res.data;
                this.products = products;
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        // 取得單一商品
        get_product(id){
            this.islaoding=true;
            const api = `${api_url}/api/${api_path}/product/${id}`;
            axios.get(api).then((res) => {
                const { product } = res.data;
                this.product = product;
                this.$refs.userProductModal.show_Model();
            }).catch((err) => {
                alert(err);
            }).finally(()=>{
                this.isloading=false;
            })
        },
        add_cart(id, qty=1, flg){
            let api = '';
            let http = '';
            let message = `加入購物車成功，新增${qty}筆商品~~`;
            this.islaoding=true;

            if(flg === "new"){
                api = `${api_url}/api/${api_path}/cart`;
                http = 'post';
            }else if(flg === "update"){
                api = `${api_url}/api/${api_path}/cart/${id}`;
                http = 'put';
            }

            const cart = {
                product_id: id,
                qty,
            };

            axios[http](api, { data: cart }).then((res) => {
                this.get_cart();
                this.toastMsg(message);
            }).catch((err) => {
                alert(err);
            }).finally(()=>{
                this.isloading=false;
                this.$refs.userProductModal.hide_Model();
            })
        },
        get_cart(){
            this.islaoding=true;
            const api = `${api_url}/api/${api_path}/cart`;

            axios.get(api).then((res) => {
                const { carts, total, final_total } = res.data.data;
                this.carts = carts;
                this.total = total;
                this.final_total = final_total;
            }).catch((err) => {
                alert(err);
            }).finally(()=>{
                this.isloading=false;
            })
        },
        delete_cart(id=null){
            let api = '';
            let message = '';
            let result = '';
            this.islaoding=true;

            if(id===null){
                result = confirm("是否清空購物車？")
                api = `${api_url}/api/${api_path}/carts`;
                message = '購物車已清空 ಥ_ಥ';
            }else{
                result = confirm("是否刪除品項？")
                api = `${api_url}/api/${api_path}/cart/${id}`;
                message = '已從購物車刪除 ಥ_ಥ';
            }
            
            if(result){
                axios.delete(api).then((res) => {
                    this.get_cart();
                    this.toastMsg(message);
                }).catch((err) => {
                    alert(err);
                }).finally(()=>{
                    this.isloading=false;
                })
            }
        },
        onSubmit(){
            const api = `${api_url}/api/${api_path}/order`;
            this.isloading=true;

            axios.post(api, { data:this.form }).then((res) => {
                this.get_cart();
                this.$refs.form.resetForm();
                this.form.message = '';
                this.toastMsg('訂單已成交，謝謝~~');
            }).catch((err) => {
                alert(err);
            }).finally(()=>{
                this.isloading=false;
            })
        },
        toastMsg(message){
            this.$refs.messageToast.show_toast(message)
        }
    },
    mounted(){
        this.get_products();
        this.get_cart();
    },
});

app.component('loading', VueLoading.Component)
app.component('userProductModal', userProductModal);
app.component('MessageToast', MessageToast);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');
