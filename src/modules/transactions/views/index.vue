<template>
  <div class="manage-transactions">
    <div class="d-flex justify-content-between m-b-20">
      <h3>Quản lí giao dịch</h3>
      <a-button @click="() => $router.push($routerName.CREATE_CAMPAIGN)" type="primary">
        Tạo mới
      </a-button>
    </div>

    <a-table :scroll="{ y: 1300 }" bordered :columns="columns" :data-source="data" @change="onChange" rowKey="id" />
  </div>
</template>

<script>
const columns = [
  {
    title: "Mã giao dịch",
    dataIndex: "id",
  },
  {
    title: "Tên",
    dataIndex: "clientName",
  },
  {
    title: "Thời gian",
    dataIndex: "regDt",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
  },
  {
    title: "Loại giao dịch",
    dataIndex: "type",
  },
  {
    title: "Nhân viên",
    dataIndex: "modiNm",
  },
  {
    title: "Tình trạng",
    dataIndex: "status",
  },
  {
    title: "Ghi chú",
    dataIndex: "description",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];

const data = [
  {
    id: 1,
    bookId: 5,
    type: "EXPENSE",
    amount: 1000000,
    clientName: "Nguyen Văn Long",
    description: "Mua 500 tấn thép",
    regDt: "2020-09-06 13:07:25",
    regUserId: 1,
    regNm: "SYSTEM",
    modiDt: "2020-09-09 21:09:55",
    modiUserId: 2,
    modiNm: "Nhat Tinh Anh",
  },
];

function onChange(pagination, filters, sorter) {
  console.log("params", pagination, filters, sorter);
}
export default {
  name: "Transactions",
  data() {
    return {
      data,
      columns,
    };
  },
  methods: {
    onChange,
  },
};
</script>

<style lang="scss">
.ant-table-pagination {
  display: none;
}
.manage-transactions {
}
</style>