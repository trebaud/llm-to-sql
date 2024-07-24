function getResultModel(resultCollection) {
  const User = {
    id: "",
    username: "",
    email: "",
    name: "",
    avatar: "",
    created: "",
  };

  const Post = {
    id: "",
    name: "",
    description: "",
    hidden: true,
    nb: 0,
    created: "",
  };

  let ResultModel;
  if (resultCollection === "users") {
    ResultModel = User;
  } else if (resultCollection === "posts") {
    ResultModel = Post;
  } else {
    throw new Error("Invalid result collection!");
  }

  return ResultModel;
}

module.exports = {
  getResultModel,
};
