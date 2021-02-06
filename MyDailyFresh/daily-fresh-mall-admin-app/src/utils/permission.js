//存储的是: 角色对应的(路由)权限名称
const roleToRoute = {
    "coustomer": [//服了,服务端返回的还不是customer
        {
            name: 'Product',
        }, {
            name: 'ProductList',
        }, {
            name: 'ProductAdd',
        },
    ],
    "admin": [
        {
            name: 'Product',
        }, {
            name: 'ProductList',
        }, {
            name: 'ProductAdd',
        }, {
            name: 'Category',
        }
    ]
}

/**
 * 过滤掉没有权限的路由
 * @param {String} role     - 角色
 * @param {Array} routes    - 路由表
 */
export default function getMenuRoutes(role, routes) {
    // console.log(role);
    // console.log(roleToRoute[role]);
    const allowRoutesName = roleToRoute[role].map(item => item.name);

    //过滤掉所有没有权限的路由,记得还有子路由也要判断
    function _recall(curRoutes) {
        const resultRoutes = curRoutes.filter(r => {//filter是返回新数组
            if (allowRoutesName.includes(r.name)) {
                const children = r.children;
                if (children) {
        //    r.children =  children.filter(c => {//WC了,这个必须用r.children接收着,不能直接写children
        // 因为filter是直接返回全新的数组, 所以如果直接写children的话, 那r.children相当于没变
        // 害, 没有想到, 脑子直接忽略了, 一开始我以为children和r.children是连在一体的
        // 害得我找半小时的bug, C
        //    console.log(c.name);
        //    return allowRoutesName.includes(c.name);
        //    });
                    r.children = _recall(children);//遍历完所有目录并返回给r.children!!!!
                }
                return true;
            }
            return false;//其他没权限的就过滤掉了
        });

        return resultRoutes;//返回最终结果
    }

    return _recall(routes);

    // const resultRoutes = routes.filter(r => {//filter是返回新数组
    //     if (allowRoutesName.includes(r.name)) {
    //         console.log(r.name);
    //         // let obj = r;
    //         const children = r.children;
    //         if (children) {
    //             r.children =  children.filter(c => {//WC了,这个必须用r.children接收着,不能直接写children
    //                 //因为filter是直接返回全新的数组,所以如果直接写children的话,那r.children相当于没变
    //                 //害,没有想到,脑子直接忽略了,一开始我以为children和r.children是连在一体的
    //                 //害得我找半小时的bug,C
    //                 console.log(c.name);
    //                 return allowRoutesName.includes(c.name);
    //             });
    //         }
    //         return true;
    //     }
    //     return false;//其他没权限的就过滤掉了
    // });

    // return resultRoutes;//返回最终结果
}