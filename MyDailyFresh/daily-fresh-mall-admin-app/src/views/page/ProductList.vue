<template>
    <div class="product-list">
        <!-- 搜索 -->
        <search-box @submit="searchSubmit"></search-box>

        <!-- 表格 -->
    </div>
</template>

<script>
import SearchBox from "@/components/Search.vue";
export default {
    components:{
        SearchBox,
    },
    methods:{
        searchSubmit(form){
            console.log(form);
        }
    }
}
</script>