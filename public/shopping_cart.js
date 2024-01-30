import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import userProductModal from './userProductModal.js';

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

VeeValidate.defineRule('minMax', (value, [min, max]) => {
    // The field is empty so it should pass
    if (!value || !value.length) {
      return true;
    }
    const numericValue = Number(value);
    if (numericValue < min) {
      return `This field must be greater than ${min}`;
    }
    if (numericValue > max) {
      return `This field must be less than ${max}`;
    }
    return true;
});

const api_url = "https://ec-course-api.hexschool.io/v2";
const api_path = "dollob_api";

const app = createApp({
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
            this.islaoding=true;
            const api = `${api_url}/api/${api_path}/products`;
            axios.get(api).then((res) => {
                const { products } = res.data;
                this.products = products;
                this.isloading=false;
            }).catch((err) => {
                this.isloading=false;
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
                this.isloading=false;
            }).catch((err) => {
                this.isloading=false;
                alert(err.data.message);
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
                this.isloading=false;
                alert(message);
            }).catch((err) => {
                this.isloading=false;
                alert(err.data.message);
            })
            this.$refs.userProductModal.hide_Model();
        },
        get_cart(){
            const api = `${api_url}/api/${api_path}/cart`;

            axios.get(api).then((res) => {
                const { carts, total, final_total } = res.data.data;
                this.carts = carts;
                this.total = total;
                this.final_total = final_total;
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        delete_cart(id=null){
            let api = '';
            let message = '';
            this.islaoding=true;

            if(id===null){
                api = `${api_url}/api/${api_path}/carts`;
                message = '購物車已清空 ಥ_ಥ';
            }else{
                api = `${api_url}/api/${api_path}/cart/${id}`;
                message = '已從購物車刪除 ಥ_ಥ';
            }

            axios.delete(api).then((res) => {
                this.get_cart();
                this.isloading=false;
                alert(message);
            }).catch((err) => {
                this.isloading=false;
                alert(err.data.message);
            })
        },
        onSubmit(){

        }
    },
    mounted(){
        this.get_products();
        this.get_cart();
    },
});

app.component('loading', VueLoading.Component)
app.component('userProductModal', userProductModal);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');
