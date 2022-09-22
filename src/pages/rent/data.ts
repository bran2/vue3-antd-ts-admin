export const table = {
    pagination:
        {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '30'],
            showTotal: (total: string, range: string[]) => {
                return range[0] + '-' + range[1] + ' 共' + total + '条';
            },
            showQuickJumper: true,
            showSizeChanger: true,
            total: 0,
        },
    columns: [
        {
            title: '小区名称',
            dataIndex: 'community',
            key: 'community',
        },
        {
            title: '楼号-房间号',
            dataIndex: 'building',
            key: 'building',
        },
        {
            title: '应付日期',
            dataIndex: 'nextDate',
            key: 'nextDate',
        },
        {
            title: '应付租金',
            dataIndex: 'rent',
            key: 'rent',
        },
        {
            title: '业主姓名',
            key: 'unionName',
            dataIndex: 'unionName',
        },
        {
            title: '业主手机号',
            dataIndex: 'phoneNo',
            key: 'phoneNo',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ]
}

