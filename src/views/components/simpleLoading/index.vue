<template>
    <div class="demo-container">
        <h2>自定义 Loading 插件示例</h2>

        <div style="margin-bottom: 20px">
            <el-button type="primary" @click="loadData">刷新数据</el-button>
            <el-button @click="toggleLoading">切换 Loading</el-button>
        </div>

        <!-- ✅ 用法和 v-loading 一模一样！ -->
        <el-table v-simple-loading="tableLoading" :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="department" label="部门" width="150" />
            <el-table-column prop="position" label="岗位" width="150" />
            <el-table-column prop="salary" label="薪资" width="120" />
            <el-table-column prop="joinDate" label="入职日期" width="150" />
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)"> 编辑 </el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)"> 删除 </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="info-text">
            <p>总共 {{ tableData.length }} 条数据</p>
        </div>

        <!-- ✅ 其他容器也可以用！ -->
        <div v-simple-loading="cardLoading" class="card-box">
            <h3>卡片内容</h3>
            <p>这是一个普通的 div 容器</p>
            <el-button @click="loadCard">加载卡片数据</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';

    // 表格数据
    const tableData = ref([
        {
            id: 1,
            name: '张三',
            department: '技术部',
            position: '前端工程师',
            salary: '15000',
            joinDate: '2023-01-15',
        },
        {
            id: 2,
            name: '李四',
            department: '产品部',
            position: '产品经理',
            salary: '18000',
            joinDate: '2023-02-20',
        },
        {
            id: 3,
            name: '王五',
            department: '技术部',
            position: '后端工程师',
            salary: '16000',
            joinDate: '2023-03-10',
        },
        {
            id: 4,
            name: '赵六',
            department: '设计部',
            position: 'UI设计师',
            salary: '14000',
            joinDate: '2023-04-05',
        },
        {
            id: 5,
            name: '钱七',
            department: '运营部',
            position: '运营专员',
            salary: '12000',
            joinDate: '2023-05-12',
        },
    ]);

    // Loading 状态
    const tableLoading = ref(false);
    const cardLoading = ref(false);

    // 加载数据
    const loadData = () => {
        tableLoading.value = true;

        // 模拟 API 请求
        setTimeout(() => {
            // tableData.value = [
            //     ...tableData.value,
            //     {
            //         id: tableData.value.length + 1,
            //         name: '新员工',
            //         department: '技术部',
            //         position: '测试工程师',
            //         salary: '13000',
            //         joinDate: '2023-06-20',
            //     },
            // ];
            tableLoading.value = false;
            ElMessage.success('数据加载成功！');
        }, 1000);
    };

    // 切换 Loading
    const toggleLoading = () => {
        tableLoading.value = !tableLoading.value;
    };

    // 加载卡片
    const loadCard = () => {
        cardLoading.value = true;
        setTimeout(() => {
            cardLoading.value = false;
            ElMessage.success('卡片加载完成！');
        }, 1500);
    };

    // 编辑
    const handleEdit = (row: any) => {
        ElMessage.info(`编辑: ${row.name}`);
    };

    // 删除
    const handleDelete = (row: any) => {
        ElMessage.warning(`删除: ${row.name}`);
    };
</script>

<style scoped>
    .demo-container {
        padding: 20px;
    }

    h2 {
        margin-bottom: 20px;
        color: #ffffff;
        font-weight: 600;
    }

    h3 {
        color: #ffffff;
        margin-bottom: 10px;
    }

    p {
        color: #e0e0e0;
    }

    .info-text {
        margin-top: 20px;
    }

    .card-box {
        margin-top: 30px;
        padding: 20px;
        border: 1px solid #555;
        border-radius: 8px;
        min-height: 200px;
        background-color: rgba(255, 255, 255, 0.05);
    }
</style>
