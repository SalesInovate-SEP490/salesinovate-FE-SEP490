import { data } from "../core/data/authen/role"
import { LIST_BUTTON, LIST_ACTION } from "../core/data/authen/role";
import { getRole } from "./jwtUtils";

export const checkPermissionRole = (route: string): void => {
    const listRole: any = getRole();
    const permission = data.find((item: any) => item.path === route);
    let rolePermission: any[] = [];
    if (listRole && permission) {
        listRole.forEach((role: string) => {
            if (role && Array.isArray(permission[role])) {
                rolePermission = [...rolePermission, ...permission[role]];
            }

        });
    }

    if (rolePermission.length === 0) {
    } else {
        LIST_ACTION.forEach((action) => {
            const elements = document.querySelectorAll(LIST_BUTTON[action]);
            elements.forEach((item) => {
                if (!rolePermission.includes(action)) {
                    console.log(item);
                    item.setAttribute('style', 'display: none');
                } else {
                    item.setAttribute('style', 'display: block');
                }
            });
        });
    }
}

export const checkAccessMenu = (route: any): boolean => {
    if(route === "" || route === "/" || route === "/login" || route === "/forgot-password") return false;
    const listRole: any = getRole();
    const permission = data.find((item: any) => item.path === route);
    let rolePermission: any[] = [];
    if (listRole && permission) {
        listRole.forEach((role: string) => {
            if (role && Array.isArray(permission[role])) {
                rolePermission = [...rolePermission, ...permission[role]];
            }

        });
    }
    if (rolePermission.length === 0) {
        return true;
    } else {
        return false;
    }
}

export const getMenuDisplay = (route: string): any => {
    const listRole: any = getRole();
    const permission = data.find((item: any) => item.path === route);
    let rolePermission: any[] = [];

    if (listRole && permission) {
        listRole.forEach((role: string) => {
            if (role && Array.isArray(permission[role])) {
                rolePermission = [...rolePermission, ...permission[role]];
            }
        });
    }
    return rolePermission.length > 0;
}
