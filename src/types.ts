import { ActionEnum } from "@/payload/models/action-enum";
import { RoleEnum } from "@/payload/models/role-enum";
import {
	AfterChangeHook,
	AfterDeleteHook,
	AfterErrorHook,
	AfterForgotPasswordHook,
	AfterLoginHook,
	AfterLogoutHook,
	AfterMeHook,
	AfterReadHook,
	AfterRefreshHook,
	BeforeChangeHook,
	BeforeDeleteHook,
	BeforeLoginHook,
	BeforeOperationHook,
	BeforeReadHook,
	BeforeValidateHook,
	TypeWithID
} from "payload/dist/collections/config/types";
import {
	Action as PayloadAction,
	Role as PayloadRole,
	User as PayloadUser
} from "payload/generated-types";

export * from "@/payload/payload-types";
export type { Access, CollectionConfig } from "payload/types";
export type CollectionHooks<T extends TypeWithID> = {
	beforeOperation?: BeforeOperationHook[];
	beforeValidate?: BeforeValidateHook<T>[];
	beforeChange?: BeforeChangeHook<T>[];
	afterChange?: AfterChangeHook<T>[];
	beforeRead?: BeforeReadHook<T>[];
	afterRead?: AfterReadHook<T>[];
	beforeDelete?: BeforeDeleteHook[];
	afterDelete?: AfterDeleteHook<T>[];
	afterError?: AfterErrorHook;
	beforeLogin?: BeforeLoginHook<T>[];
	afterLogin?: AfterLoginHook<T>[];
	afterLogout?: AfterLogoutHook<T>[];
	afterMe?: AfterMeHook<T>[];
	afterRefresh?: AfterRefreshHook<T>[];
	afterForgotPassword?: AfterForgotPasswordHook[];
};
export type UserAuth = Omit<User, "roles"> & {
	roles: (Omit<Role, "actions"> & { actions: Action[] })[];
};
export type Id = string;
export type Action = Omit<PayloadAction, "name"> & { name: ActionEnum };
export type Role = Omit<PayloadRole, "name"> & { name: RoleEnum };
export type User = Omit<PayloadUser, "roles"> & { roles: Id[] | Role[] };
