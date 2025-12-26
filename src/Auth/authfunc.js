import { dataUserStore } from "../store/dataUser";

export const isAuth = (to, from, next) => {
    // const token = localStorage.getItem("token");
    // const idTypeUser = localStorage.getItem("id_type_user");
    const userStore = dataUserStore();
    const token = localStorage.getItem('token')
    const idTypeUser = userStore.getIdTypeUser
    
    if (token && idTypeUser) {
      console.log(idTypeUser);
      
        if (to.name === 'login') {
            return next({ name: 'home' });
        }
        const rolePermissions = {
          "1": [
            "home",
            "manageuseraccounts",
            "auditoraccountsmanagement",
           // "addquestion", وضع الاسالة
            "showcourses",
            "dayscourses",
           // "showmyquestion", عرض الاسالة
           // "auditquestion", تدقيق الاسالة
            "managementlist",
            "showaxes",
            "mangementtree",
            "allquestionforadmin"
          ],
          "4": ["home", "addquestion", "showmyquestion"], // واضع الأسئلة
          "5": ["home", "auditquestion"], // مدقق الأسئلة
          "7": ["home", "showcourses", "addacourse", "dayscourses","showaxes","createform","createexamform"], // منشىء الدورات
        };
        if (rolePermissions[idTypeUser]?.includes(to.name)) {
            return next();
        } else {

            if (to.name !== 'home') {
                return next({ name: 'home' });
            }
            return next();
        }
    } else {
        if (to.name !== 'login') {
            return next({ name: 'login' });
        }
        return next();
    }
};

