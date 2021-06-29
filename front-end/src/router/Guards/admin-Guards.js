import store from "../store";

export default (to, from, next) => {
  // if (store.getters.getUser.email ==='ammarlee16@gmail.com')
  if (store.getters.getUser)

  {
    next();
  } else {
    next("/");
  }
};
