import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import userProductModal from './userProductModal.js';

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
            isloading: false
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
        //加入購物車(錯誤)
        add_cart(id, qty=1){
            const api = `${api_url}/api/${api_path}/cart`;
            const cart = {
                product_id: id,
                qty,
            };

            axios.post(api, { data: cart }).then((res) => {
                this.get_cart();
            }).catch((err) => {
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
                console.dir(res.data);
            }).catch((err) => {
                alert(err.data.message);
            })
        }
    },
    mounted(){
        this.get_products();
        this.get_cart();
    },
});

app.component('loading', VueLoading.Component)
app.component('userProductModal', userProductModal);
app.mount('#app');
