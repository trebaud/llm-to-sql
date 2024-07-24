/// <reference path="../pb_data/types.d.ts" />
$app.rootCmd?.addCommand(
  new Command({
    use: "query",
    run: (_cmd, args) => {
      const Utils = require(`${__hooks}/utils.js`);

      const [userQuery, resultCollection] = args;
      const ResultModel = Utils.getResultModel(resultCollection);

      const result = arrayOf(new DynamicModel(ResultModel));

      $app.dao().db().newQuery(userQuery).all(result); // throw an error on db failure

      console.log(JSON.stringify(result));
    },
  }),
);
