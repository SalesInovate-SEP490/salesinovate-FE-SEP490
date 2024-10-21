import { Account } from "./type";

export const initAccount: Account = {
    id: 0,
    accountId: 0,
    accountName: "",
    userId: 0,
    parentAccountId: 0,
    description: "",
    phone: "",
    website: "",
    billingInformationId: 0,
    shippingInformationId: 0,
    postalCode: "",
    createdBy: 0,
    createDate: new Date(),
    editDate: new Date(),
    editBy: 0,
    isDeleted: false,
    role: {
        roleId: 0,
        roleName: ""
    },
    accountType: {
        accountId: 0,
        accountName: ""
    },
    industry: {
        industryId: 0,
        industryStatusName: ""
    },
    industryId: 0,
    accountTypeId: 0,
    roleId: 0
};