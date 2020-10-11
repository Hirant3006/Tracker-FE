import prefixNamespace from "@/utils/prefix-namespace";
import { storeKeyNameSpace } from "@/constants/stores";

export const _types = {
	getters: {},
	actions: {
		GET_STATISTIC: "getStatistic",
		GET_STATISTIC_SUMMARY: "getStatisticSummary",
	},
	mutations: {},
};

export const types = prefixNamespace(`${storeKeyNameSpace.DASHBOARD}/`, _types);
